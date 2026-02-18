import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface EarlyAccessRequest {
  id: string;
  email: string;
  role: string;
  teamSize: string;
  submittedAt: string;
  status?: 'pending' | 'approved' | 'contacted' | 'granted';
  metadata?: Record<string, any>;
}

export class S3EarlyAccessRequests {
  private s3Client: S3Client;
  private bucketName: string;
  private prefix = 'early-access/';

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
   * Generate S3 key for early access request
   */
  private getEarlyAccessRequestKey(id: string): string {
    return `${this.prefix}${id}.json`;
  }

  /**
   * Get early access request by ID
   */
  async getEarlyAccessRequest(id: string): Promise<EarlyAccessRequest | null> {
    try {
      const key = this.getEarlyAccessRequestKey(id);
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const body = await response.Body?.transformToString();

      if (!body) {
        return null;
      }

      return JSON.parse(body) as EarlyAccessRequest;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Submit a new early access request
   */
  async submitEarlyAccessRequest(
    data: {
      email: string;
      role: string;
      teamSize: string;
    },
    metadata?: Record<string, any>
  ): Promise<EarlyAccessRequest> {
    const normalizedEmail = this.normalizeEmail(data.email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Validate required fields
    if (!data.role || data.role.trim().length === 0) {
      throw new Error('Role is required');
    }

    if (!data.teamSize || data.teamSize.trim().length === 0) {
      throw new Error('Team size is required');
    }

    // Create new early access request
    const earlyAccessRequest: EarlyAccessRequest = {
      id: uuidv4(),
      email: normalizedEmail,
      role: data.role.trim(),
      teamSize: data.teamSize.trim(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      metadata: metadata || {},
    };

    // Save to S3
    const key = this.getEarlyAccessRequestKey(earlyAccessRequest.id);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(earlyAccessRequest, null, 2),
      ContentType: 'application/json',
    }));

    return earlyAccessRequest;
  }

  /**
   * Update early access request status
   */
  async updateStatus(id: string, status: EarlyAccessRequest['status']): Promise<boolean> {
    const earlyAccessRequest = await this.getEarlyAccessRequest(id);

    if (!earlyAccessRequest) {
      return false;
    }

    earlyAccessRequest.status = status;
    if (!earlyAccessRequest.metadata) {
      earlyAccessRequest.metadata = {};
    }
    earlyAccessRequest.metadata.lastUpdatedAt = new Date().toISOString();

    const key = this.getEarlyAccessRequestKey(id);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(earlyAccessRequest, null, 2),
      ContentType: 'application/json',
    }));

    return true;
  }

  /**
   * Get all early access requests (for admin/export purposes)
   */
  async getAllEarlyAccessRequests(): Promise<EarlyAccessRequest[]> {
    const requests: EarlyAccessRequest[] = [];
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: this.prefix,
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
                const request = JSON.parse(body) as EarlyAccessRequest;
                requests.push(request);
              }
            } catch (error) {
              console.error(`Error reading early access request ${object.Key}:`, error);
            }
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    // Sort by submission date (newest first)
    return requests.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  /**
   * Export early access requests to CSV format
   */
  async exportToCSV(): Promise<string> {
    const requests = await this.getAllEarlyAccessRequests();

    const headers = [
      'ID',
      'Email',
      'Role',
      'Team Size',
      'Status',
      'Submitted At'
    ];

    const rows = requests.map(r => [
      r.id,
      r.email,
      r.role,
      r.teamSize,
      r.status || 'pending',
      r.submittedAt,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csv;
  }
}
