import type { TourStep } from './TourProvider';

/**
 * Default tour steps for the observability demo
 * These steps guide users through the key features of the demo
 */
export const observabilityTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '',
    description:
      "Using Principal's skill, the agent reads the codebase, maps the workflows, sets up monitoring. The live app you'll interact with is Backlog.md, an open source task manager.",
    duration: 999999999, // Don't auto-advance - user clicks "Start" button
    target: {
      selector: '[data-tour-target="next-button"]',
    },
  },
  // Introduction to the demo app and what the agent generated
  {
    id: 'app-intro',
    title: 'Agent-Generated Storyboards',
    description:
      "Principal's agent defines storyboards and workflows specific to your app. In this case, Backlog.md.",
    duration: 999999999,
    tab: 'storyboards',
    lightbox: true,
    target: {
      selector: '[data-tour-target="lightbox-next"]',
    },
  },
  // Show the canvas architecture diagram
  {
    id: 'canvas-architecture',
    title: 'The Architecture Canvas',
    description:
      'The agent mapped the task lifecycle as a flow diagram. Every state. Every transition. Defined before anything ran.',
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
  // Show OTEL Workflows - Storyboard view with Workflows folder expanded
  {
    id: 'storyboard-workflows',
    title: 'Expected Scenarios',
    description:
      'Every path a task can take. The agent mapped it. The developer confirmed it. This is the behavior contract.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourActions: [
        {
          delay: 0,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'switchTab', tab: 'otel' },
          },
        },
        {
          delay: 500,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'selectNode', nodeId: 'storyboard:task-workflow-lifecycle' },
          },
        },
        {
          delay: 1000,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'toggleNode', nodeId: 'workflows:task-workflow-lifecycle' },
          },
        },
      ],
    },
  },
  {
    id: 'task-delete-behavior-contract',
    title: 'The Behavior Contract',
    description:
      'This is what success should look like for a task deletion.',
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourActions: [
        {
          delay: 0,
          action: {
            panel: 'storyboard-custom',
            action: { action: 'selectNode', nodeId: 'workflow:task-workflow-lifecycle/task-delete' },
          },
        },
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
    id: 'task-delete-template',
    title: 'The Template',
    description:
      "See those variables? {{task.id}} and {{task.title}}. When the code runs, they fill in with real data. That's how a trace becomes a story you can read.",
    duration: 999999999,
    tab: 'storyboards',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        panel: 'storyboard-custom',
        action: { action: 'selectEvent', eventIndex: 0 },
      },
    },
  },
  {
    id: 'kanban-interaction',
    title: 'The Live App',
    description:
      "This is the Kanban UI in Backlog.md. Instrumented with OpenTelemetry. We're going to delete a task and watch what the monitoring sees.",
    duration: 999999999,
    tab: 'kanban',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'kanban-task-selection',
    title: 'Selecting a Task',
    description: 'Every interaction is being traced against the workflows the agent defined.',
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
    description: 'We will delete this task to showcase an issue. Hit delete.',
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
    title: 'Something Broke',
    description: "The task wasn't deleted. The app has no idea. Let's see what the monitoring sees.",
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
      "You can see task.delete. But can you tell if it succeeded? Can you tell what should have happened? This is what you're used to.",
    duration: 999999999,
    tab: 'traditional-monitoring',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'story-based-monitoring',
    title: 'Story-Based: Instant Context',
    description:
      "Same traces. Now matched to the behavior contract. The variables are filled in. You know what went wrong without a single query.",
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
            action: { action: 'selectTrace', traceIndex: 3 },
          },
        },
        {
          // After selecting, click on the first span to open the workflow panel
          delay: 2000,
          action: {
            panel: 'trace-list',
            action: { action: 'clickSpan', traceIndex: 3, spanIndex: 0 },
          },
        },
      ],
    },
  },
  {
    id: 'trace-coverage',
    title: 'Trace Coverage',
    description:
      'Which workflows have actually been exercised? See the gaps before production does.',
    duration: 999999999,
    tab: 'story-monitoring',
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourActions: [
        {
          // Close any open canvas first
          delay: 0,
          action: {
            panel: 'trace-list-event',
            event: { type: 'navigation:back' },
          },
        },
        {
          // Then switch to coverage tab
          delay: 300,
          action: {
            panel: 'trace-list',
            action: { action: 'switchTab', tab: 'coverage' },
          },
        },
      ],
    },
  },
  {
    id: 'try-it',
    title: 'Try It Yourself',
    description:
      'Drag a task on the Kanban board. Then use the tabs above to switch between Traditional Monitoring and Story-Based Monitoring. Notice the difference.',
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
