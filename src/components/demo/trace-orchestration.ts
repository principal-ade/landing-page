/**
 * Trace Orchestration Setup for Demo Page
 *
 * Sets up TraceOrchestrator with a demo-specific registry
 * that fetches the kanban panel schematic from our local API.
 */

import {
  TraceOrchestrator,
  type OtelExportTraceServiceRequest,
  type RegisteredTrace,
  type StoryboardRegistryInterface,
  type VersionSnapshot,
} from '@principal-ai/principal-view-core';

/**
 * Schematic API endpoints to fetch
 */
const SCHEMATIC_ENDPOINTS = [
  '/api/schematics/kanban-panel',
  '/api/schematics/backlog-core',
];

/**
 * Demo registry that fetches multiple schematics and merges them.
 */
class DemoRegistry implements StoryboardRegistryInterface {
  private schematicCache: VersionSnapshot | null = null;
  private fetchPromise: Promise<VersionSnapshot | null> | null = null;

  async lookupByScope(
    _scope: { name: string; version: string },
    _resource: { attributes?: Record<string, unknown> }
  ): Promise<VersionSnapshot | null> {
    // For the demo, return the merged schematic containing all storyboards
    // In production, you'd use RemoteRegistry with proper PURL lookups
    return this.getSchematic();
  }

  private async getSchematic(): Promise<VersionSnapshot | null> {
    // Return cached schematic if available
    if (this.schematicCache) {
      return this.schematicCache;
    }

    // If already fetching, wait for that promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Fetch from our API routes
    this.fetchPromise = this.fetchAndMergeSchematics();
    const result = await this.fetchPromise;
    this.fetchPromise = null;

    return result;
  }

  private async fetchAndMergeSchematics(): Promise<VersionSnapshot | null> {
    const schematics: VersionSnapshot[] = [];

    for (const endpoint of SCHEMATIC_ENDPOINTS) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const schematic: VersionSnapshot = await response.json();
          schematics.push(schematic);
          console.log(`[DemoRegistry] Loaded schematic from ${endpoint}:`, {
            storyboardCount: schematic.storyboards?.length || 0,
          });
        } else {
          console.warn(`[DemoRegistry] Failed to fetch ${endpoint}:`, response.status);
        }
      } catch (error) {
        console.error(`[DemoRegistry] Error fetching ${endpoint}:`, error);
      }
    }

    if (schematics.length === 0) {
      console.error('[DemoRegistry] No schematics loaded');
      return null;
    }

    // Merge all schematics into one - combine storyboards from all sources
    const mergedSchematic: VersionSnapshot = {
      ...schematics[0],
      storyboards: schematics.flatMap(s => s.storyboards || []),
    };

    this.schematicCache = mergedSchematic;

    console.log('[DemoRegistry] Merged schematics:', {
      totalStoryboards: mergedSchematic.storyboards?.length || 0,
      sources: schematics.length,
    });

    return mergedSchematic;
  }

  async listScopes(): Promise<Array<{ name: string; versions: string[] }>> {
    return [];
  }

  supportsHotReload(): boolean {
    return false;
  }

  /**
   * Pre-load the schematics for faster first trace processing
   */
  async preload(): Promise<void> {
    await this.getSchematic();
  }
}

// Singleton instances
let orchestratorInstance: TraceOrchestrator | null = null;
let registryInstance: DemoRegistry | null = null;

/**
 * Get or create the TraceOrchestrator instance
 */
export function getOrchestrator(): TraceOrchestrator {
  if (!orchestratorInstance) {
    registryInstance = new DemoRegistry();
    orchestratorInstance = new TraceOrchestrator({
      registry: registryInstance,
      enableValidation: true,
    });
  }
  return orchestratorInstance;
}

/**
 * Pre-load the schematic (call on component mount)
 */
export async function preloadSchematic(): Promise<void> {
  if (!registryInstance) {
    getOrchestrator(); // Initialize
  }
  await registryInstance?.preload();
}

/**
 * Process an OTLP trace through the orchestrator
 */
export async function processTrace(
  otlpData: OtelExportTraceServiceRequest
): Promise<RegisteredTrace> {
  const orchestrator = getOrchestrator();
  return orchestrator.processTrace(otlpData);
}
