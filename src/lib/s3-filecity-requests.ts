import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface FileCityRequest {
  id: string;
  email: string;
  repoUrl: string;
  submittedAt: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export class S3FileCityRequests {
  private s3Client: S3Client;
  private bucketName: string;
  private prefix = 'filecity-requests/';

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
   * Normalize GitHub URL to consistent format
   */
  private normalizeRepoUrl(url: string): string {
    let normalized = url.trim().toLowerCase();

    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');

    // Add https:// if missing
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }

    // Convert http to https
    normalized = normalized.replace(/^http:\/\//, 'https://');

    return normalized;
  }

  /**
   * Validate GitHub repository URL
   */
  private isValidGitHubUrl(url: string): boolean {
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
    return githubRegex.test(url);
  }

  /**
   * Generate S3 key for File City request
   */
  private getFileCityRequestKey(id: string): string {
    return `${this.prefix}${id}.json`;
  }

  /**
   * Get File City request by ID
   */
  async getFileCityRequest(id: string): Promise<FileCityRequest | null> {
    try {
      const key = this.getFileCityRequestKey(id);
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const body = await response.Body?.transformToString();

      if (!body) {
        return null;
      }

      return JSON.parse(body) as FileCityRequest;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Submit a new File City request
   */
  async submitFileCityRequest(
    data: {
      email: string;
      repoUrl: string;
    },
    metadata?: Record<string, any>
  ): Promise<FileCityRequest> {
    const normalizedEmail = this.normalizeEmail(data.email);
    const normalizedRepoUrl = this.normalizeRepoUrl(data.repoUrl);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Validate GitHub URL
    if (!this.isValidGitHubUrl(normalizedRepoUrl)) {
      throw new Error('Invalid GitHub repository URL. Please use format: github.com/owner/repo');
    }

    // Create new File City request
    const fileCityRequest: FileCityRequest = {
      id: uuidv4(),
      email: normalizedEmail,
      repoUrl: normalizedRepoUrl,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      metadata: metadata || {},
    };

    // Save to S3
    const key = this.getFileCityRequestKey(fileCityRequest.id);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(fileCityRequest, null, 2),
      ContentType: 'application/json',
    }));

    return fileCityRequest;
  }

  /**
   * Update File City request status
   */
  async updateStatus(id: string, status: FileCityRequest['status']): Promise<boolean> {
    const fileCityRequest = await this.getFileCityRequest(id);

    if (!fileCityRequest) {
      return false;
    }

    fileCityRequest.status = status;
    if (!fileCityRequest.metadata) {
      fileCityRequest.metadata = {};
    }
    fileCityRequest.metadata.lastUpdatedAt = new Date().toISOString();

    const key = this.getFileCityRequestKey(id);
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(fileCityRequest, null, 2),
      ContentType: 'application/json',
    }));

    return true;
  }

  /**
   * Get all File City requests (for admin/export purposes)
   */
  async getAllFileCityRequests(): Promise<FileCityRequest[]> {
    const requests: FileCityRequest[] = [];
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
                const request = JSON.parse(body) as FileCityRequest;
                requests.push(request);
              }
            } catch (error) {
              console.error(`Error reading File City request ${object.Key}:`, error);
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
   * Export File City requests to CSV format
   */
  async exportToCSV(): Promise<string> {
    const requests = await this.getAllFileCityRequests();

    const headers = [
      'ID',
      'Email',
      'Repository URL',
      'Status',
      'Submitted At'
    ];

    const rows = requests.map(r => [
      r.id,
      r.email,
      r.repoUrl,
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
