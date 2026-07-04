import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { WHATSAPP_URL } from "../../constants";
import { trackEvent } from "../../lib/track";

/**
 * WorkLightbox — fullscreen dialog showing all clips for a Work card.
 * Left: large playing video. Right: scrollable thumbnail column.
 */
export default function WorkLightbox({ open, onClose, card, items }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (open) setActiveIdx(0);
  }, [open, card?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setActiveIdx((i) => Math.min(i + 1, items.length - 1));
      if (e.key === "ArrowLeft") setActiveIdx((i) => Math.max(i - 1, 0));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length, onClose]);

  if (!card) return null;
  const active = items[activeIdx];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="wl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] bg-[#0C0C0C]/95 backdrop-blur-xl"
          data-testid="work-lightbox"
        >
          {/* Top bar */}
          <div className="relative z-[91] flex items-center justify-between px-5 md:px-10 h-16 md:h-20 border-b border-white/8">
            <div className="flex items-center gap-3 md:gap-5 min-w-0">
              <span className="font-mono-display text-[10px] uppercase tracking-[0.28em] text-[#D7E2EA]/50">
                {card.number} / {card.category}
              </span>
              <span
                className="hidden md:inline-block font-editorial text-[#D7E2EA] truncate"
                style={{ fontWeight: 700, fontSize: "1.25rem" }}
              >
                {card.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    source: "work_lightbox",
                    card: card.id,
                  })
                }
                className="hidden md:inline-flex items-center gap-2 rounded-full btn-gradient text-white px-4 py-2 text-xs font-medium tracking-wide"
                data-testid="lightbox-whatsapp"
              >
                Get this for my brand <Send size={12} />
              </a>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-colors"
                data-testid="lightbox-close"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-[91] grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px] h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
            {/* Main player */}
            <div className="relative flex items-center justify-center bg-black p-4 md:p-8">
              {active ? (
                <div className="relative w-full h-full max-h-full flex items-center justify-center">
                  {active.kind === "video" ? (
                    <video
                      ref={videoRef}
                      key={active.id || active.url}
                      src={active.url}
                      className="max-w-full max-h-full object-contain rounded-2xl"
                      controls
                      autoPlay
                      playsInline
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <img
                      src={active.url}
                      alt={active.title || ""}
                      className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                  )}
                  {/* Overlay title */}
                  <div className="absolute left-4 md:left-8 top-4 md:top-8">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/90 font-mono-display">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-record-blink" />
                      Reel {activeIdx + 1} / {items.length}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-white/50">No clips available.</p>
              )}

              {/* Prev / Next */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveIdx((i) => (i === 0 ? items.length - 1 : i - 1))
                    }
                    className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous"
                    data-testid="lightbox-prev"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveIdx((i) => (i === items.length - 1 ? 0 : i + 1))
                    }
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors"
                    aria-label="Next"
                    data-testid="lightbox-next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail rail */}
            <aside className="border-t md:border-t-0 md:border-l border-white/8 overflow-y-auto p-4 md:p-5 bg-[#0A0A0A]">
              <div className="hidden md:block mb-4">
                <p className="text-[10px] font-mono-display uppercase tracking-[0.28em] text-white/45">
                  All clips · {items.length}
                </p>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  {card.body}
                </p>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
                {items.map((it, i) => (
                  <button
                    key={it.id || i}
                    onClick={() => setActiveIdx(i)}
                    className={`group relative aspect-[4/5] rounded-xl overflow-hidden border transition-all ${
                      i === activeIdx
                        ? "border-white/60 ring-2 ring-white/30"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    data-testid={`lightbox-thumb-${i}`}
                  >
                    {it.kind === "video" ? (
                      <video
                        src={it.url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <img
                        src={it.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2 text-[9px] uppercase tracking-[0.18em] text-white/85 font-mono-display truncate text-left">
                      {it.title || `Clip ${i + 1}`}
                    </div>
                    {i === activeIdx && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-record-blink" />
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile CTA */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    source: "work_lightbox_mobile",
                    card: card.id,
                  })
                }
                className="md:hidden mt-5 flex items-center justify-center gap-2 rounded-full btn-gradient text-white px-4 py-3 text-sm font-medium"
              >
                Get this for my brand <Send size={14} />
              </a>
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
