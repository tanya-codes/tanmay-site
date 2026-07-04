import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Camera3D from "./Camera3D";
import { useCursorPosition } from "../../hooks/useCursorPosition";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

/**
 * Hero — cinematic layered composition with editorial serif display.
 * Composition inspired by Podium's studio hero + reference video:
 * · Central 3D portrait card that tilts with cursor
 * · Floating CSS-3D cinema camera object next to it
 * · Editorial "creative direction" heading with mixed serif+sans
 * · Floating info + stat pills for depth
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
    rotX.set(cursor.y * -10);
    rotY.set(cursor.x * 10);
    hX.set(cursor.x * -14);
    hY.set(cursor.y * -8);
    cardAX.set(cursor.x * 22);
    cardAY.set(cursor.y * 14);
    cardBX.set(cursor.x * -20);
    cardBY.set(cursor.y * -12);
  }, [cursor.x, cursor.y, rotX, rotY, hX, hY, cardAX, cardAY, cardBX, cardBY]);

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
      {/* ---------- Background layers ---------- */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 55%, rgba(182,0,168,0.18) 0%, rgba(118,33,176,0.10) 30%, transparent 65%), radial-gradient(45% 40% at 20% 20%, rgba(190,76,0,0.08) 0%, transparent 60%)",
          }}
        />
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
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </motion.div>

      {/* ---------- Top strip ---------- */}
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

      {/* ---------- Composition ---------- */}
      <div
        className="relative mt-6 md:mt-8 max-w-[1400px] mx-auto px-5 md:px-10"
        style={{ perspective: 1400 }}
      >
        <div className="relative mx-auto w-full flex items-center justify-center">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              rotateX: srx,
              rotateY: sry,
              transformStyle: "preserve-3d",
            }}
            className="relative w-[86%] sm:w-[70%] md:w-[56%] lg:w-[44%] aspect-[4/5] rounded-[36px] overflow-hidden"
            data-testid={TEST_IDS.heroPortrait}
          >
            <div
              className="absolute inset-0 rounded-[36px] overflow-hidden"
              style={{
                border: "1px solid rgba(215,226,234,0.14)",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.6), 0 0 80px rgba(182,0,168,0.15)",
              }}
            >
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
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.14) 0%, transparent 55%)`,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(12,12,12,0.85) 5%, rgba(12,12,12,0.35) 45%, transparent 100%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(12,12,12,0.4), transparent)",
                }}
              />
              <FrameCorner position="top-left" />
              <FrameCorner position="top-right" />
              <FrameCorner position="bottom-left" />
              <FrameCorner position="bottom-right" />
              <div
                className="absolute top-5 left-5 text-[10px] font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/85"
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  On set · 2026
                </span>
              </div>
              <div
                className="absolute top-5 right-5 text-[10px] font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/70"
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  Roll · 001
                </span>
              </div>
            </div>
          </motion.div>

          {/* ---------- Floating 3D CAMERA (right of portrait, desktop) ---------- */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.85 }}
            animate={mounted ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute -right-2 xl:right-8 top-1/2 -translate-y-1/2 z-[7] animate-float-slow"
          >
            <Camera3D size={340} />
          </motion.div>

          {/* Mobile camera (smaller, above heading) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden absolute -top-6 -right-6 sm:-right-2 z-[7] animate-float-slow"
          >
            <Camera3D size={170} />
          </motion.div>

          {/* ---------- Floating heading ---------- */}
          <motion.div
            style={{ x: shX, y: shY }}
            className={`absolute left-2 sm:left-6 md:left-10 lg:left-16 xl:left-24 bottom-[-3rem] md:bottom-[-2rem] lg:bottom-4 z-[6] max-w-[92%] md:max-w-[64%] ${
              mounted ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h1
              className="hero-heading leading-[0.85]"
              data-testid="hero-heading"
              style={{ fontSize: "clamp(2.6rem, 9vw, 8.5rem)" }}
            >
              <span className="font-editorial-italic block" style={{ fontWeight: 300 }}>
                creative
              </span>
              <span className="font-editorial block uppercase tracking-tight" style={{ fontWeight: 900 }}>
                Direction
              </span>
              <span
                className="font-editorial-italic block"
                style={{
                  fontWeight: 300,
                  fontSize: "0.55em",
                  marginTop: "0.15em",
                  color: "#D7E2EA",
                  WebkitTextFillColor: "#D7E2EA",
                  background: "none",
                }}
              >
                &amp; production
              </span>
            </h1>
            <p
              className="mt-5 md:mt-6 max-w-md text-[#D7E2EA]/85 font-light leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)" }}
            >
              I&apos;m <span className="font-editorial-italic text-[#D7E2EA]">Tanmay</span> — Video Editor & Content Creator. I&apos;ve stood on sets for Nykaa, Himalaya, and Lenovo. Now I build content systems for brands getting there.
            </p>
          </motion.div>

          {/* ---------- Floating info card (top-right) — appears above camera on md ---------- */}
          <motion.div
            style={{ x: scaX, y: scaY }}
            initial={{ opacity: 0, x: 40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block lg:hidden absolute top-6 right-4 z-[6] max-w-[240px] backdrop-blur-md"
          >
            <InfoCard title="Creative Collective">
              Strategy, shoot, edit and delivery — one system, one point of contact.
            </InfoCard>
          </motion.div>

          {/* Mid-left card (desktop only, doesn't overlap camera) */}
          <motion.div
            style={{ x: scbX, y: scbY }}
            initial={{ opacity: 0, x: -40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute top-16 left-2 xl:left-4 z-[6] max-w-[240px] backdrop-blur-md"
          >
            <InfoCard title="2nd–3rd AD Credits" dot>
              Nykaa · Himalaya · Lenovo × FIFA WC 2026 · AMD · Arpanvester
            </InfoCard>
          </motion.div>

          {/* Stat card floating bottom-right (desktop) - repositioned near camera */}
          <div className="hidden md:flex absolute right-4 md:right-6 lg:right-16 bottom-6 lg:bottom-14 z-[8] gap-3">
            <StatCard number="05" label="Brand campaigns" delay={0.9} mounted={mounted} />
            <StatCard number="2–3" label="Brands at a time" delay={1.0} mounted={mounted} />
          </div>
        </div>

        {/* ---------- Buttons below ---------- */}
        <div
          className={`relative mt-24 md:mt-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 ${
            mounted ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.9s" }}
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

          <div className="font-mono-display text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#D7E2EA]/45">
            2nd–3rd AD · Nykaa · Himalaya · Lenovo
          </div>

          {/* Mobile-only stats */}
          <div className="md:hidden flex gap-3 w-full">
            <StatCard number="05" label="Brand campaigns" delay={0.95} mounted={mounted} compact />
            <StatCard number="2–3" label="Brands at a time" delay={1.05} mounted={mounted} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, dot = false, children }) {
  return (
    <div className="rounded-2xl border border-[#D7E2EA]/12 bg-[rgba(12,12,12,0.55)] p-4 lg:p-5">
      <div className="flex items-center gap-2 text-[10px] font-mono-display uppercase tracking-[0.24em] text-[#D7E2EA]/60">
        {dot ? (
          <span className="w-1 h-1 rounded-full bg-[#B600A8]" />
        ) : (
          <Sparkles size={12} />
        )}
        {title}
      </div>
      <p className="mt-3 text-[#D7E2EA] text-sm leading-relaxed">{children}</p>
    </div>
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
        compact ? "px-4 py-3 flex-1" : "px-5 py-4 min-w-[128px]"
      }`}
    >
      <div
        className={`font-editorial leading-none tracking-tight ${
          compact ? "text-3xl" : "text-4xl lg:text-5xl"
        }`}
        style={{ fontWeight: 900 }}
      >
        {number}
      </div>
      <div className="mt-1.5 text-[10px] font-mono-display uppercase tracking-[0.18em] text-[#0C0C0C]/60">
        {label}
      </div>
    </motion.div>
  );
}
