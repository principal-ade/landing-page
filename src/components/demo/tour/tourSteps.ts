import type { TourStep } from './TourProvider';

/**
 * Default tour for the interactive Backlog.md Kanban demo.
 */
export const observabilityTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '',
    description:
      "Using Principal's skill, the agent reads the codebase and sets up monitoring. The live app you'll interact with is Backlog.md, an open source task manager.",
    duration: 999999999,
    target: {
      selector: '[data-tour-target="next-button"]',
    },
  },
  {
    id: 'kanban-interaction',
    title: 'The Live App',
    description:
      "This is the Kanban UI in Backlog.md. We're going to interact with a task to see the live app in action.",
    duration: 999999999,
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'kanban-task-selection',
    title: 'Selecting a Task',
    description: 'Select a task to inspect it in the live application.',
    duration: 999999999,
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        type: 'task:selected',
        taskId: 'task-2',
      },
    },
  },
  {
    id: 'kanban-task-detail',
    title: 'Deleting a Task',
    description: 'We will delete this task. Hit delete to continue.',
    duration: 999999999,
    target: {
      selector: '[data-tour-target="tour-overlay"]',
      tourAction: {
        type: 'task:delete-open-modal',
        taskId: 'task-2',
      },
    },
    advanceOnEvent: 'task:deleted',
  },
  {
    id: 'kanban-delete-failed',
    title: 'Something Broke',
    description: "The task wasn't deleted. The app has no idea.",
    descriptionColor: '#ff4444',
    duration: 999999999,
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
  {
    id: 'try-it',
    title: 'Try It Yourself',
    description: 'Drag a task on the Kanban board to explore the live application.',
    duration: 999999999,
    target: {
      selector: '[data-tour-target="tour-overlay"]',
    },
  },
];

/**
 * Minimal tour for a quick overview.
 */
export const quickTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Quick Overview',
    description: 'Explore the Backlog.md Kanban board and interact with its tasks.',
    duration: 5000,
  },
  {
    id: 'kanban',
    title: 'The Live App',
    description: 'Interact with tasks in the live Kanban board.',
    duration: 4000,
    target: {
      selector: '#kanban-section',
    },
  },
];

export default observabilityTourSteps;
