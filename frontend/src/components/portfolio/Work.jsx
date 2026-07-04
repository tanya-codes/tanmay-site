import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { WORK_CARDS } from "../../constants";
import { API } from "../../lib/track";

export default function Work() {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API}/work-items`)
      .then((res) => {
        if (mounted) setItems(res.data || []);
      })
      .catch(() => {});
    // Also try loading video-manifest.json fallback
    fetch("/video-manifest.json")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((json) => {
        if (mounted && (!items || items.length === 0)) {
          // don't overwrite backend items if present
        }
        if (mounted) {
          setItems((prev) =>
            prev && prev.length > 0 ? prev : json.items || []
          );
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative bg-[#0C0C0C] rounded-t-[50px] md:rounded-t-[60px] -mt-10 pt-24 md:pt-32 pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="hero-heading font-black uppercase tracking-tight leading-none text-center"
        >
          <span
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", display: "block" }}
          >
            Work
          </span>
        </motion.h2>

        <div className="mt-14 md:mt-20 relative">
          {WORK_CARDS.map((card, i) => (
            <WorkCard
              key={card.id}
              card={card}
              index={i}
              total={WORK_CARDS.length}
              container={containerRef}
              items={items.filter((it) => it.card_id === card.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ card, index, total, container, items }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="sticky mb-8"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.article
        style={{ scale }}
        whileHover={{ scale: 1.005 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative overflow-hidden bg-[#111] p-4 md:p-8"
        data-testid={`work-card-${card.id}`}
      >
        <div
          className="absolute inset-0 rounded-[40px] md:rounded-[50px] pointer-events-none"
          style={{
            border: "2px solid rgba(215,226,234,0.12)",
          }}
        />
        <div className="relative rounded-[40px] md:rounded-[50px] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-10 p-2 md:p-4">
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="hero-heading font-black leading-none"
                style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
              >
                {card.number}
              </div>
              <div>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-[#273C46] font-mono">
                  {card.category}
                </p>
                <h3 className="mt-1 md:mt-2 text-2xl md:text-4xl text-[#D7E2EA] font-medium leading-tight tracking-tight max-w-xl">
                  {card.title}
                </h3>
                <p className="mt-2 md:mt-3 text-sm md:text-base text-[#D7E2EA]/60 max-w-lg">
                  {card.body}
                </p>
              </div>
            </div>
            <button
              className="self-start md:self-end shrink-0 text-xs uppercase tracking-[0.24em] text-[#D7E2EA]/70 hover:text-[#D7E2EA] transition-colors border border-[#D7E2EA]/20 rounded-full px-4 py-2"
              onClick={() =>
                window.open(
                  "https://instagram.com/tanmayvisuals.in",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Know More →
            </button>
          </div>

          <MediaGrid items={items} card={card} />
        </div>
      </motion.article>
    </div>
  );
}

function MediaGrid({ items, card }) {
  const list = items && items.length > 0 ? items.slice(0, 4) : defaultPlaceholders(card);
  const [main, ...rest] = list;

  return (
    <div className="grid grid-cols-5 gap-3 md:gap-4 p-2 md:p-4">
      <MediaTile
        item={main}
        className="col-span-5 md:col-span-2 aspect-[4/5]"
        card={card}
      />
      <div className="col-span-5 md:col-span-3 grid grid-cols-2 gap-3 md:gap-4">
        {rest.slice(0, 3).map((it, i) => (
          <MediaTile
            key={i}
            item={it}
            className={`aspect-[4/3] ${i === 2 ? "col-span-2" : ""}`}
            card={card}
          />
        ))}
      </div>
    </div>
  );
}

function MediaTile({ item, className, card }) {
  const gradients = {
    campaign:
      "linear-gradient(135deg, #051A24 0%, #0D212C 40%, #18011F 100%)",
    growth:
      "linear-gradient(135deg, #0D212C 0%, #7621B0 60%, #B600A8 100%)",
    editing:
      "linear-gradient(135deg, #18011F 0%, #7621B0 40%, #BE4C00 100%)",
  };

  if (!item) {
    return (
      <div
        className={`relative rounded-2xl md:rounded-3xl overflow-hidden shimmer-bg ${className}`}
        style={{ background: gradients[card.id] || gradients.campaign }}
      >
        <PlaceholderContent card={card} />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden group ${className}`}
      style={{ background: gradients[card.id] }}
    >
      {item.kind === "video" ? (
        <video
          src={item.url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          poster=""
        />
      ) : (
        <img
          src={item.url}
          alt={item.title || ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {item.title && (
        <div className="absolute bottom-3 left-4 text-xs text-white/90 uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity">
          {item.title}
        </div>
      )}
    </div>
  );
}

function PlaceholderContent({ card }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
          {card.category}
        </div>
        <div className="mt-2 text-white/80 text-sm md:text-base font-medium max-w-[220px]">
          Upload video via admin panel
        </div>
      </div>
    </div>
  );
}

function defaultPlaceholders(card) {
  return [null, null, null, null];
}
