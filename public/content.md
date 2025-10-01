# Rules of Agentic Development

## 1) Markdown and Diagrams

```mermaid
graph TD
    A[Plan] --> B[Break into Tasks]
    B --> C[Task 1]
    B --> D[Task 2]
    B --> E[Task 3]

    C --> F[Agent Execution]
    D --> F
    E --> F

    F --> G[Return Results]
    G --> H{Review}

    H -->|Approved| I[Complete]
    H -->|Needs Work| B

    style A fill:#4a9eff
    style F fill:#6c5ce7
    style H fill:#00b894
    style I fill:#00b894
```

This diagram demonstrates how Principal ADE orchestrates development work through intelligent agents, breaking down complex tasks into manageable pieces and ensuring quality through iterative review.
