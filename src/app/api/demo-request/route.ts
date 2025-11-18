import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, teamSize, preferredDateTime, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
New Demo Request

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Team Size: ${teamSize || "Not provided"}
Preferred Date/Time: ${preferredDateTime || "Not provided"}

Message:
${message || "No message provided"}

---
Sent from Principal AI Demo Request Form
    `.trim();

    // Send email using a simple mailto fallback
    // In production, you would use a service like SendGrid, AWS SES, or Resend
    console.log("Demo request received:", emailContent);

    // For now, we'll return success and you can check your server logs
    // You can replace this with actual email sending logic

    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@principal-ai.com',
    //   to: 'info@noetic-labs.com',
    //   subject: `Demo Request from ${name}`,
    //   text: emailContent,
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Demo request received. We'll be in touch soon!"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing demo request:", error);
    return NextResponse.json(
      { error: "Failed to process demo request" },
      { status: 500 }
    );
  }
}
