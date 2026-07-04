import React from "react";
import { motion } from "framer-motion";
import { useMagnet } from "../../hooks/useMagnet";

/**
 * MagneticButton renders as <a> or <button>.
 * Variants: "primary" (gradient), "outline", "light".
 */
export default function MagneticButton({
  as = "a",
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  strength = 14,
  radius = 100,
  ...rest
}) {
  const { ref, x, y } = useMagnet({ strength, radius });

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-medium tracking-wide transition-[box-shadow,filter] duration-300 will-change-transform select-none";

  const variants = {
    primary:
      "btn-gradient text-white hover:brightness-110 shadow-[0_10px_30px_rgba(182,0,168,0.25)]",
    outline:
      "border border-[rgba(215,226,234,0.25)] text-[#D7E2EA] hover:border-[rgba(215,226,234,0.55)] hover:bg-[rgba(215,226,234,0.04)]",
    light:
      "bg-[#F6FCFF] text-[#051A24] hover:bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
    accent:
      "btn-gradient text-white text-base md:text-lg px-8 py-4 shadow-[0_20px_60px_rgba(182,0,168,0.35)]",
  };

  const Comp = motion[as] || motion.a;

  return (
    <Comp
      ref={ref}
      href={href}
      onClick={onClick}
      style={{ x, y }}
      className={`${base} ${variants[variant] || ""} ${className}`}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
