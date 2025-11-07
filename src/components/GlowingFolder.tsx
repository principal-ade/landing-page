import { motion } from "framer-motion";

export function GlowingFolder() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl opacity-50"
        style={{ background: "#00C2FF" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Folder icon */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00C2FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <motion.circle
            cx="12"
            cy="13"
            r="3"
            fill="#00C2FF"
            fillOpacity="0.3"
            animate={{
              r: [2, 4, 2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {/* Orbital particles */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: "#00C2FF",
            left: "50%",
            top: "50%",
          }}
          animate={{
            rotate: [angle, angle + 360],
            x: [0, Math.cos((angle * Math.PI) / 180) * 60, 0],
            y: [0, Math.sin((angle * Math.PI) / 180) * 60, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
