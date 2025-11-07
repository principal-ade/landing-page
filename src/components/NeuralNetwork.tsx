import { motion } from "framer-motion";

export function NeuralNetwork() {
  const nodes = [
    { id: "reason", x: 50, y: 50, label: "Reason" },
    { id: "code", x: 200, y: 100, label: "Code" },
    { id: "spec", x: 150, y: 200, label: "Spec" },
    { id: "context", x: 300, y: 150, label: "Context" },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 1, to: 3 },
    { from: 3, to: 2 },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-64">
      <svg className="w-full h-full" viewBox="0 0 350 250">
        {/* Connections */}
        {connections.map((conn, i) => {
          const from = nodes[conn.from];
          const to = nodes[conn.to];
          return (
            <motion.line
              key={i}
              x1={from.x + 25}
              y1={from.y + 25}
              x2={to.x + 25}
              y2={to.y + 25}
              stroke="#00C2FF"
              strokeWidth="2"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x + 25}
              cy={node.y + 25}
              r="20"
              fill="#00C2FF"
              fillOpacity="0.2"
              stroke="#00C2FF"
              strokeWidth="2"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
            <text
              x={node.x + 25}
              y={node.y + 32}
              textAnchor="middle"
              fill="#00C2FF"
              className="text-xs"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
