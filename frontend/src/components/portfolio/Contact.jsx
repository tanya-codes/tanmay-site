import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
  Camera,
  Film,
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import FadeIn from "./FadeIn";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

// Pre-composed WhatsApp intents — each opens WhatsApp with a tailored first line
const BASE = "https://wa.me/919266553033?text=";
const PROMPTS = [
  {
    id: "brand-shoot",
    icon: Camera,
    label: "Brand shoot",
    hint: "For a new campaign or product launch",
    msg:
      "Hi Tanmay — I'm interested in a brand shoot for my product / campaign. When can we get on a call?",
  },
  {
    id: "content-system",
    icon: Film,
    label: "Monthly content",
    hint: "Reels, shorts, and edits on retainer",
    msg:
      "Hi Tanmay — I'd like to explore a monthly content system for my brand. Can we discuss?",
  },
  {
    id: "performance",
    icon: TrendingUp,
    label: "Performance ads",
    hint: "Meta ads + creative + reporting",
    msg:
      "Hi Tanmay — I need help with Meta ads and performance creative. What does that look like with you?",
  },
  {
    id: "just-hi",
    icon: MessageCircle,
    label: "Just say hi",
    hint: "Not sure yet — let's chat",
    msg:
      "Hi Tanmay — I checked out your website and I'd like to chat about my brand.",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const openWhatsApp = (prompt) => {
    trackEvent("whatsapp_click", {
      source: "contact_prompt",
      prompt: prompt.id,
    });
    window.open(BASE + encodeURIComponent(prompt.msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-[#051A24] rounded-t-[50px] md:rounded-t-[60px] py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(118,33,176,0.15) 0%, transparent 60%), radial-gradient(50% 50% at 10% 90%, rgba(190,76,0,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <motion.h2
          style={{ y: headingY }}
          className="hero-heading font-editorial tracking-tight leading-none text-center"
        >
          <span
            style={{
              fontSize: "clamp(3rem, 12vw, 9rem)",
              display: "block",
              fontWeight: 900,
              fontStyle: "italic",
            }}
          >
            Let&apos;s Talk
          </span>
        </motion.h2>

        <FadeIn delay={0.1}>
          <p className="mt-6 md:mt-8 text-center max-w-xl mx-auto text-[#D7E2EA]/70 text-base md:text-lg leading-relaxed">
            Pick a starting point below — you&apos;ll land straight in my
            WhatsApp with the first line already written.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-10 md:mt-14 flex justify-center">
          <MagneticButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="accent"
            data-testid={TEST_IDS.contactWhatsapp}
            onClick={() => trackEvent("whatsapp_click", { source: "contact" })}
          >
            Message on WhatsApp <ArrowUpRight size={16} />
          </MagneticButton>
        </FadeIn>

        {/* Prompt tiles — the "form" replacement */}
        <FadeIn delay={0.3}>
          <div className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            {PROMPTS.map((p, i) => (
              <PromptTile
                key={p.id}
                prompt={p}
                index={i}
                onClick={() => openWhatsApp(p)}
              />
            ))}
          </div>
        </FadeIn>

        {/* Info block */}
        <FadeIn delay={0.4}>
          <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
            <InfoRow
              icon={<Instagram size={16} />}
              href="https://instagram.com/tanmayvisuals.in"
              label="Instagram"
              value="@tanmayvisuals.in"
            />
            <InfoRow
              icon={<Mail size={16} />}
              href="mailto:work.tanmay.in@gmail.com"
              label="Email"
              value="work.tanmay.in@gmail.com"
            />
            <InfoRow
              icon={<Phone size={16} />}
              href="tel:+919266553033"
              label="Phone"
              value="+91 92665 53033"
            />
            <InfoRow
              icon={<MapPin size={16} />}
              label="Based in"
              value="Delhi NCR · India"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p className="mt-14 md:mt-20 text-center text-sm md:text-base text-[#D7E2EA]/50 max-w-md mx-auto italic font-editorial-italic">
            &ldquo;I work with 2–3 brands at a time. Strategy first. Shoot
            second. Everything else follows.&rdquo;
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function PromptTile({ prompt, index, onClick }) {
  const Icon = prompt.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.6,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      data-testid={`prompt-${prompt.id}`}
      className="group relative rounded-3xl border border-[#D7E2EA]/12 bg-[rgba(215,226,234,0.03)] hover:bg-[rgba(215,226,234,0.06)] hover:border-[#D7E2EA]/25 p-5 md:p-6 text-left transition-all overflow-hidden"
    >
      {/* Gradient accent on hover */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        }}
      />
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <span className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#D7E2EA]/8 border border-[#D7E2EA]/15 flex items-center justify-center text-[#D7E2EA]">
          <Icon size={17} />
        </span>
        <span className="w-8 h-8 rounded-full border border-[#D7E2EA]/15 flex items-center justify-center text-[#D7E2EA]/60 group-hover:text-[#D7E2EA] group-hover:border-[#D7E2EA]/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
          <ArrowUpRight size={14} />
        </span>
      </div>
      <div
        className="font-editorial text-[#D7E2EA] leading-tight"
        style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", fontWeight: 700 }}
      >
        {prompt.label}
      </div>
      <p className="mt-2 text-[13px] md:text-sm text-[#D7E2EA]/55 leading-relaxed">
        {prompt.hint}
      </p>
    </motion.button>
  );
}

function InfoRow({ icon, href, label, value }) {
  const inner = (
    <div className="flex items-start gap-3 rounded-2xl border border-[#D7E2EA]/10 bg-[rgba(215,226,234,0.02)] hover:bg-[rgba(215,226,234,0.05)] p-4 md:p-5 transition-colors">
      <span className="mt-0.5 w-9 h-9 rounded-full bg-[#D7E2EA]/8 flex items-center justify-center text-[#D7E2EA]/80 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-mono-display uppercase tracking-[0.22em] text-[#D7E2EA]/45">
          {label}
        </div>
        <div className="mt-1 text-sm md:text-[15px] text-[#D7E2EA] truncate">
          {value}
        </div>
      </div>
    </div>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block"
    >
      {inner}
    </a>
  ) : (
    inner
  );
}
