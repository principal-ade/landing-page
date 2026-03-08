import type { TourStep, TourPanelAction, DelayedTourAction } from './TourProvider';

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
    title: 'OTel Workflows',
    description:
      'Returning to the storyboard list to explore OTel workflows.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      panelAction: {
        action: 'closeCanvas',
      },
      tourActions: [
        {
          delay: 800,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'switchTab', tab: 'otel' },
          },
        },
      ],
    },
  },
  {
    id: 'task-lifecycle-expand',
    title: 'Task Workflow Lifecycle',
    description:
      'Expanding the Task Workflow Lifecycle storyboard to see its contents.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'toggleNode', nodeId: 'storyboard:task-workflow-lifecycle', open: true },
      },
    },
  },
  {
    id: 'task-lifecycle-canvas',
    title: 'Task Workflow Lifecycle Canvas',
    description:
      'Opening the Task Workflow Lifecycle canvas to view the architecture diagram.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectNode', nodeId: 'canvas:task-workflow-lifecycle' },
      },
    },
  },
  {
    id: 'task-lifecycle-workflows-expand',
    title: 'Task Lifecycle Workflows',
    description:
      'Expanding the workflows folder to see the available workflow scenarios.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'toggleNode', nodeId: 'workflows:task-workflow-lifecycle', open: true },
      },
    },
  },
  {
    id: 'task-delete-workflow',
    title: 'Task Delete Workflow',
    description:
      'This workflow defines the expected traces for task deletion operations.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectNode', nodeId: 'workflow:task-workflow-lifecycle/task-delete' },
      },
      tourActions: [
        {
          delay: 1500,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'selectScenario', scenarioId: 'success' },
          },
        },
        {
          delay: 2500,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'selectEvent', eventIndex: 0 },
          },
        },
        {
          delay: 3500,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'selectEvent', eventIndex: 1 },
          },
        },
        {
          delay: 4500,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'selectEvent', eventIndex: 2 },
          },
        },
      ],
    },
  },
  {
    id: 'kanban-interaction',
    title: 'Interactive Kanban Board',
    description:
      'This Kanban board is instrumented with OpenTelemetry.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'kanban-task-selection',
    title: 'Selecting a Task',
    description: 'Select a task to view details.',
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
    title: 'Deleting a Task',
    description: 'We will delete this task to showcase an issue.',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'kanban',
        action: { type: 'task:delete-open-modal', taskId: 'task-2' },
      },
    },
    // Auto-advance when delete completes (task:deleted event)
    advanceOnEvent: 'task:deleted',
  },
  {
    id: 'kanban-delete-failed',
    title: 'Task Not Deleted',
    description: "The task was not deleted. Let's figure out why.",
    descriptionColor: '#ff4444',
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'traditional-monitoring',
    title: 'Traditional Monitoring',
    description:
      'Here is the trace data from the kanban board interactions. See what you can figure out.',
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
      "Let's see what we can figure out when we match traces to context about your app.",
    duration: 999999999,
    tab: 'story-monitoring',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      // Use delayed actions since the panel needs time to mount after tab switch
      tourActions: [
        {
          // Small delay to let the panel mount
          delay: 500,
          action: {
            panel: 'trace-list',
            action: { action: 'selectTrace', traceIndex: 0 },
          },
        },
        {
          // After selecting, click on the first span to open the workflow panel
          delay: 2000,
          action: {
            panel: 'trace-list',
            action: { action: 'clickSpan', traceIndex: 0, spanIndex: 0 },
          },
        },
      ],
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
