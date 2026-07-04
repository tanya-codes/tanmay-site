import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import FadeIn from "./FadeIn";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

const ABOUT_TEXT =
  "My background is in professional ad production. I've worked as a 2nd–3rd Assistant Director on shoots for Nykaa, Himalaya, AMD and Lenovo — which means I understand what brand content looks like when it's made with real creative intention, not just a phone and some trending audio. Now I build monthly content systems that bring that same intentionality to brands ready to grow.";

const ABOUT_EXPANDED =
  "Before working with brands independently, I spent time on professional ad sets as an Assistant Director — productions for Nykaa, Himalaya, Lenovo's FIFA World Cup 2026 campaign, AMD and Arpanvester. Those shoots taught me something most content creators never learn: what brand storytelling looks like when it's built with serious intent. I work with 2–3 brands at a time. Strategy first. Shoot second. Everything else follows.";

export default function About() {
  const sectionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#0C0C0C] py-32 md:py-40 overflow-hidden"
    >
      {/* Decorative corner shapes */}
      <CornerShape corner="top-left" />
      <CornerShape corner="top-right" />
      <CornerShape corner="bottom-left" />
      <CornerShape corner="bottom-right" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center">
        <motion.h2
          style={{ y: headingY }}
          className="hero-heading font-black uppercase tracking-tight leading-none"
        >
          <span
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", display: "block" }}
          >
            About Me
          </span>
        </motion.h2>

        <div className="mt-10 md:mt-14 max-w-3xl mx-auto">
          <AnimatedParagraph text={ABOUT_TEXT} sectionRef={sectionRef} />
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-8 max-w-3xl mx-auto text-[#D7E2EA]/80 text-base md:text-lg leading-relaxed">
                {ABOUT_EXPANDED}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <FadeIn delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            data-testid={TEST_IDS.aboutKnowMore}
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#D7E2EA]/80 hover:text-[#D7E2EA] transition-colors"
          >
            {expanded ? "Show less" : "Know more"}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
          <MagneticButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            data-testid={TEST_IDS.aboutLetsTalk}
            onClick={() => trackEvent("whatsapp_click", { source: "about" })}
          >
            Let&apos;s Talk <span aria-hidden>→</span>
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}

function AnimatedParagraph({ text, sectionRef }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = text.split("");

  return (
    <p className="text-[#D7E2EA] text-lg md:text-2xl leading-relaxed md:leading-[1.6] tracking-tight text-left md:text-center">
      {chars.map((c, i) => (
        <Char key={i} progress={scrollYProgress} index={i} total={chars.length}>
          {c}
        </Char>
      ))}
    </p>
  );
}

function Char({ children, progress, index, total }) {
  const start = index / total;
  const end = (index + 4) / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function CornerShape({ corner }) {
  const map = {
    "top-left": { top: 40, left: 20, rotate: 0 },
    "top-right": { top: 40, right: 20, rotate: 90 },
    "bottom-left": { bottom: 40, left: 20, rotate: -90 },
    "bottom-right": { bottom: 40, right: 20, rotate: 180 },
  };
  const style = map[corner];
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 0.4, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute hidden md:block"
      style={{ ...style, transform: `rotate(${style.rotate}deg)` }}
    >
      {/* Aperture-inspired circle with cross */}
      <div className="w-16 h-16 rounded-full border border-[#D7E2EA]/20 relative">
        <div className="absolute inset-2 rounded-full border border-[#D7E2EA]/10" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D7E2EA]/15" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D7E2EA]/15" />
      </div>
    </motion.div>
  );
}
