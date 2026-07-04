import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowUpRight } from "lucide-react";
import { WORK_CARDS } from "../../constants";
import { API, trackEvent } from "../../lib/track";
import WorkLightbox from "./WorkLightbox";

export default function Work() {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API}/work-items`)
      .then((res) => {
        if (mounted) setItems(res.data || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const openCard = WORK_CARDS.find((c) => c.id === openCardId) || null;
  const openItems = openCard
    ? items.filter((it) => it.card_id === openCard.id)
    : [];

  const handleOpen = (id) => {
    setOpenCardId(id);
    trackEvent("work_open", { card: id });
  };

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative bg-[#0C0C0C] rounded-t-[50px] md:rounded-t-[60px] -mt-10 pt-24 md:pt-32 pb-32"
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hero-heading font-editorial tracking-tight leading-none"
          >
            <span
              style={{
                fontSize: "clamp(3rem, 12vw, 9rem)",
                display: "block",
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              Work
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-[#D7E2EA]/60 text-base md:text-lg leading-relaxed"
          >
            Three collections — click any card to open every clip in full-screen.
          </motion.p>
        </div>

        <div className="relative">
          {WORK_CARDS.map((card, i) => (
            <StickyCard
              key={card.id}
              card={card}
              index={i}
              total={WORK_CARDS.length}
              items={items.filter((it) => it.card_id === card.id)}
              onOpen={() => handleOpen(card.id)}
            />
          ))}
        </div>
      </div>

      <WorkLightbox
        open={openCardId !== null}
        onClose={() => setOpenCardId(null)}
        card={openCard}
        items={openItems}
      />
    </section>
  );
}

function StickyCard({ card, index, total, items, onOpen }) {
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "start start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const stickyTop = 96 + index * 20;

  // min-h larger than card height ensures room for full-view + next-card entry
  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{
        minHeight: "min(1080px, 130vh)",
      }}
    >
      <div className="sticky" style={{ top: `${stickyTop}px` }}>
        <motion.article
          style={{ scale }}
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative overflow-hidden rounded-[40px] md:rounded-[50px] bg-[#111] p-4 md:p-6 lg:p-8"
          data-testid={`work-card-${card.id}`}
        >
          <div
            className="absolute inset-0 rounded-[40px] md:rounded-[50px] pointer-events-none"
            style={{ border: "1.5px solid rgba(215,226,234,0.12)" }}
          />
          {/* Header */}
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5 md:mb-8 p-1 md:p-2">
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="hero-heading font-editorial leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
                  fontWeight: 900,
                  fontStyle: "italic",
                }}
              >
                {card.number}
              </div>
              <div>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-[#D7E2EA]/50 font-mono-display">
                  {card.category}
                </p>
                <h3
                  className="mt-1 md:mt-2 font-editorial text-[#D7E2EA] leading-tight tracking-tight max-w-xl"
                  style={{
                    fontSize: "clamp(1.35rem, 2.4vw, 2.2rem)",
                    fontWeight: 700,
                  }}
                >
                  {card.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-[#D7E2EA]/60 max-w-lg leading-relaxed">
                  {card.body}
                </p>
              </div>
            </div>
            <button
              onClick={onOpen}
              data-testid={`work-open-${card.id}`}
              className="self-start md:self-end shrink-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#D7E2EA] border border-[#D7E2EA]/25 rounded-full pl-4 pr-2 py-2 hover:bg-white hover:text-[#0C0C0C] transition-colors group"
            >
              View all clips
              <span className="w-7 h-7 rounded-full bg-[#D7E2EA]/10 group-hover:bg-[#0C0C0C]/10 flex items-center justify-center">
                <ArrowUpRight size={13} />
              </span>
            </button>
          </div>

          <MediaGrid items={items} card={card} onOpen={onOpen} />
        </motion.article>
      </div>
    </div>
  );
}

function MediaGrid({ items, card, onOpen }) {
  // 4-tile compact layout that fits inside viewport height
  const list =
    items && items.length > 0
      ? items.slice(0, 4)
      : [null, null, null, null];
  const [main, t2, t3, t4] = list;

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 md:gap-4 p-1 md:p-2">
      {/* Big feature tile */}
      <MediaTile
        item={main}
        card={card}
        onOpen={onOpen}
        className="aspect-video md:aspect-[16/11]"
        showPlayIcon
      />
      {/* Side grid — 3 smaller tiles */}
      <div className="grid grid-cols-3 md:grid-cols-2 gap-3 md:gap-4">
        <MediaTile item={t2} card={card} onOpen={onOpen} className="aspect-[3/4]" />
        <MediaTile item={t3} card={card} onOpen={onOpen} className="aspect-[3/4]" />
        <MediaTile
          item={t4}
          card={card}
          onOpen={onOpen}
          className="aspect-[3/4] md:col-span-2 md:aspect-[16/9]"
        />
      </div>
    </div>
  );
}

function MediaTile({ item, className, card, onOpen, showPlayIcon = false }) {
  const gradients = {
    campaign:
      "linear-gradient(135deg, #051A24 0%, #0D212C 40%, #18011F 100%)",
    growth:
      "linear-gradient(135deg, #0D212C 0%, #7621B0 60%, #B600A8 100%)",
    editing:
      "linear-gradient(135deg, #18011F 0%, #7621B0 40%, #BE4C00 100%)",
  };
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            const v = el.querySelector("video");
            if (v) {
              const p = v.play();
              if (p && p.catch) p.catch(() => {});
            }
          } else {
            const v = el.querySelector("video");
            if (v) v.pause();
          }
        });
      },
      { threshold: 0.25, rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [item?.url]);

  if (!item) {
    return (
      <div
        className={`relative rounded-2xl md:rounded-3xl overflow-hidden shimmer-bg ${className}`}
        style={{ background: gradients[card.id] || gradients.campaign }}
      />
    );
  }

  return (
    <button
      ref={ref}
      onClick={onOpen}
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden group text-left cursor-pointer ${className}`}
      style={{ background: gradients[card.id] }}
      data-testid={`work-tile-${card.id}-${item.title?.replace(/\s/g, "_") || "x"}`}
    >
      {item.kind === "video" ? (
        <VideoTile url={item.url} inView={inView} />
      ) : (
        <img
          src={item.url}
          alt={item.title || ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {/* Gradient at bottom for title */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      {/* Reel pill */}
      {item.kind === "video" && (
        <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.22em] text-white/85 font-mono-display bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 inline-flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-record-blink" />
          Reel
        </div>
      )}
      {/* Play hover overlay */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
            <Play className="text-white" size={22} fill="currentColor" />
          </span>
        </div>
      )}
      {item.title && (
        <div className="absolute bottom-3 left-4 right-4 text-[10px] md:text-xs text-white/90 uppercase tracking-[0.22em] font-mono-display truncate">
          {item.title}
        </div>
      )}
    </button>
  );
}

function VideoTile({ url, inView }) {
  const [errored, setErrored] = React.useState(false);
  const vref = React.useRef(null);

  React.useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (inView && !errored) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else if (v) {
      v.pause();
    }
  }, [inView, errored]);

  if (errored) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 100%)",
        }}
      />
    );
  }

  return (
    <video
      ref={vref}
      src={url}
      className="w-full h-full object-cover"
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      onError={() => setErrored(true)}
    />
  );
}
