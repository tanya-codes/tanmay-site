import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useCursorPosition } from "../../hooks/useCursorPosition";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

/**
 * Hero — cinematic layered composition.
 * • Central portrait dominates the composition
 * • Heading floats bottom-left, gradient text
 * • Two info cards float on the right side
 * • Two stat cards float bottom-right (white pills with big number + label)
 * • Everything tilts in 3D with cursor + parallaxes on scroll
 */
export default function Hero() {
  const cursor = useCursorPosition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Portrait tilt (subtle - it's a large centered subject)
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const srx = useSpring(rotX, { stiffness: 150, damping: 20 });
  const sry = useSpring(rotY, { stiffness: 150, damping: 20 });

  // Heading + floating card parallax
  const hX = useMotionValue(0);
  const hY = useMotionValue(0);
  const shX = useSpring(hX, { stiffness: 100, damping: 25 });
  const shY = useSpring(hY, { stiffness: 100, damping: 25 });

  const cardAX = useMotionValue(0);
  const cardAY = useMotionValue(0);
  const scaX = useSpring(cardAX, { stiffness: 90, damping: 22 });
  const scaY = useSpring(cardAY, { stiffness: 90, damping: 22 });

  const cardBX = useMotionValue(0);
  const cardBY = useMotionValue(0);
  const scbX = useSpring(cardBX, { stiffness: 90, damping: 22 });
  const scbY = useSpring(cardBY, { stiffness: 90, damping: 22 });

  useEffect(() => {
    rotX.set(cursor.y * -8);
    rotY.set(cursor.x * 8);
    hX.set(cursor.x * -14);
    hY.set(cursor.y * -8);
    cardAX.set(cursor.x * 20);
    cardAY.set(cursor.y * 12);
    cardBX.set(cursor.x * -18);
    cardBY.set(cursor.y * -10);
  }, [cursor.x, cursor.y, rotX, rotY, hX, hY, cardAX, cardAY, cardBX, cardBY]);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: undefined });
  const bgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "10%"]);

  const shineX = 50 + cursor.x * 25;
  const shineY = 50 + cursor.y * 25;

  return (
    <section
      id="top"
      className="relative w-full bg-[#0C0C0C] overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24"
      style={{ minHeight: "100vh" }}
    >
      {/* ---------- Background layers ---------- */}
      {/* Accent radial bloom */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 55%, rgba(182,0,168,0.16) 0%, rgba(118,33,176,0.10) 30%, transparent 65%), radial-gradient(45% 40% at 20% 20%, rgba(190,76,0,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
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
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </motion.div>

      {/* ---------- Top marquee credential strip ---------- */}
      <div
        className={`relative z-[5] px-5 md:px-10 max-w-[1400px] mx-auto ${
          mounted ? "animate-fade-in-up" : "opacity-0"
        }`}
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center justify-between text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em] text-[#D7E2EA]/40">
          <span>Portfolio · Vol. 01</span>
          <span className="hidden sm:inline">Est. 2020 · Delhi NCR</span>
          <span>Available for 2026</span>
        </div>
      </div>

      {/* ---------- Central portrait + composed elements ---------- */}
      <div
        className="relative mt-8 md:mt-12 max-w-[1400px] mx-auto px-5 md:px-10"
        style={{ perspective: 1200 }}
      >
        <div className="relative mx-auto w-full flex items-center justify-center">
          {/* Portrait card — the centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              rotateX: srx,
              rotateY: sry,
              transformStyle: "preserve-3d",
            }}
            className="relative w-[86%] sm:w-[70%] md:w-[56%] lg:w-[46%] aspect-[4/5] rounded-[36px] overflow-hidden"
            data-testid={TEST_IDS.heroPortrait}
          >
            <div
              className="absolute inset-0 rounded-[36px] overflow-hidden"
              style={{
                border: "1px solid rgba(215,226,234,0.12)",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.55), 0 0 60px rgba(182,0,168,0.12)",
              }}
            >
              {/* Gradient fallback behind image */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0d212c 0%, #051A24 55%, #18011F 100%)",
                }}
              />
              <img
                src="/tanmay-portrait.jpg"
                alt="Tanmay — portrait"
                className="relative w-full h-full object-cover"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {/* Cursor-following shine */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.14) 0%, transparent 55%)`,
                }}
              />
              {/* Bottom vignette to blend with heading */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(12,12,12,0.85) 5%, rgba(12,12,12,0.35) 45%, transparent 100%)",
                }}
              />
              {/* Top subtle vignette */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(12,12,12,0.35), transparent)",
                }}
              />
              {/* Corner frame marks */}
              <FrameCorner position="top-left" />
              <FrameCorner position="top-right" />
              <FrameCorner position="bottom-left" />
              <FrameCorner position="bottom-right" />
              {/* Timestamp badge */}
              <div
                className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.28em] text-[#D7E2EA]/80 font-mono"
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  On set · 2026
                </span>
              </div>
              <div
                className="absolute top-5 right-5 text-[10px] uppercase tracking-[0.28em] text-[#D7E2EA]/70 font-mono"
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  Roll · 001
                </span>
              </div>
            </div>
          </motion.div>

          {/* ---------- Floating heading over the portrait (bottom-left overlap) ---------- */}
          <motion.div
            style={{ x: shX, y: shY }}
            className={`absolute left-2 sm:left-6 md:left-10 lg:left-16 xl:left-24 bottom-[-2rem] md:bottom-[-1rem] lg:bottom-6 z-[6] max-w-[92%] md:max-w-[62%] ${
              mounted ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h1
              className="hero-heading font-black uppercase tracking-tight leading-[0.86]"
              data-testid="hero-heading"
            >
              <span
                style={{
                  fontSize: "clamp(2.4rem, 8.5vw, 8rem)",
                  display: "block",
                }}
              >
                <span className="block">
                  Creative
                </span>
                <span className="block">
                  Direction
                </span>
              </span>
            </h1>
            <p
              className="mt-4 md:mt-5 max-w-md text-[#D7E2EA] font-light leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}
            >
              I&apos;m Tanmay — Video Editor & Content Creator.
              I&apos;ve stood on sets for Nykaa, Himalaya, and Lenovo. Now I build
              content systems for brands getting there.
            </p>
          </motion.div>

          {/* ---------- Floating info card 1 (top-right) ---------- */}
          <motion.div
            style={{ x: scaX, y: scaY }}
            initial={{ opacity: 0, x: 40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute top-6 md:top-8 right-2 md:right-6 lg:right-10 z-[6] max-w-[240px] lg:max-w-[280px] backdrop-blur-md"
          >
            <div className="rounded-2xl border border-[#D7E2EA]/12 bg-[rgba(12,12,12,0.55)] p-4 lg:p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] font-mono text-[#D7E2EA]/60">
                <Sparkles size={12} />
                Creative Collective
              </div>
              <p className="mt-3 text-[#D7E2EA] text-sm leading-relaxed">
                Strategy, shoot, edit and delivery — one system, one point of
                contact.
              </p>
            </div>
          </motion.div>

          {/* ---------- Floating info card 2 (mid-left) ---------- */}
          <motion.div
            style={{ x: scbX, y: scbY }}
            initial={{ opacity: 0, x: -40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute top-24 left-2 lg:left-6 z-[6] max-w-[260px] backdrop-blur-md"
          >
            <div className="rounded-2xl border border-[#D7E2EA]/12 bg-[rgba(12,12,12,0.55)] p-4 lg:p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] font-mono text-[#D7E2EA]/60">
                <span className="w-1 h-1 rounded-full bg-[#B600A8]" />
                2nd–3rd AD Credits
              </div>
              <p className="mt-3 text-[#D7E2EA] text-sm leading-relaxed">
                Nykaa · Himalaya · Lenovo × FIFA WC 2026 · AMD · Arpanvester
              </p>
            </div>
          </motion.div>

          {/* ---------- Stat cards (bottom-right) ---------- */}
          <div className="hidden md:flex absolute right-2 md:right-6 lg:right-10 bottom-2 lg:bottom-6 z-[6] gap-3 lg:gap-4">
            <StatCard number="05" label="Brand campaigns" delay={0.75} mounted={mounted} />
            <StatCard number="2–3" label="Brands at a time" delay={0.9} mounted={mounted} />
          </div>
        </div>

        {/* ---------- Buttons + credential strip below composition ---------- */}
        <div
          className={`relative mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 ${
            mounted ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
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

          <div className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#D7E2EA]/40 font-mono">
            2nd–3rd AD · Nykaa · Himalaya · Lenovo
          </div>

          {/* Mobile-only stats */}
          <div className="md:hidden flex gap-3 w-full">
            <StatCard number="05" label="Brand campaigns" delay={0.85} mounted={mounted} compact />
            <StatCard number="2–3" label="Brands at a time" delay={0.95} mounted={mounted} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function FrameCorner({ position }) {
  const map = {
    "top-left": "top-4 left-4 border-t border-l",
    "top-right": "top-4 right-4 border-t border-r",
    "bottom-left": "bottom-4 left-4 border-b border-l",
    "bottom-right": "bottom-4 right-4 border-b border-r",
  };
  return (
    <div
      aria-hidden
      className={`absolute ${map[position]} w-6 h-6 border-[#D7E2EA]/30 rounded-[6px] pointer-events-none`}
      style={{ transform: "translateZ(40px)" }}
    />
  );
}

function StatCard({ number, label, delay = 0, mounted, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl bg-white text-[#0C0C0C] shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${
        compact ? "px-4 py-3 flex-1" : "px-5 py-4 min-w-[130px]"
      }`}
    >
      <div
        className={`font-black leading-none tracking-tight ${
          compact ? "text-3xl" : "text-4xl lg:text-5xl"
        }`}
      >
        {number}
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#0C0C0C]/60 font-mono">
        {label}
      </div>
    </motion.div>
  );
}
