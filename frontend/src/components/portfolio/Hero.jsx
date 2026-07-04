import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Camera3D from "./Camera3D";
import { useCursorPosition } from "../../hooks/useCursorPosition";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

/**
 * Hero — centered portrait with feathered blend into background.
 * Massive "TANMAY" wordmark peeks behind the portrait.
 * Left column: role stack (compact 1 line each).
 * Right column: short about snippet + 3D camera + stats.
 */
export default function Hero() {
  const cursor = useCursorPosition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Portrait tilt
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const srx = useSpring(rotX, { stiffness: 150, damping: 20 });
  const sry = useSpring(rotY, { stiffness: 150, damping: 20 });

  // Background wordmark parallax
  const bgWordX = useMotionValue(0);
  const bgWordY = useMotionValue(0);
  const sBgX = useSpring(bgWordX, { stiffness: 60, damping: 22 });
  const sBgY = useSpring(bgWordY, { stiffness: 60, damping: 22 });

  // Column parallax
  const leftX = useMotionValue(0);
  const rightX = useMotionValue(0);
  const sLeftX = useSpring(leftX, { stiffness: 90, damping: 22 });
  const sRightX = useSpring(rightX, { stiffness: 90, damping: 22 });

  useEffect(() => {
    rotX.set(cursor.y * -10);
    rotY.set(cursor.x * 10);
    bgWordX.set(cursor.x * 30);
    bgWordY.set(cursor.y * 20);
    leftX.set(cursor.x * -18);
    rightX.set(cursor.x * 18);
  }, [cursor.x, cursor.y, rotX, rotY, bgWordX, bgWordY, leftX, rightX]);

  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "10%"]);

  const shineX = 50 + cursor.x * 25;
  const shineY = 50 + cursor.y * 25;

  return (
    <section
      id="top"
      className="relative w-full bg-[#0C0C0C] overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24"
      style={{ minHeight: "100vh" }}
    >
      {/* Background bloom + grid + grain */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 55% at 50% 50%, rgba(182,0,168,0.18) 0%, rgba(118,33,176,0.10) 30%, transparent 65%), radial-gradient(35% 30% at 15% 20%, rgba(190,76,0,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(215,226,234,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(215,226,234,0.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </motion.div>

      {/* Top strip */}
      <div
        className={`relative z-[5] px-5 md:px-10 max-w-[1400px] mx-auto ${
          mounted ? "animate-fade-in-up" : "opacity-0"
        }`}
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center justify-between text-[10px] md:text-[11px] font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/45">
          <span>Portfolio · Vol. 01</span>
          <span className="hidden sm:inline">Est. 2020 · Delhi NCR</span>
          <span>Available for 2026</span>
        </div>
      </div>

      {/* ---------- Central composition ---------- */}
      <div
        className="relative mt-6 md:mt-10 max-w-[1400px] mx-auto px-5 md:px-10"
        style={{ perspective: 1400 }}
      >
        {/* BACKDROP WORDMARK — "TANMAY" behind portrait */}
        <motion.div
          aria-hidden
          style={{ x: sBgX, y: sBgY }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-6 md:top-2 flex justify-center pointer-events-none"
        >
          <span
            className="font-editorial select-none leading-none tracking-tight text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(6rem, 22vw, 22rem)",
              fontWeight: 900,
              background:
                "linear-gradient(180deg, rgba(215,226,234,0.22) 0%, rgba(215,226,234,0.06) 55%, transparent 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              letterSpacing: "-0.04em",
              WebkitTextStroke: "1px rgba(215,226,234,0.08)",
            }}
          >
            TANMAY
          </span>
        </motion.div>

        {/* Grid: left column · portrait · right column */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,520px)_1fr] items-center gap-6 md:gap-8 lg:gap-4 mt-4 md:mt-8">
          {/* LEFT — Role stack */}
          <motion.div
            style={{ x: sLeftX }}
            className={`relative z-[6] order-2 lg:order-1 lg:pr-4 ${
              mounted ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/50 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              I&apos;m Tanmay
            </div>
            <h1
              className="hero-heading font-editorial leading-[0.9] tracking-tight"
              data-testid="hero-heading"
              style={{ fontSize: "clamp(1.85rem, 4vw, 3.1rem)" }}
            >
              <span className="font-editorial-italic block" style={{ fontWeight: 300 }}>
                Creative
              </span>
              <span className="block" style={{ fontWeight: 900 }}>
                Director,
              </span>
              <span className="font-editorial-italic block" style={{ fontWeight: 300 }}>
                Video Editor
              </span>
              <span className="block" style={{ fontWeight: 900 }}>
                &amp; Creator.
              </span>
            </h1>

            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                data-testid={TEST_IDS.heroCta}
                onClick={() => trackEvent("whatsapp_click", { source: "hero" })}
              >
                Let&apos;s Talk <ArrowUpRight size={16} />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#work"
                variant="outline"
                data-testid={TEST_IDS.heroSecondaryCta}
                onClick={() =>
                  trackEvent("cta_click", { source: "hero_see_work" })
                }
              >
                See the Work <span aria-hidden>↓</span>
              </MagneticButton>
            </div>
          </motion.div>

          {/* CENTER — Portrait (feathered blend, no card border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              rotateX: srx,
              rotateY: sry,
              transformStyle: "preserve-3d",
              perspective: 1200,
            }}
            className="relative z-[7] order-1 lg:order-2 w-full max-w-[520px] mx-auto aspect-[4/5] animate-float-slow"
            data-testid={TEST_IDS.heroPortrait}
          >
            {/* Gradient wash BEHIND image */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-[40px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(55% 60% at 50% 55%, rgba(182,0,168,0.28) 0%, rgba(118,33,176,0.14) 45%, transparent 75%)",
                filter: "blur(30px)",
                transform: "translateZ(-40px)",
              }}
            />

            {/* Feathered portrait — masked so edges blend into bg */}
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 78% 82% at 50% 48%, #000 55%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 78% 82% at 50% 48%, #000 55%, transparent 100%)",
              }}
            >
              <img
                src="/tanmay-portrait.jpg"
                alt="Tanmay — portrait"
                className="w-full h-full object-cover"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {/* Cursor shine */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.16) 0%, transparent 55%)`,
                }}
              />
            </div>

            {/* Live badges (with z-lift for 3D pop) */}
            <div
              className="absolute top-6 left-6 text-[10px] font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/85"
              style={{ transform: "translateZ(50px)" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                On set · 2026
              </span>
            </div>
            <div
              className="absolute top-6 right-6 text-[10px] font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/70"
              style={{ transform: "translateZ(50px)" }}
            >
              <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                Roll · 001
              </span>
            </div>
            {/* Signature — bottom left */}
            <div
              className="absolute bottom-4 left-4 md:left-6 font-editorial-italic text-[#D7E2EA] text-lg md:text-xl"
              style={{ transform: "translateZ(50px)" }}
            >
              — Tanmay
            </div>
          </motion.div>

          {/* RIGHT — About snippet + 3D camera + stats */}
          <motion.div
            style={{ x: sRightX }}
            className={`relative z-[6] order-3 lg:pl-4 flex flex-col items-stretch gap-5 md:gap-6 ${
              mounted ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            {/* Snippet */}
            <div className="rounded-2xl border border-[#D7E2EA]/12 bg-[rgba(12,12,12,0.55)] backdrop-blur-md p-4 md:p-5 lg:ml-auto lg:max-w-[300px]">
              <div className="flex items-center gap-2 text-[10px] font-mono-display uppercase tracking-[0.24em] text-[#D7E2EA]/60">
                <Sparkles size={12} />
                Studio · Delhi NCR
              </div>
              <p className="mt-3 text-[#D7E2EA] text-sm leading-relaxed">
                I&apos;ve stood on sets for{" "}
                <span className="font-editorial-italic text-white">Nykaa</span>,{" "}
                <span className="font-editorial-italic text-white">Himalaya</span>{" "}
                and <span className="font-editorial-italic text-white">Lenovo</span>. Now I build monthly content
                systems for brands ready to grow.
              </p>
            </div>

            {/* 3D Camera */}
            <div className="relative w-full flex justify-center lg:justify-end lg:mr-2">
              <div className="hidden sm:block">
                <Camera3D size={230} />
              </div>
              <div className="sm:hidden">
                <Camera3D size={180} />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 lg:ml-auto">
              <StatCard number="05" label="Brand campaigns" delay={0.9} mounted={mounted} />
              <StatCard number="2–3" label="Brands at a time" delay={1.0} mounted={mounted} />
            </div>
          </motion.div>
        </div>

        {/* Bottom strip credential */}
        <div
          className={`relative mt-10 md:mt-12 pt-6 border-t border-[#D7E2EA]/10 flex items-center justify-between gap-4 flex-wrap ${
            mounted ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.9s" }}
        >
          <div className="font-mono-display text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#D7E2EA]/45">
            2nd–3rd AD · Nykaa · Himalaya · Lenovo × FIFA WC 2026 · AMD · Arpanvester
          </div>
          <div className="font-mono-display text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#D7E2EA]/45">
            Scroll ↓
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label, delay = 0, mounted, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl bg-white text-[#0C0C0C] shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex-1 sm:flex-none ${
        compact ? "px-4 py-3" : "px-4 py-3 min-w-[110px]"
      }`}
    >
      <div
        className="font-editorial leading-none tracking-tight text-3xl lg:text-4xl"
        style={{ fontWeight: 900 }}
      >
        {number}
      </div>
      <div className="mt-1.5 text-[9px] font-mono-display uppercase tracking-[0.18em] text-[#0C0C0C]/60">
        {label}
      </div>
    </motion.div>
  );
}
