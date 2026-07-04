import React from "react";
import { motion } from "framer-motion";
import { SERVICES } from "../../constants";

export default function Services() {
  return (
    <section
      id="services"
      className="relative bg-white text-[#0C0C0C] rounded-t-[50px] md:rounded-t-[60px] py-24 md:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-black uppercase tracking-tight leading-none text-center text-[#0C0C0C]"
        >
          <span
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", display: "block" }}
          >
            Services
          </span>
        </motion.h2>

        <div className="mt-14 md:mt-20 max-w-4xl mx-auto">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.n} item={s} index={i} isLast={i === SERVICES.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ item, index, isLast }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      style={{ transition: "all 0.25s cubic-bezier(0.25,0.1,0.25,1)" }}
      className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-8 md:py-10 border-t border-[#0C0C0C]/12 hover:bg-[#0C0C0C]/[0.02] px-2 rounded-2xl"
      data-testid={`service-${item.n}`}
    >
      <div
        className="font-black leading-none text-[#0C0C0C] shrink-0"
        style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
      >
        {item.n}
      </div>
      <div className="flex-1">
        <h3 className="text-2xl md:text-4xl font-medium leading-tight tracking-tight text-[#0C0C0C]">
          {item.title}
        </h3>
        <p className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed text-[#0C0C0C]/70 max-w-2xl">
          {item.body}
        </p>
      </div>
      {isLast && <div className="border-b border-[#0C0C0C]/12 md:hidden" />}
    </motion.article>
  );
}
