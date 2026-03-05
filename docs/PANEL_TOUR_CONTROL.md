# Programmatic Panel Control for Tours

This document describes how to programmatically control panels in the observability demo for creating guided tours and walkthroughs.

## Overview

The panel system uses an **event-based request/response pattern** for programmatic control. External controllers (like a tour system) can emit request events to panels, and panels respond by performing actions and optionally emitting response events.

## Architecture

```
┌─────────────────┐     request event      ┌──────────────────────┐
│ Tour Controller │ ────────────────────▶  │ Panel Wrapper        │
│                 │                        │                      │
│                 │  ◀──────────────────── │  - Handles request   │
│                 │     response event     │  - Performs action   │
└─────────────────┘                        │  - Emits response    │
                                           └──────────────────────┘
```

## Event Types

### Request Events

Request events follow the pattern `{panelId}:request`:

```typescript
eventBus.emit({
  type: 'storyboard-list:request',
  source: 'tour-controller',
  timestamp: Date.now(),
  payload: {
    action: 'selectCanvas',
    // action-specific data...
  },
});
```

### Response Events

Response events follow the pattern `{panelId}:response`:

```typescript
{
  type: 'storyboard-list:response',
  source: 'storyboard-list-panel',
  timestamp: Date.now(),
  payload: {
    success: true,
    action: 'selectCanvas',
    // result data...
  },
}
```

## StoryboardListPanelWrapper Actions

### `selectCanvas` - Open a Canvas in the Overlay

Opens a specific canvas in the CanvasEditorPanel overlay and highlights it in the storyboard list.

**Request:**
```typescript
events.emit({
  type: 'storyboard-list:request',
  source: 'tour-controller',
  timestamp: Date.now(),
  payload: {
    action: 'selectCanvas',
    canvasId: 'kanban-panel-canvas',
    canvasPath: '.principal-views/kanban-panel.canvas',
    canvasName: 'Kanban Panel Architecture',
    // Optional workflow data
    workflowId: 'task-management',
    workflowPath: '.principal-views/workflows/task-management.workflow.yml',
  },
});
```

**Response:**
```typescript
{
  type: 'storyboard-list:response',
  payload: {
    success: true,
    action: 'selectCanvas',
    canvasId: 'kanban-panel-canvas',
  },
}
```

**Note:** The StoryboardListPanel uses context-based controlled selection. When you trigger `selectCanvas`, the wrapper updates the `selectedNodeId` in the panel's context, which causes the panel to highlight the selected item.

Selection ID format:
- Canvas: `canvas:{canvasId}`
- Workflow: `workflow:{workflowId}`

### `closeCanvas` - Close the Canvas Overlay

Closes the currently open canvas overlay. This is handled directly by the PanelNavigator.

**Request:**
```typescript
events.emit({
  type: 'storyboard-list:request',
  source: 'tour-controller',
  timestamp: Date.now(),
  payload: {
    action: 'closeCanvas',
  },
});
```

**Response:**
```typescript
{
  type: 'storyboard-list:response',
  payload: {
    success: true,
    action: 'closeCanvas',
  },
}
```

## Usage Example: Tour Controller

```typescript
import { useCallback, useRef } from 'react';
import type { PanelEventEmitter } from '@principal-ade/panel-framework-core';

interface TourStep {
  id: string;
  action: 'selectCanvas' | 'closeCanvas' | 'highlight' | 'message';
  payload?: Record<string, unknown>;
  delay?: number;
}

export function useTourController(events: PanelEventEmitter) {
  const currentStepRef = useRef(0);

  const executeStep = useCallback((step: TourStep) => {
    return new Promise<void>((resolve) => {
      // Listen for response
      const unsubscribe = events.on('storyboard-list:response', (event) => {
        if (event.payload.action === step.action) {
          unsubscribe();
          resolve();
        }
      });

      // Emit request
      events.emit({
        type: 'storyboard-list:request',
        source: 'tour-controller',
        timestamp: Date.now(),
        payload: {
          action: step.action,
          ...step.payload,
        },
      });

      // Timeout fallback
      setTimeout(() => {
        unsubscribe();
        resolve();
      }, 5000);
    });
  }, [events]);

  const runTour = useCallback(async (steps: TourStep[]) => {
    for (const step of steps) {
      if (step.delay) {
        await new Promise(r => setTimeout(r, step.delay));
      }
      await executeStep(step);
    }
  }, [executeStep]);

  return { runTour, executeStep };
}

// Example tour definition
const introTour: TourStep[] = [
  {
    id: 'open-canvas',
    action: 'selectCanvas',
    payload: {
      canvasId: 'kanban-panel-canvas',
      canvasPath: '.principal-views/kanban-panel.canvas',
      canvasName: 'Kanban Panel',
    },
    delay: 1000,
  },
  {
    id: 'close-canvas',
    action: 'closeCanvas',
    delay: 3000,
  },
];
```

## Integration with Page

The `StoryboardListPanelWrapper` exposes its event emitter through a ref or callback:

```typescript
// In observability-demo page
const storyboardEventsRef = useRef<PanelEventEmitter | null>(null);

<StoryboardListPanelWrapper
  schematics={schematics}
  onEventsReady={(events) => {
    storyboardEventsRef.current = events;
  }}
/>

// Later, trigger a tour action
storyboardEventsRef.current?.emit({
  type: 'storyboard-list:request',
  source: 'tour-controller',
  timestamp: Date.now(),
  payload: {
    action: 'selectCanvas',
    canvasId: 'my-canvas',
    canvasPath: '.principal-views/my-canvas.canvas',
  },
});
```

## Finding Available Canvases

To get a list of available canvases from the schematics:

```typescript
const availableCanvases = schematics.flatMap(schematic =>
  schematic.storyboards?.map(storyboard => ({
    canvasId: storyboard.canvas.id,
    canvasPath: storyboard.canvas.path,
    canvasName: storyboard.canvas.name,
    workflows: storyboard.workflows?.map(w => ({
      workflowId: w.id,
      workflowPath: w.path,
    })),
  })) ?? []
);
```

## Future Extensions

### Additional Actions

- `highlightNode` - Highlight a specific node in the canvas
- `selectWorkflow` - Select a workflow within the canvas
- `selectScenario` - Select a scenario within a workflow
- `panTo` - Pan the canvas view to a specific position
- `zoom` - Zoom to a specific level

### Tour Features

- Step-by-step navigation with prev/next
- Tooltips and callouts
- Progress indicators
- Keyboard navigation (arrow keys, escape)
- Persistence of tour progress
