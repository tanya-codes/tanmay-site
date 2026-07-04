import { useEffect, useState } from "react";

// Detect coarse pointer (touch) — no cursor tracking there
const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: coarse)").matches;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Returns cursor position normalized to (-1..1) with 0,0 at viewport centre.
 * On touch or reduced-motion devices, always returns {x:0, y:0}.
 */
export function useCursorPosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) {
      setPos({ x: 0, y: 0 });
      return;
    }
    let rafId = 0;
    const handler = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPos({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return pos;
}

/** Raw pixel cursor position (for global glow overlay) */
export function useRawCursor() {
  const [p, setP] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    let rafId = 0;
    const handler = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setP({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return p;
}
