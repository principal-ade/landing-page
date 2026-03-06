import type { TourStep, TourPanelAction } from './TourProvider';

/**
 * Default tour steps for the observability demo
 * These steps guide users through the key features of the demo
 */
export const observabilityTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Principal Observability',
    description:
      'This demo shows how Principal transforms traditional monitoring into story-based observability. Let\'s take a quick tour of the key features.',
    duration: 999999999, // Don't auto-advance - user clicks "Start Tour" button
  },
  // Tab introductions - don't auto-advance, user clicks Next
  {
    id: 'tab-storyboards',
    title: 'Storyboards',
    description:
      'Browse architecture canvases that define how your application is structured. Each storyboard visualizes components, data flows, and workflows.',
    duration: 999999999,
  },
  {
    id: 'tab-backlog',
    title: 'Backlog.md',
    description:
      'An interactive Kanban board powered by Backlog.md. Every interaction is instrumented with OpenTelemetry, generating real traces you can explore.',
    duration: 999999999,
  },
  {
    id: 'tab-traditional-monitoring',
    title: 'Traditional Monitoring',
    description:
      'Standard trace views showing Otel data. Aims to provide the monitoring experience provided by systems today.',
    duration: 999999999,
  },
  {
    id: 'tab-story-monitoring',
    title: 'Story-Based Monitoring',
    description:
      'See traces matched against business scenarios from your storyboards. Converting terse Otel data into actionable insights.',
    duration: 999999999,
  },
  // Interactive sections
  {
    id: 'storyboard-discovery',
    title: 'Explore Storyboards',
    description:
      'Click on any storyboard to view its architecture canvas. Canvases show how components interact and what workflows are available.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '#storyboard-section',
    },
  },
  {
    id: 'canvas-detail',
    title: 'Architecture Canvases',
    description:
      'Watch as we programmatically open the Task Lifecycle canvas. This demonstrates how the panel supports automated navigation for guided tours.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '#storyboard-section',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectNode', nodeId: 'canvas:task-lifecycle' },
      },
    },
  },
  {
    id: 'canvas-close',
    title: 'Navigate Back',
    description:
      'You can close the canvas view to return to the storyboard list and explore other features.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '#storyboard-section',
      panelAction: {
        action: 'closeCanvas',
      },
    },
  },
  {
    id: 'kanban-interaction',
    title: 'Interactive Kanban Board',
    description:
      'This Kanban board is instrumented with OpenTelemetry. Every interaction generates traces that you can view in the monitoring sections below.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '#kanban-section',
    },
  },
  {
    id: 'kanban-task-selection',
    title: 'Programmatic Task Selection',
    description:
      'The Kanban panel supports programmatic control via events. Watch as we select a task automatically - this is the same mechanism used for guided tours and automated testing.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '#kanban-section',
      tourAction: {
        panel: 'kanban',
        action: { type: 'task:selected', taskId: 'task-2' },
      },
    },
  },
  {
    id: 'kanban-task-detail',
    title: 'Task Detail View',
    description:
      'The task detail panel slides in automatically when a task is selected. This view shows all task metadata, description, and allows editing. The programmatic control API enables seamless integration with tours and external systems.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '#kanban-section',
    },
  },
  {
    id: 'kanban-deselect',
    title: 'Closing Task Details',
    description:
      'Programmatic control also supports deselecting tasks, opening delete modals, and more. These events follow the same pattern documented in PROGRAMMATIC_CONTROL.md.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '#kanban-section',
      tourAction: {
        panel: 'kanban',
        action: { type: 'task:deselected' },
      },
    },
  },
  {
    id: 'traditional-monitoring',
    title: 'Traditional Monitoring',
    description:
      'Standard trace views show raw span data. Useful for debugging, but it lacks business context - you see technical operations without understanding what the user was trying to accomplish.',
    duration: 999999999,
    target: {
      selector: '[data-tour-id="traditional-monitoring"]',
    },
  },
  {
    id: 'story-based-monitoring',
    title: 'Story-based Monitoring',
    description:
      'This is where Principal shines. Traces are matched against scenarios from your storyboards, so you see business operations like "Move task to Done" instead of just API calls.',
    duration: 999999999,
    target: {
      selector: '[data-tour-id="story-monitoring"]',
    },
  },
  {
    id: 'try-it',
    title: 'Try It Yourself!',
    description:
      'Drag a task on the Kanban board, then scroll down to see how the trace appears in both monitoring views. Notice how story-based monitoring provides meaningful context.',
    duration: 999999999,
    target: {
      selector: '#kanban-section',
    },
  },
];

/**
 * Minimal tour for quick overview
 */
export const quickTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Quick Overview',
    description:
      'Principal transforms traces into meaningful stories. Interact with the Kanban board and see how traces are matched to business scenarios.',
    duration: 5000,
  },
  {
    id: 'storyboards',
    title: 'Architecture Discovery',
    description:
      'Browse storyboards to see how your application is structured.',
    duration: 4000,
    target: {
      selector: '#storyboard-section',
    },
  },
  {
    id: 'monitoring',
    title: 'Story-based Monitoring',
    description:
      'See traces with business context, not just technical spans.',
    duration: 4000,
    target: {
      selector: '[data-tour-id="story-monitoring"]',
    },
  },
];

export default observabilityTourSteps;
