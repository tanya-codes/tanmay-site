import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "../../constants";

export default function Services() {
  const containerRef = useRef(null);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative bg-white text-[#0C0C0C] rounded-t-[50px] md:rounded-t-[60px] py-24 md:py-32 -mt-10"
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial tracking-tight leading-none text-[#0C0C0C]"
          >
            <span
              style={{
                fontSize: "clamp(3rem, 12vw, 9rem)",
                display: "block",
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              Services
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-[#0C0C0C]/60 text-base md:text-lg leading-relaxed"
          >
            Six things I do — and how they connect. Every service is a piece of
            the same content system.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {SERVICES.map((s, i) => (
            <ServiceCard
              key={s.n}
              item={s}
              index={i}
              total={SERVICES.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ item, index, total }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.02;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, index % 2 === 0 ? -0.6 : 0.6]
  );

  return (
    <div ref={ref} className="sticky" style={{ top: `${112 + index * 14}px` }}>
      <motion.article
        style={{ scale, rotate }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="group relative mb-4 md:mb-5 rounded-3xl bg-[#F6F6F4] border border-[#0C0C0C]/10 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-shadow"
        data-testid={`service-${item.n}`}
      >
        {/* Gradient accent bar on hover */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background:
              "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8 p-6 md:p-10">
          <div
            className="font-editorial leading-none text-[#0C0C0C] tracking-tight shrink-0"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 900 }}
          >
            {item.n}
          </div>
          <div className="flex-1">
            <h3
              className="font-editorial text-[#0C0C0C] tracking-tight leading-tight"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.25rem)", fontWeight: 700 }}
            >
              {item.title}
            </h3>
            <p className="mt-2 md:mt-3 text-sm md:text-base leading-relaxed text-[#0C0C0C]/65 max-w-2xl">
              {item.body}
            </p>
          </div>
          <div className="shrink-0 hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#0C0C0C]/50 group-hover:text-[#0C0C0C] transition-colors">
            <span>Explore</span>
            <span className="inline-flex w-9 h-9 items-center justify-center rounded-full border border-[#0C0C0C]/20 group-hover:border-[#0C0C0C]/50 transition-colors">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
