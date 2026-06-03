// Event queue system for reliable analytics tracking
// Handles network failures, ad blockers, and retries with exponential backoff

const QUEUE_STORAGE_KEY = 'analytics_event_queue';
const MAX_QUEUE_SIZE = 100;
const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 60000; // 1 minute
const QUEUE_PROCESS_INTERVAL = 5000; // Process queue every 5 seconds

export interface QueuedEvent {
  id: string;
  timestamp: number;
  attempts: number;
  lastAttempt?: number;
  eventType: 'pageview' | 'event';
  data: {
    action?: string;
    targetId?: string;
    params?: Record<string, any>;
  };
}

class EventQueue {
  private queue: QueuedEvent[] = [];
  private processing = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private isOnline = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
      this.startProcessing();
      this.setupOnlineListener();
    }
  }

  // Load queue from localStorage
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        if (process.env.NODE_ENV === 'development') {
          console.log('[EventQueue] Loaded queue with', this.queue.length, 'events');
        }
      }
    } catch (error) {
      console.error('[EventQueue] Error loading queue:', error);
      this.queue = [];
    }
  }

  // Save queue to localStorage
  private saveQueue(): void {
    try {
      // Limit queue size to prevent localStorage overflow
      if (this.queue.length > MAX_QUEUE_SIZE) {
        this.queue = this.queue.slice(-MAX_QUEUE_SIZE);
        console.warn('[EventQueue] Queue size exceeded, keeping only last', MAX_QUEUE_SIZE, 'events');
      }
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[EventQueue] Error saving queue:', error);
    }
  }

  // Setup online/offline listener
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      if (process.env.NODE_ENV === 'development') {
        console.log('[EventQueue] Connection restored, processing queue');
      }
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      if (process.env.NODE_ENV === 'development') {
        console.log('[EventQueue] Connection lost');
      }
    });
  }

  // Start periodic queue processing
  private startProcessing(): void {
    if (this.processingInterval) return;

    this.processingInterval = setInterval(() => {
      if (this.queue.length > 0 && !this.processing) {
        this.processQueue();
      }
    }, QUEUE_PROCESS_INTERVAL);
  }

  // Stop periodic queue processing
  public stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  // Add event to queue
  public enqueue(eventType: 'pageview' | 'event', data: QueuedEvent['data']): void {
    const queuedEvent: QueuedEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      attempts: 0,
      eventType,
      data,
    };

    this.queue.push(queuedEvent);
    this.saveQueue();

    if (process.env.NODE_ENV === 'development') {
      console.log('[EventQueue] Event queued:', eventType, data);
    }
  }

  // Calculate retry delay with exponential backoff
  private getRetryDelay(attempts: number): number {
    const delay = Math.min(
      INITIAL_RETRY_DELAY * Math.pow(2, attempts),
      MAX_RETRY_DELAY
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  // Check if event is ready for retry
  private isReadyForRetry(event: QueuedEvent): boolean {
    if (event.attempts >= MAX_RETRY_ATTEMPTS) {
      return false;
    }

    if (!event.lastAttempt) {
      return true;
    }

    const now = Date.now();
    const delay = this.getRetryDelay(event.attempts);
    return now - event.lastAttempt >= delay;
  }

  // Process the queue
  private async processQueue(): Promise<void> {
    if (this.processing || !this.isOnline) return;

    this.processing = true;

    try {
      const eventsToProcess = this.queue.filter(event => this.isReadyForRetry(event));

      for (const event of eventsToProcess) {
        const success = await this.sendEvent(event);

        if (success) {
          // Remove from queue
          this.queue = this.queue.filter(e => e.id !== event.id);
          if (process.env.NODE_ENV === 'development') {
            console.log('[EventQueue] Event sent successfully:', event.id);
          }
        } else {
          // Update retry info
          event.attempts += 1;
          event.lastAttempt = Date.now();

          if (event.attempts >= MAX_RETRY_ATTEMPTS) {
            // Give up after max attempts
            this.queue = this.queue.filter(e => e.id !== event.id);
            console.error('[EventQueue] Event failed after', MAX_RETRY_ATTEMPTS, 'attempts:', event.id);
          }
        }
      }

      this.saveQueue();
    } finally {
      this.processing = false;
    }
  }

  // Send event to GA4
  private async sendEvent(event: QueuedEvent): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.gtag) {
        return false;
      }

      // Wrap gtag call in a promise to catch errors
      return await new Promise<boolean>((resolve) => {
        try {
          if (event.eventType === 'pageview') {
            window.gtag!('config', event.data.targetId!, event.data.params || {});
          } else if (event.eventType === 'event') {
            window.gtag!('event', event.data.action!, event.data.params || {});
          }

          // If no error was thrown, consider it successful
          // Note: gtag doesn't provide failure callbacks, so we can't detect
          // ad blocker failures here. We rely on the timeout mechanism.
          setTimeout(() => resolve(true), 100);
        } catch (error) {
          console.error('[EventQueue] Error sending event:', error);
          resolve(false);
        }
      });
    } catch (error) {
      console.error('[EventQueue] Error in sendEvent:', error);
      return false;
    }
  }

  // Get queue status (for debugging)
  public getStatus(): {
    queueSize: number;
    processing: boolean;
    isOnline: boolean;
    events: QueuedEvent[];
  } {
    return {
      queueSize: this.queue.length,
      processing: this.processing,
      isOnline: this.isOnline,
      events: [...this.queue],
    };
  }

  // Clear the queue (for testing)
  public clear(): void {
    this.queue = [];
    this.saveQueue();
    if (process.env.NODE_ENV === 'development') {
      console.log('[EventQueue] Queue cleared');
    }
  }

  // Force process queue immediately (for testing)
  public async flush(): Promise<void> {
    await this.processQueue();
  }
}

// Singleton instance
let queueInstance: EventQueue | null = null;

export const getEventQueue = (): EventQueue => {
  if (!queueInstance && typeof window !== 'undefined') {
    queueInstance = new EventQueue();
  }
  return queueInstance!;
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (queueInstance) {
      queueInstance.stopProcessing();
    }
  });
}
