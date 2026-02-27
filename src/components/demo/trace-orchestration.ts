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
 * Demo registry that fetches the kanban panel schematic
 * from our local API route.
 */
class DemoRegistry implements StoryboardRegistryInterface {
  private schematicCache: VersionSnapshot | null = null;
  private fetchPromise: Promise<VersionSnapshot | null> | null = null;

  async lookupByScope(
    _scope: { name: string; version: string },
    _resource: { attributes?: Record<string, unknown> }
  ): Promise<VersionSnapshot | null> {
    // For the demo, all scopes map to our kanban panel schematic
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

    // Fetch from our API route
    this.fetchPromise = this.fetchSchematic();
    const result = await this.fetchPromise;
    this.fetchPromise = null;

    return result;
  }

  private async fetchSchematic(): Promise<VersionSnapshot | null> {
    try {
      const response = await fetch('/api/schematics/kanban-panel');
      if (!response.ok) {
        console.error('[DemoRegistry] Failed to fetch schematic:', response.status);
        return null;
      }

      const schematic: VersionSnapshot = await response.json();
      this.schematicCache = schematic;

      console.log('[DemoRegistry] Schematic loaded:', {
        storyboardCount: schematic.storyboards?.length || 0,
      });

      return schematic;
    } catch (error) {
      console.error('[DemoRegistry] Schematic fetch error:', error);
      return null;
    }
  }

  async listScopes(): Promise<Array<{ name: string; versions: string[] }>> {
    return [];
  }

  supportsHotReload(): boolean {
    return false;
  }

  /**
   * Pre-load the schematic for faster first trace processing
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
