"use client";

import { motion } from "framer-motion";
import { FolderGit2 } from "lucide-react";

export const AnimatedFolder = () => {
  return (
    <div className="flex justify-center my-16">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {/* Glowing background */}
        <motion.div
          className="absolute inset-0 blur-2xl"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Folder icon */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FolderGit2
            size={120}
            strokeWidth={1.5}
            style={{
              color: "#06B6D4",
              filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))",
            }}
          />
        </motion.div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 border-2 rounded-lg"
          style={{
            borderColor: "#06B6D4",
            opacity: 0.2,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};
