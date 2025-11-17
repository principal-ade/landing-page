import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function GitDiffAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
      <div className="space-y-2 font-mono text-sm">
        <motion.div
          className="text-red-400 break-words"
          animate={{ opacity: phase === 0 ? 1 : 0.3 }}
        >
          - const handleSubmit = () {"=>"} submit();
        </motion.div>
        <motion.div
          className="text-green-400 break-words"
          animate={{ opacity: phase === 0 ? 1 : 0.3 }}
        >
          + const handleSubmit = async () {"=>"} validateAndSubmit();
        </motion.div>

        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-4"
          animate={{
            opacity: phase === 1 ? 1 : 0,
            scaleX: phase === 1 ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          className="text-cyan-400 bg-cyan-500/10 p-3 rounded border border-cyan-500/30 break-words"
          animate={{
            opacity: phase === 2 ? 1 : 0,
            y: phase === 2 ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
        >
          📝 Spec: Added validation before submit
        </motion.div>
      </div>
    </div>
  );
}
