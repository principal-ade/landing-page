export interface SyncEvent {
  id: string;
  timestamp: number;
  initiatorHash: string;
  propagationTimes: number[]; // Time to reach each other user in ms
  avgLatency: number;
}

export interface CollisionEvent {
  id: string;
  timestamp: number;
  userHashes: string[];
  resourceType: string; // Just file extension, e.g., ".tsx"
  resolved: boolean;
  resolutionTime?: number; // ms to resolve
}

export interface MetricsData {
  avgSyncLatency: number; // Average time for sync to propagate (ms)
  timeBetweenSyncs: number; // Average time between sync events (seconds)
  collisionRate: number; // Collisions per minute
  activeUsers: number;
  recentSyncs: SyncEvent[];
  recentCollisions: CollisionEvent[];
  syncVelocity: number; // Syncs per minute
}

export interface LiveEvent {
  id: string;
  type: "sync" | "collision" | "activity";
  timestamp: number;
  latency?: number;
  userCount?: number;
  fileType?: string;
  resolved?: boolean;
  description?: string;
}
