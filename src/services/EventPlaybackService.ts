/**
 * EventPlaybackService
 *
 * Simplified playback controller for session events that provides:
 * - Auto-advance through events at configurable intervals
 * - Play/Pause controls
 * - Manual navigation (previous/next)
 * - Event emission for highlighting/visualization
 *
 * Inspired by EventHighlightService from electron-app but simplified for web playback.
 */

export type PlaybackSpeed = 0.5 | 1 | 2 | 5;

export interface PlaybackState {
  isPlaying: boolean;
  currentIndex: number;
  totalEvents: number;
  speed: PlaybackSpeed;
  currentEvent: Event | null;
}

interface Event {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  [key: string]: unknown;
}

type PlaybackListener = (state: PlaybackState) => void;
type EventListener = (event: Event, index: number) => void;

export class EventPlaybackService {
  private events: Event[] = [];
  private currentIndex: number = -1;
  private isPlaying: boolean = false;
  private speed: PlaybackSpeed = 1;
  private intervalId: NodeJS.Timeout | null = null;

  private playbackListeners: Set<PlaybackListener> = new Set();
  private eventListeners: Set<EventListener> = new Set();

  constructor(events: Event[] = []) {
    this.events = events;
  }

  /**
   * Load new events and reset playback state
   */
  loadEvents(events: Event[]): void {
    this.pause();
    this.events = events;
    this.currentIndex = -1;
    this.emitState();
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    return {
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      totalEvents: this.events.length,
      speed: this.speed,
      currentEvent: this.getCurrentEvent(),
    };
  }

  /**
   * Get current event
   */
  getCurrentEvent(): Event | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.events.length) {
      return this.events[this.currentIndex];
    }
    return null;
  }

  /**
   * Start playback
   */
  play(): void {
    if (this.isPlaying || this.events.length === 0) {
      return;
    }

    // If at the end, restart from beginning
    if (this.currentIndex === this.events.length - 1) {
      this.currentIndex = -1;
    }

    // If starting fresh, go to first event
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
      this.emitCurrentEvent();
    }

    this.isPlaying = true;
    this.startInterval();
    this.emitState();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;
    this.stopInterval();
    this.emitState();
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Go to next event
   */
  next(): void {
    if (this.currentIndex < this.events.length - 1) {
      this.currentIndex++;
      this.emitCurrentEvent();
    } else {
      // At the end, pause playback
      this.pause();
    }
  }

  /**
   * Go to previous event
   */
  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emitCurrentEvent();
    }
  }

  /**
   * Go to first event
   */
  goToStart(): void {
    this.pause();
    this.currentIndex = 0;
    this.emitCurrentEvent();
  }

  /**
   * Go to last event
   */
  goToEnd(): void {
    this.pause();
    this.currentIndex = this.events.length - 1;
    this.emitCurrentEvent();
  }

  /**
   * Go to specific event index
   */
  goToIndex(index: number): void {
    if (index >= 0 && index < this.events.length) {
      const wasPlaying = this.isPlaying;
      this.pause();
      this.currentIndex = index;
      this.emitCurrentEvent();
      if (wasPlaying) {
        this.play();
      }
    }
  }

  /**
   * Set playback speed
   */
  setSpeed(speed: PlaybackSpeed): void {
    this.speed = speed;

    // If playing, restart interval with new speed
    if (this.isPlaying) {
      this.stopInterval();
      this.startInterval();
    }

    this.emitState();
  }

  /**
   * Reset to beginning
   */
  reset(): void {
    this.pause();
    this.currentIndex = -1;
    this.emitState();
  }

  /**
   * Subscribe to playback state changes
   */
  onStateChange(listener: PlaybackListener): () => void {
    this.playbackListeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.playbackListeners.delete(listener);
    };
  }

  /**
   * Subscribe to individual event changes
   */
  onEventChange(listener: EventListener): () => void {
    this.eventListeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopInterval();
    this.playbackListeners.clear();
    this.eventListeners.clear();
    this.events = [];
  }

  /**
   * Start the auto-advance interval
   */
  private startInterval(): void {
    this.stopInterval();

    // Convert speed to milliseconds (base is 1 second = 1000ms)
    const intervalMs = 1000 / this.speed;

    this.intervalId = setInterval(() => {
      this.next();

      // Auto-pause at the end
      if (this.currentIndex === this.events.length - 1) {
        this.pause();
      }
    }, intervalMs);
  }

  /**
   * Stop the auto-advance interval
   */
  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Emit current event to listeners
   */
  private emitCurrentEvent(): void {
    const event = this.getCurrentEvent();
    if (event) {
      this.eventListeners.forEach(listener => {
        listener(event, this.currentIndex);
      });
    }
    this.emitState();
  }

  /**
   * Emit current state to listeners
   */
  private emitState(): void {
    const state = this.getState();
    this.playbackListeners.forEach(listener => {
      listener(state);
    });
  }
}
