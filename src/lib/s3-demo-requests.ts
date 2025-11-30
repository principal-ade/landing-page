import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface DemoRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  teamSize?: string;
  preferredDateTime?: string;
  message?: string;
  submittedAt: string;
  status?: 'pending' | 'contacted' | 'scheduled' | 'completed';
  metadata?: Record<string, any>;
}

export class S3DemoRequests {
  private s3Client: S3Client;
  private bucketName: string;
  private prefix = 'demo-requests/';

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
   * Generate S3 key for demo request
   */
  private getDemoRequestKey(id: string): string {
    return `${this.prefix}${id}.json`;
  }

  /**
   * Get demo request by ID
   */
  async getDemoRequest(id: string): Promise<DemoRequest | null> {
    try {
      const key = this.getDemoRequestKey(id);
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const body = await response.Body?.transformToString();

      if (!body) {
        return null;
      }

      return JSON.parse(body) as DemoRequest;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Submit a new demo request
   */
  async submitDemoRequest(
    data: {
      name: string;
      email: string;
      company?: string;
      teamSize?: string;
      preferredDateTime?: string;
      message?: string;
    },
    metadata?: Record<string, any>
  ): Promise<DemoRequest> {
    const normalizedEmail = this.normalizeEmail(data.email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    // Create new demo request
    const demoRequest: DemoRequest = {
      id: uuidv4(),
      name: data.name.trim(),
      email: normalizedEmail,
      company: data.company?.trim(),
      teamSize: data.teamSize,
      preferredDateTime: data.preferredDateTime?.trim(),
      message: data.message?.trim(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      metadata: metadata || {},
    };

    // Save to S3
    const key = this.getDemoRequestKey(demoRequest.id);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(demoRequest, null, 2),
      ContentType: 'application/json',
    }));

    return demoRequest;
  }

  /**
   * Update demo request status
   */
  async updateStatus(id: string, status: DemoRequest['status']): Promise<boolean> {
    const demoRequest = await this.getDemoRequest(id);

    if (!demoRequest) {
      return false;
    }

    demoRequest.status = status;
    if (!demoRequest.metadata) {
      demoRequest.metadata = {};
    }
    demoRequest.metadata.lastUpdatedAt = new Date().toISOString();

    const key = this.getDemoRequestKey(id);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(demoRequest, null, 2),
      ContentType: 'application/json',
    }));

    return true;
  }

  /**
   * Get all demo requests (for admin/export purposes)
   */
  async getAllDemoRequests(): Promise<DemoRequest[]> {
    const requests: DemoRequest[] = [];
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
                const request = JSON.parse(body) as DemoRequest;
                requests.push(request);
              }
            } catch (error) {
              console.error(`Error reading demo request ${object.Key}:`, error);
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
   * Export demo requests to CSV format
   */
  async exportToCSV(): Promise<string> {
    const requests = await this.getAllDemoRequests();

    const headers = [
      'ID',
      'Name',
      'Email',
      'Company',
      'Team Size',
      'Preferred Date/Time',
      'Message',
      'Status',
      'Submitted At'
    ];

    const rows = requests.map(r => [
      r.id,
      r.name,
      r.email,
      r.company || '',
      r.teamSize || '',
      r.preferredDateTime || '',
      r.message || '',
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
