export interface Agent {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const AGENTS: Agent[] = [
  {
    id: "frontend",
    name: "Frontend",
    color: "#3B82F6",
    description: "UI components and user interactions",
  },
  {
    id: "backend",
    name: "Backend",
    color: "#10B981",
    description: "Server logic and API endpoints",
  },
  {
    id: "database",
    name: "Database",
    color: "#F59E0B",
    description: "Data models and database operations",
  },
  {
    id: "devops",
    name: "DevOps",
    color: "#EF4444",
    description: "Deployment and infrastructure",
  },
  {
    id: "testing",
    name: "Testing",
    color: "#8B5CF6",
    description: "Code quality and test coverage",
  },
];
