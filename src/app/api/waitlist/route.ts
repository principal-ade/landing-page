import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize S3 client
function getS3Client() {
  const region = process.env.AWS_REGION || 'us-east-1';

  return new S3Client({
    region,
    // Credentials are optional - will use IAM role on App Runner
    // or local AWS credentials if available
    credentials: process.env.AWS_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      : undefined,
  });
}

// Get the S3 bucket for waitlist storage
function getWaitlistBucket(): string {
  // Use the feedback bucket for waitlist storage (can be changed to a dedicated bucket if needed)
  const bucket = process.env.FEEDBACK_S3_BUCKET || process.env.WAITLIST_S3_BUCKET;

  if (!bucket) {
    throw new Error("FEEDBACK_S3_BUCKET or WAITLIST_S3_BUCKET environment variable is required");
  }

  return bucket;
}

/**
 * Check if an email already exists in the waitlist
 */
async function checkEmailExists(s3: S3Client, bucket: string, source: string, email: string): Promise<boolean> {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `waitlist/${source}/`,
    });

    const response = await s3.send(listCommand);

    if (response.Contents) {
      // Check if any file contains this email
      for (const file of response.Contents) {
        if (file.Key?.includes(email.replace('@', '_at_'))) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking email existence:", error);
    // If we can't check, assume it doesn't exist to avoid blocking submissions
    return false;
  }
}

/**
 * POST /api/waitlist - Add email to waitlist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = "a24z-landing", timestamp = new Date().toISOString() } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate source
    if (typeof source !== "string") {
      return NextResponse.json(
        { error: "Invalid source format" },
        { status: 400 }
      );
    }

    // Initialize S3
    const s3 = getS3Client();
    const bucket = getWaitlistBucket();

    // Check for duplicate email
    const emailExists = await checkEmailExists(s3, bucket, source, email);
    if (emailExists) {
      // Return success to avoid revealing that the email exists
      return NextResponse.json({
        success: true,
        message: "Email added to waitlist",
        id: `existing-${uuidv4().slice(0, 8)}`,
      });
    }

    // Generate unique ID
    const id = uuidv4();
    const shortId = id.slice(0, 8);

    // Prepare data for storage
    const waitlistEntry = {
      id,
      email,
      source,
      timestamp,
      metadata: {
        userAgent: request.headers.get("user-agent") || "unknown",
        referrer: request.headers.get("referer") || "direct",
        ip: request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown",
      },
    };

    // Create safe filename (replace @ with _at_ to avoid issues)
    const safeEmail = email.replace('@', '_at_');
    const key = `waitlist/${source}/${timestamp.split('T')[0]}/${shortId}-${safeEmail}.json`;

    // Store in S3
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(waitlistEntry, null, 2),
      ContentType: "application/json",
      Metadata: {
        email,
        source,
        timestamp,
      },
    });

    await s3.send(putCommand);

    // Log for monitoring
    console.log(`Waitlist entry added: ${email} from ${source} at ${timestamp}`);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Email added to waitlist",
      id: shortId,
    });

  } catch (error) {
    console.error("Waitlist submission error:", error);

    // Check for specific AWS errors
    if (error instanceof Error) {
      if (error.message.includes("AWS")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to add to waitlist" },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/waitlist - Handle CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}