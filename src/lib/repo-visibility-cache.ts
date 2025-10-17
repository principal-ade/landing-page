import crypto from 'crypto';

interface CacheEntry {
  isPublic: boolean;
  timestamp: number;
}

class RepoVisibilityCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number;

  constructor(ttlMs: number = 1000 * 60 * 60) { // Default 1 hour TTL
    this.ttl = ttlMs;
  }

  /**
   * Generate a hash key from repo owner and name
   */
  private hash(owner: string, name: string): string {
    const input = `${owner}/${name}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Get cached visibility status for a repository
   * Returns null if not in cache or expired
   */
  get(owner: string, name: string): boolean | null {
    const key = this.hash(owner, name);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.isPublic;
  }

  /**
   * Set visibility status for a repository
   */
  set(owner: string, name: string, isPublic: boolean): void {
    const key = this.hash(owner, name);
    this.cache.set(key, {
      isPublic,
      timestamp: Date.now()
    });
  }

  /**
   * Check if repository is in cache and not expired
   */
  has(owner: string, name: string): boolean {
    const value = this.get(owner, name);
    return value !== null;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries from cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  stats() {
    return {
      size: this.cache.size,
      ttl: this.ttl
    };
  }
}

// Export a singleton instance with 1 hour TTL
export const repoVisibilityCache = new RepoVisibilityCache(1000 * 60 * 60);
