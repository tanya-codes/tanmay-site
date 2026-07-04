import React from "react";
import { motion } from "framer-motion";

export default function FadeIn({
  children,
  as: Tag = "div",
  y = 40,
  delay = 0,
  duration = 0.8,
  className = "",
  once = true,
  style,
}) {
  const M = motion[Tag] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10%" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </M>
  );
}
