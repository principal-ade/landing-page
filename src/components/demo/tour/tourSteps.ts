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
    target: {
      selector: '[data-tour-target="next-button"]',
    },
  },
  // Tab introductions - spotlight the corresponding tab
  {
    id: 'tab-storyboards',
    title: 'Storyboards',
    description:
      'Browse architecture canvases that define how your application is structured. Each storyboard visualizes components, data flows, and workflows.',
    duration: 999999999,
    target: {
      selector: '[data-tour-tab="storyboards"]',
    },
  },
  {
    id: 'tab-backlog',
    title: 'Backlog.md',
    description:
      'An interactive Kanban board powered by Backlog.md. Every interaction is instrumented with OpenTelemetry, generating real traces you can explore.',
    duration: 999999999,
    target: {
      selector: '[data-tour-tab="kanban"]',
    },
  },
  {
    id: 'tab-traditional-monitoring',
    title: 'Traditional Monitoring',
    description:
      'Standard trace views showing Otel data. Aims to provide the monitoring experience provided by systems today.',
    duration: 999999999,
    target: {
      selector: '[data-tour-tab="traditional-monitoring"]',
    },
  },
  {
    id: 'tab-story-monitoring',
    title: 'Story-Based Monitoring',
    description:
      'See traces matched against business scenarios from your storyboards. Converting terse Otel data into actionable insights.',
    duration: 999999999,
    target: {
      selector: '[data-tour-tab="story-monitoring"]',
    },
  },
  // Interactive sections - spotlight the tour overlay so users read the instructions
  {
    id: 'storyboard-discovery',
    title: 'Storyboards',
    description:
      'Canvas files are used to capture the architecture of your system.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'canvas-detail',
    title: 'Task Lifecycle Canvas',
    description:
      'This shows the lifecycle of the tasks in the kanban UI.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectNode', nodeId: 'canvas:task-lifecycle' },
      },
    },
  },
  {
    id: 'canvas-close',
    title: 'Storyboards',
    description:
      'Returning to the storyboard list.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      panelAction: {
        action: 'closeCanvas',
      },
    },
  },
  {
    id: 'otel-workflows',
    title: 'OTel Workflows',
    description:
      'These workflows define the expected behavior of your system and are used to match against incoming traces.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'switchTab', tab: 'otel' },
      },
    },
  },
  {
    id: 'task-crud-expand',
    title: 'Task CRUD Storyboard',
    description:
      'Expanding the Task CRUD storyboard to see its contents.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'toggleNode', nodeId: 'storyboard:task-crud', open: true },
      },
    },
  },
  {
    id: 'task-crud-canvas',
    title: 'Task CRUD Canvas',
    description:
      'Opening the Task CRUD canvas to view the architecture diagram.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectNode', nodeId: 'canvas:task-crud' },
      },
    },
  },
  {
    id: 'task-crud-workflows-expand',
    title: 'Task CRUD Workflows',
    description:
      'Expanding the workflows folder to see the available workflow scenarios.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'toggleNode', nodeId: 'workflows:task-crud', open: true },
      },
    },
  },
  {
    id: 'task-crud-workflow',
    title: 'Task Create Workflow',
    description:
      'This workflow defines the expected traces for task creation operations.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectNode', nodeId: 'workflow:task-crud/task-create' },
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
      selector: '[data-tour-target="tour-overlay"]',
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
      selector: '[data-tour-target="tour-overlay"]',
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
      selector: '[data-tour-target="tour-overlay"]',
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
      selector: '[data-tour-target="tour-overlay"]',
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
    tab: 'traditional-monitoring',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'story-based-monitoring',
    title: 'Story-based Monitoring',
    description:
      'This is where Principal shines. Traces are matched against scenarios from your storyboards, so you see business operations like "Move task to Done" instead of just API calls.',
    duration: 999999999,
    tab: 'story-monitoring',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'try-it',
    title: 'Try It Yourself!',
    description:
      'Drag a task on the Kanban board, then scroll down to see how the trace appears in both monitoring views. Notice how story-based monitoring provides meaningful context.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
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
