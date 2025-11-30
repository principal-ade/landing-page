import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source?: string; // e.g., 'footer', 'landing-page', 'blog'
  verified?: boolean;
  unsubscribedAt?: string;
  metadata?: Record<string, any>;
}

export class S3PrincipalAIEmailList {
  private s3Client: S3Client;
  private bucketName: string;
  private prefix = 'email-list/';

  constructor(bucketName?: string, region?: string) {
    this.bucketName = bucketName || process.env.EMAIL_LIST_S3_BUCKET || '';

    if (!this.bucketName) {
      throw new Error('S3 bucket name is required. Set EMAIL_LIST_S3_BUCKET environment variable.');
    }

    // App Runner will use IAM role-based access - no credentials needed
    this.s3Client = new S3Client({
      region: region || process.env.AWS_REGION || 'us-east-1',
    });
  }

  /**
   * Normalize email to lowercase for consistent storage
   */
  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Generate S3 key for subscriber
   */
  private getSubscriberKey(email: string): string {
    const normalized = this.normalizeEmail(email);
    // Use email hash for privacy and to handle special characters
    const emailHash = Buffer.from(normalized).toString('base64url');
    return `${this.prefix}subscribers/${emailHash}.json`;
  }

  /**
   * Get subscriber by email
   */
  async getSubscriber(email: string): Promise<EmailSubscriber | null> {
    try {
      const key = this.getSubscriberKey(email);
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const body = await response.Body?.transformToString();

      if (!body) {
        return null;
      }

      return JSON.parse(body) as EmailSubscriber;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Add or update subscriber
   */
  async subscribe(
    email: string,
    source?: string,
    metadata?: Record<string, any>
  ): Promise<EmailSubscriber> {
    const normalizedEmail = this.normalizeEmail(email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Check if subscriber already exists
    const existingSubscriber = await this.getSubscriber(normalizedEmail);

    let subscriber: EmailSubscriber;

    if (existingSubscriber) {
      // Reactivate if previously unsubscribed
      subscriber = {
        ...existingSubscriber,
        email: normalizedEmail,
        unsubscribedAt: undefined,
        verified: existingSubscriber.verified,
        metadata: {
          ...existingSubscriber.metadata,
          ...metadata,
          lastResubscribedAt: new Date().toISOString(),
        },
      };
    } else {
      // Create new subscriber
      subscriber = {
        id: uuidv4(),
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
        source: source || 'unknown',
        verified: false,
        metadata: metadata || {},
      };
    }

    // Save to S3
    const key = this.getSubscriberKey(normalizedEmail);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(subscriber, null, 2),
      ContentType: 'application/json',
    }));

    return subscriber;
  }

  /**
   * Unsubscribe a user
   */
  async unsubscribe(email: string): Promise<boolean> {
    const subscriber = await this.getSubscriber(email);

    if (!subscriber) {
      return false;
    }

    subscriber.unsubscribedAt = new Date().toISOString();

    const key = this.getSubscriberKey(email);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(subscriber, null, 2),
      ContentType: 'application/json',
    }));

    return true;
  }

  /**
   * Mark subscriber as verified
   */
  async verifySubscriber(email: string): Promise<boolean> {
    const subscriber = await this.getSubscriber(email);

    if (!subscriber) {
      return false;
    }

    subscriber.verified = true;
    if (!subscriber.metadata) {
      subscriber.metadata = {};
    }
    subscriber.metadata.verifiedAt = new Date().toISOString();

    const key = this.getSubscriberKey(email);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(subscriber, null, 2),
      ContentType: 'application/json',
    }));

    return true;
  }

  /**
   * Get all subscribers (for admin/export purposes)
   */
  async getAllSubscribers(includeUnsubscribed = false): Promise<EmailSubscriber[]> {
    const subscribers: EmailSubscriber[] = [];
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: `${this.prefix}subscribers/`,
        ContinuationToken: continuationToken,
      });

      const response = await this.s3Client.send(command);

      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key) {
            try {
              const getCommand = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: object.Key,
              });
              const objResponse = await this.s3Client.send(getCommand);
              const body = await objResponse.Body?.transformToString();

              if (body) {
                const subscriber = JSON.parse(body) as EmailSubscriber;

                // Filter out unsubscribed unless requested
                if (includeUnsubscribed || !subscriber.unsubscribedAt) {
                  subscribers.push(subscriber);
                }
              }
            } catch (error) {
              console.error(`Error reading subscriber ${object.Key}:`, error);
            }
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return subscribers;
  }

  /**
   * Export subscribers to CSV format
   */
  async exportToCSV(includeUnsubscribed = false): Promise<string> {
    const subscribers = await this.getAllSubscribers(includeUnsubscribed);

    const headers = ['ID', 'Email', 'Subscribed At', 'Source', 'Verified', 'Unsubscribed At'];
    const rows = subscribers.map(s => [
      s.id,
      s.email,
      s.subscribedAt,
      s.source || '',
      s.verified ? 'Yes' : 'No',
      s.unsubscribedAt || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }
}
