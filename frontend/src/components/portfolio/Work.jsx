import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, ArrowUpRight, X, ExternalLink } from "lucide-react";
import { WORK_CARDS, KNOW_MORE_CONTENT } from "../../constants";
import { API, trackEvent } from "../../lib/track";

/* ========== Know More lookup ========== */
function getKnowMore(cardId, title) {
  const c = KNOW_MORE_CONTENT[cardId];
  if (!c) return null;
  const t = (title || "").toLowerCase();
  for (const [key, val] of Object.entries(c)) {
    if (t.includes(key.replace(/_/g, " "))) return val;
  }
  return null;
}

/* ========== Main Work Section ========== */
/* Hardcoded fallback so the portfolio works without the backend */
const FALLBACK_ITEMS = [
  { card_id: "campaign", title: "Himalaya Work", url: "/videos/himalaya_work.mp4", kind: "video" },
  { card_id: "campaign", title: "AMD Work", url: "/videos/amd_work.mp4", kind: "video" },
  { card_id: "campaign", title: "Lenovo Work", url: "/videos/lenovo_work.mp4", kind: "video" },
  { card_id: "campaign", title: "Arpanvester Work", url: "/videos/arpanvester_work.mp4", kind: "video" },
  { card_id: "growth", title: "Bakery Edit", url: "/videos/bakery_edit.mp4", kind: "video" },
  { card_id: "growth", title: "Real Estate Edit 1", url: "/videos/real_estate_edit_1.mp4", kind: "video" },
  { card_id: "growth", title: "Real Estate Edit 2", url: "/videos/real_estate_edit_2.mp4", kind: "video" },
  { card_id: "growth", title: "Viral Edit", url: "/videos/viral_edit.mp4", kind: "video" },
  { card_id: "editing", title: "Spotify Edit", url: "/videos/spotify_edit.mp4", kind: "video" },
  { card_id: "editing", title: "Spiderman Edit", url: "/videos/spiderman_edit.mp4", kind: "video" },
  { card_id: "editing", title: "Party Edit", url: "/videos/party_edit.mp4", kind: "video" },
  { card_id: "editing", title: "Stranger Things Edit", url: "/videos/stranger_things_edit.mp4", kind: "video" },
];

export default function Work() {
  const containerRef = useRef(null);
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [viewVideo, setViewVideo] = useState(null); // { item, cardId, clipName }

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API}/work-items`)
      .then((res) => {
        if (mounted && res.data && res.data.length > 0) setItems(res.data);
      })
      .catch(() => {
        // Fallback data is already set as initial state
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTileClick = (item, cardId, clipName) => {
    setViewVideo({ item, cardId, clipName });
    trackEvent("video_view", { clip: clipName, card: cardId });
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
            Three collections — click any clip to view in full-screen.
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
              onTileClick={handleTileClick}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Split-Panel Video Viewer */}
      <AnimatePresence>
        {viewVideo && (
          <VideoViewer
            item={viewVideo.item}
            cardId={viewVideo.cardId}
            clipName={viewVideo.clipName}
            onClose={() => setViewVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ========== Sticky Card ========== */
function StickyCard({ card, index, total, items, onTileClick }) {
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "start start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const stickyTop = 96 + index * 20;

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ minHeight: "min(1080px, 130vh)" }}
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
                <p className="mt-2 text-sm md:text-base text-[#D7E2EA]/60 max-w-lg leading-relaxed uppercase tracking-[0.08em] font-mono-display">
                  {card.body}
                </p>
              </div>
            </div>
          </div>

          <MediaGrid items={items} card={card} onTileClick={onTileClick} />
        </motion.article>
      </div>
    </div>
  );
}

/* ========== 4-Column Media Grid ========== */
function MediaGrid({ items, card, onTileClick }) {
  const clipNames = card.clipNames || [];
  const list =
    items && items.length > 0
      ? items
      : [null, null, null, null];

  return (
    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-1 md:p-2">
      {list.map((item, i) => {
        const displayTitle = item?.title || clipNames[i] || `Clip ${i + 1}`;
        return (
          <MediaTile
            key={item?.id || i}
            item={item}
            card={card}
            clipName={displayTitle}
            onTileClick={() => item && onTileClick(item, card.id, displayTitle)}
            className="aspect-[3/4]"
          />
        );
      })}
    </div>
  );
}

/* ========== Media Tile ========== */
function MediaTile({ item, className, card, clipName, onTileClick }) {
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
  const hasKnowMore = item && (item.description || item.brand || getKnowMore(card.id, item.title));

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
      >
        <div className="absolute bottom-3 left-4 right-4 text-[10px] md:text-xs text-white/60 uppercase tracking-[0.22em] font-mono-display truncate">
          {clipName}
        </div>
      </div>
    );
  }

  return (
    <button
      ref={ref}
      onClick={onTileClick}
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden group text-left cursor-pointer ${className}`}
      style={{ background: gradients[card.id] }}
      data-testid={`work-tile-${card.id}-${clipName.replace(/\s/g, "_")}`}
    >
      {item.kind === "video" ? (
        <VideoTile url={item.url} inView={inView} />
      ) : (
        <img
          src={item.url}
          alt={clipName || ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {/* Gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      {/* Know More pill (top-left) */}
      {hasKnowMore && (
        <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.18em] text-white/90 font-mono-display bg-[#B600A8]/70 backdrop-blur-md border border-white/15 rounded-full px-2.5 py-1 z-10">
          Know More
        </div>
      )}

      {/* Reel pill (top-right) */}
      {item.kind === "video" && (
        <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.22em] text-white/85 font-mono-display bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 inline-flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-record-blink" />
          Reel
        </div>
      )}

      {/* Play hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
          <Play className="text-white" size={20} fill="currentColor" />
        </span>
      </div>

      {/* Clip name */}
      <div className="absolute bottom-3 left-4 right-4 text-[10px] md:text-xs text-white/90 uppercase tracking-[0.22em] font-mono-display truncate">
        {clipName}
      </div>
    </button>
  );
}

/* ========== Video Tile (autoplay in grid) ========== */
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

/* ========== Split-Panel Fullscreen Video Viewer ========== */
function VideoViewer({ item, cardId, clipName, onClose }) {
  const brand = (item?.description || item?.brand)
    ? {
        brand: item.brand || item.title,
        description: item.description || "",
        link: item.link || null,
        linkText: item.link_text || (item.link ? "Watch final output" : null),
      }
    : getKnowMore(cardId, item?.title);
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      key="video-viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #08080a 0%, #0e0a14 40%, #0c0c10 100%)",
      }}
    >
      {/* ——— Top bar ——— */}
      <div className="flex items-center justify-between px-5 md:px-10 h-14 md:h-16 shrink-0 border-b border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/70 font-mono-display">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-record-blink" />
            Now Playing
          </span>
          <span className="text-white/90 font-mono-display text-xs uppercase tracking-[0.18em] hidden sm:inline">
            {clipName}
          </span>
        </motion.div>
        <div className="flex items-center gap-2">
          {brand && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInfoPanelOpen(!infoPanelOpen);
              }}
              className={`hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono-display rounded-full px-3.5 py-2 border transition-all ${
                infoPanelOpen
                  ? "bg-[#B600A8]/15 border-[#B600A8]/30 text-[#D946EF]"
                  : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white/90 hover:border-white/20"
              }`}
            >
              <ArrowUpRight
                size={12}
                className={`transition-transform ${
                  infoPanelOpen ? "rotate-180" : ""
                }`}
              />
              Details
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ——— Main split area ——— */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT — Know More Panel (desktop) */}
        <AnimatePresence>
          {brand && infoPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "clamp(320px, 30vw, 420px)", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex flex-col shrink-0 overflow-hidden border-r border-white/[0.06]"
            >
              <div className="flex-1 overflow-y-auto px-7 py-8 custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Brand icon + name */}
                  <div className="flex items-center gap-3.5 mb-7">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(182,0,168,0.25) 0%, rgba(118,33,176,0.2) 100%)",
                        border: "1px solid rgba(182,0,168,0.2)",
                      }}
                    >
                      <span
                        className="text-base font-editorial text-white/90"
                        style={{ fontWeight: 700 }}
                      >
                        {brand.brand.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#D946EF]/60 font-mono-display mb-0.5">
                        Project Details
                      </p>
                      <h4
                        className="font-editorial text-white tracking-tight leading-tight"
                        style={{ fontSize: "1.25rem", fontWeight: 700 }}
                      >
                        {brand.brand}
                      </h4>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px mb-6"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(182,0,168,0.3) 0%, transparent 100%)",
                    }}
                  />

                  {/* Description */}
                  <div className="space-y-4">
                    {brand.description.split("\n\n").map((para, pi) => (
                      <p
                        key={pi}
                        className="text-[13px] md:text-[14px] text-white/65 leading-[1.75]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Link */}
                  {brand.link ? (
                    <a
                      href={brand.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-7 px-4 py-2.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-mono-display transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(182,0,168,0.15) 0%, rgba(118,33,176,0.1) 100%)",
                        border: "1px solid rgba(182,0,168,0.25)",
                        color: "#D946EF",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, rgba(182,0,168,0.25) 0%, rgba(118,33,176,0.2) 100%)";
                        e.currentTarget.style.borderColor =
                          "rgba(182,0,168,0.45)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, rgba(182,0,168,0.15) 0%, rgba(118,33,176,0.1) 100%)";
                        e.currentTarget.style.borderColor =
                          "rgba(182,0,168,0.25)";
                      }}
                      onClick={() =>
                        trackEvent("know_more_link_click", {
                          brand: brand.brand,
                          card: cardId,
                        })
                      }
                    >
                      <ExternalLink size={13} />
                      {brand.linkText || "View Project"}
                    </a>
                  ) : brand.linkText ? (
                    <p className="mt-7 text-[11px] text-white/35 italic flex items-center gap-2 font-mono-display">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                      {brand.linkText}
                    </p>
                  ) : null}
                </motion.div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* RIGHT — Video Player */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full max-w-full flex items-center justify-center"
          >
            {item.kind === "video" ? (
              <video
                src={item.url}
                className="max-w-full max-h-full object-contain rounded-2xl md:rounded-3xl"
                style={{
                  boxShadow:
                    "0 25px 80px -15px rgba(0,0,0,0.7), 0 0 60px -20px rgba(182,0,168,0.15)",
                }}
                controls
                autoPlay
                playsInline
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <img
                src={item.url}
                alt={clipName}
                className="max-w-full max-h-full object-contain rounded-2xl md:rounded-3xl"
                style={{
                  boxShadow:
                    "0 25px 80px -15px rgba(0,0,0,0.7), 0 0 60px -20px rgba(182,0,168,0.15)",
                }}
              />
            )}

            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-3xl opacity-25 blur-[60px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(182,0,168,0.2) 0%, rgba(118,33,176,0.08) 50%, transparent 80%)",
              }}
            />
          </motion.div>
        </div>

        {/* MOBILE — Know More bottom sheet */}
        {brand && (
          <div className="md:hidden shrink-0 max-h-[40vh] overflow-y-auto border-t border-white/[0.06] px-5 py-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(182,0,168,0.25), rgba(118,33,176,0.2))",
                  border: "1px solid rgba(182,0,168,0.2)",
                }}
              >
                <span
                  className="text-sm font-editorial text-white/90"
                  style={{ fontWeight: 700 }}
                >
                  {brand.brand.charAt(0)}
                </span>
              </div>
              <h4
                className="font-editorial text-white tracking-tight"
                style={{ fontSize: "1.1rem", fontWeight: 700 }}
              >
                {brand.brand}
              </h4>
            </div>
            <div className="space-y-3">
              {brand.description.split("\n\n").map((para, pi) => (
                <p
                  key={pi}
                  className="text-[12px] text-white/55 leading-[1.7]"
                >
                  {para}
                </p>
              ))}
            </div>
            {brand.link && (
              <a
                href={brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-3.5 py-2 rounded-full text-[10px] uppercase tracking-[0.14em] font-mono-display text-[#D946EF]"
                style={{
                  background: "rgba(182,0,168,0.12)",
                  border: "1px solid rgba(182,0,168,0.25)",
                }}
              >
                <ExternalLink size={12} />
                {brand.linkText || "View Project"}
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
