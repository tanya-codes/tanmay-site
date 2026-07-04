import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * IntroCurtain — plays once per session on first mount.
 * Two panels split from centre to reveal, with a large "TANMAY VISUALS" wordmark.
 */
export default function IntroCurtain() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("intro_shown");
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("intro_shown", "1");
    }, 2200);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] pointer-events-none"
        >
          {/* Two panels split apart */}
          <motion.div
            className="absolute top-0 left-0 h-full w-1/2 bg-[#0C0C0C]"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{
              duration: 1.1,
              delay: 1.2,
              ease: [0.83, 0, 0.17, 1],
            }}
            style={{
              borderRight: "1px solid rgba(215,226,234,0.05)",
            }}
          />
          <motion.div
            className="absolute top-0 right-0 h-full w-1/2 bg-[#0C0C0C]"
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.1,
              delay: 1.2,
              ease: [0.83, 0, 0.17, 1],
            }}
          />

          {/* Centre content on the panels */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono-display uppercase text-[10px] md:text-xs tracking-[0.4em] text-[#D7E2EA]/50 mb-4 md:mb-6"
            >
              Tanmay Visuals — Vol. 01
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hero-heading font-editorial text-center"
              style={{ fontSize: "clamp(2rem, 8vw, 6rem)", fontWeight: 900, letterSpacing: "-0.03em" }}
            >
              <span className="font-editorial-italic" style={{ fontWeight: 300 }}>creative</span>
              <span style={{ margin: "0 0.25em" }}>·</span>
              <span>direction</span>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 md:mt-10 h-px bg-[#D7E2EA]/40 w-[240px] md:w-[320px] origin-left"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-3 font-mono-display uppercase text-[9px] md:text-[10px] tracking-[0.4em] text-[#D7E2EA]/40"
            >
              Loading experience…
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
