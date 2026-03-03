/**
 * Trace Orchestration Setup for Demo Page
 *
 * Sets up TraceOrchestrator with RemoteRegistry, preloading schematics
 * from our local API routes so owned-scopes are registered before traces arrive.
 */

import {
  TraceOrchestrator,
  RemoteRegistry,
  type OtelExportTraceServiceRequest,
  type RegisteredTrace,
  type VersionSnapshot,
} from '@principal-ai/principal-view-core';

/**
 * Schematic API endpoints to preload
 */
const SCHEMATIC_ENDPOINTS = [
  '/api/schematics/kanban-panel',
  '/api/schematics/backlog-core',
];

// Singleton instances
let orchestratorInstance: TraceOrchestrator | null = null;
let registryInstance: RemoteRegistry | null = null;

/**
 * Get or create the TraceOrchestrator instance
 */
export function getOrchestrator(): TraceOrchestrator {
  if (!orchestratorInstance) {
    // Create RemoteRegistry - we'll use registerSchematic for preloading
    // The apiBaseUrl is not used when we preload directly
    registryInstance = new RemoteRegistry('https://app.principal-ade.com');

    orchestratorInstance = new TraceOrchestrator({
      registry: registryInstance,
      enableValidation: true,
    });
  }
  return orchestratorInstance;
}

/**
 * Pre-load schematics from local API routes
 *
 * This fetches schematics and registers them with RemoteRegistry,
 * populating the owned-scopes mapping before traces arrive.
 */
export async function preloadSchematic(): Promise<void> {
  // Ensure registry is initialized
  if (!registryInstance) {
    getOrchestrator();
  }

  const allScopes: string[] = [];

  for (const endpoint of SCHEMATIC_ENDPOINTS) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const schematic: VersionSnapshot = await response.json();

        // Register the schematic with RemoteRegistry
        const scopes = registryInstance!.registerSchematic(schematic);
        allScopes.push(...scopes);

        console.log(`[TraceOrchestration] Loaded schematic from ${endpoint}:`, {
          storyboardCount: schematic.storyboards?.length || 0,
          registeredScopes: scopes,
        });
      } else {
        console.warn(`[TraceOrchestration] Failed to fetch ${endpoint}:`, response.status);
      }
    } catch (error) {
      console.error(`[TraceOrchestration] Error fetching ${endpoint}:`, error);
    }
  }

  console.log('[TraceOrchestration] Preload complete:', {
    totalScopes: allScopes.length,
    scopes: allScopes,
  });
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
