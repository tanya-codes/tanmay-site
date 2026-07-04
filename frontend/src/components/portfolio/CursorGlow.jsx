import React from "react";
import { motion, useSpring } from "framer-motion";
import { useRawCursor } from "../../hooks/useCursorPosition";

export default function CursorGlow() {
  const { x, y } = useRawCursor();
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(182,0,168,0.08) 0%, rgba(118,33,176,0.04) 40%, transparent 70%)",
        left: 0,
        top: 0,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "screen",
      }}
    />
  );
}
