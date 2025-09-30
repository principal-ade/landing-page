import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import type { 
  AlexandriaRepository, 
  GithubRepository,
  AlexandriaRepositoryRegistry 
} from 'a24z-memory/dist/pure-core/types/repository';
import type { CodebaseViewSummary } from 'a24z-memory/dist/pure-core/types/summary';

/**
 * S3 Store for managing Alexandria repository registry
 * Stores repository metadata and tracks which repos have .alexandria documentation
 */
export class S3AlexandriaStore {
  private s3Client: S3Client;
  private bucketName: string;
  private objectKey: string = 'alexandria/registry.json';

  constructor() {
    // Use same bucket as PR image store
    this.bucketName = process.env.ORBIT_S3_BUCKET || 'code-city-orbit';
    
    // Initialize S3 client - uses IAM roles on AWS services
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  /**
   * Get all registered repositories
   */
  async getRepositories(): Promise<AlexandriaRepositoryRegistry> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: this.objectKey,
      });

      const response = await this.s3Client.send(command);
      const data = await response.Body?.transformToString();
      
      if (!data) {
        return { 
          repositories: [], 
          total: 0,
          lastUpdated: new Date().toISOString() 
        };
      }

      const registryData = JSON.parse(data) as AlexandriaRepositoryRegistry;
      
      // Sort by most recently checked/updated
      registryData.repositories.sort((a, b) => {
        const dateA = a.lastChecked || a.registeredAt;
        const dateB = b.lastChecked || b.registeredAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      
      return registryData;
    } catch (error: any) {
      if (error.Code === 'NoSuchKey' || error.name === 'NoSuchKey') {
        // File doesn't exist yet
        return { 
          repositories: [], 
          total: 0,
          lastUpdated: new Date().toISOString() 
        };
      }
      throw error;
    }
  }

  /**
   * Get a specific repository by owner and name
   */
  async getRepository(owner: string, name: string): Promise<AlexandriaRepository | null> {
    const data = await this.getRepositories();
    const repo = data.repositories.find(r => {
      // Check if repository name matches and if github metadata matches owner
      return r.name.toLowerCase() === name.toLowerCase() && 
             r.github?.owner?.toLowerCase() === owner.toLowerCase();
    });
    return repo || null;
  }

  /**
   * Register or update a repository  
   * Returns true if newly registered, false if updated
   */
  async registerRepository(
    owner: string,
    name: string,
    githubData?: GithubRepository,
    viewData?: { hasViews: boolean; viewCount: number; views: CodebaseViewSummary[] }
  ): Promise<boolean> {
    if (!owner || !name) {
      throw new Error('Owner and name are required');
    }

    const data = await this.getRepositories();
    
    // Find existing repository
    const existingIndex = data.repositories.findIndex(r => 
      r.name.toLowerCase() === name.toLowerCase() && 
      r.github?.owner?.toLowerCase() === owner.toLowerCase()
    );

    const now = new Date().toISOString();
    const isNew = existingIndex === -1;

    if (isNew) {
      // New repository
      const newRepo: AlexandriaRepository = {
        name: name,
        registeredAt: now,
        hasViews: viewData?.hasViews || false,
        viewCount: viewData?.viewCount || 0,
        views: viewData?.views || [],
        lastChecked: now,
        // Add GitHub metadata if provided
        ...(githubData && { 
          github: {
            ...githubData,
            id: `${owner}/${name}`,
            owner: owner,
            name: name
          }
        })
      };
      
      data.repositories.push(newRepo);
      data.total = data.repositories.length;
    } else {
      // Update existing repository
      const existing = data.repositories[existingIndex];
      data.repositories[existingIndex] = {
        ...existing,
        hasViews: viewData?.hasViews ?? existing.hasViews,
        viewCount: viewData?.viewCount ?? existing.viewCount,
        views: viewData?.views ?? existing.views,
        lastChecked: now,
        // Update GitHub metadata if provided
        ...(githubData && { 
          github: {
            ...githubData,
            id: `${owner}/${name}`,
            owner: owner,
            name: name
          }
        })
      };
    }

    data.lastUpdated = now;

    // Save back to S3
    await this.saveRegistry(data);
    
    return isNew;
  }

  /**
   * Update repository statistics (e.g., after fetching views)
   */
  async updateRepositoryStats(
    owner: string, 
    name: string, 
    updates: {
      hasViews?: boolean;
      viewCount?: number;
      views?: CodebaseViewSummary[];
      github?: GithubRepository;
    }
  ): Promise<void> {
    const data = await this.getRepositories();
    
    const index = data.repositories.findIndex(r => 
      r.name.toLowerCase() === name.toLowerCase() && 
      r.github?.owner?.toLowerCase() === owner.toLowerCase()
    );

    if (index === -1) {
      throw new Error(`Repository ${owner}/${name} not found in registry`);
    }

    const now = new Date().toISOString();
    data.repositories[index] = {
      ...data.repositories[index],
      ...(updates.hasViews !== undefined && { hasViews: updates.hasViews }),
      ...(updates.viewCount !== undefined && { viewCount: updates.viewCount }),
      ...(updates.views && { views: updates.views }),
      ...(updates.github && { github: updates.github }),
      lastChecked: now,
    };

    data.lastUpdated = now;
    await this.saveRegistry(data);
  }

  /**
   * Remove a repository from the registry
   */
  async removeRepository(owner: string, name: string): Promise<void> {
    const data = await this.getRepositories();
    
    const initialLength = data.repositories.length;
    data.repositories = data.repositories.filter(r => 
      !(r.name.toLowerCase() === name.toLowerCase() && 
        r.github?.owner?.toLowerCase() === owner.toLowerCase())
    );

    if (data.repositories.length === initialLength) {
      throw new Error(`Repository ${owner}/${name} not found in registry`);
    }

    data.total = data.repositories.length;
    data.lastUpdated = new Date().toISOString();
    await this.saveRegistry(data);
  }

  /**
   * Save registry data to S3
   */
  private async saveRegistry(data: AlexandriaRepositoryRegistry): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.objectKey,
      Body: JSON.stringify(data, null, 2),
      ContentType: 'application/json',
    });

    await this.s3Client.send(command);
  }

  /**
   * Check if S3 bucket is accessible
   */
  async checkConnection(): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: this.objectKey,
      });
      
      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      // Check both error.name and error.Code for compatibility
      if (error.name === 'NotFound' || error.Code === 'NotFound' ||
          error.name === 'NoSuchKey' || error.Code === 'NoSuchKey' ||
          error.$metadata?.httpStatusCode === 404) {
        // File doesn't exist but bucket is accessible
        return true;
      }
      console.error('S3 connection check failed:', error);
      return false;
    }
  }
}