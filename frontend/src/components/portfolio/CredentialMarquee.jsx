import React, { useEffect, useRef, useState } from "react";

const BRANDS = [
  { name: "NYKAA", font: "serif-caps", accent: "#FF3F6C" },
  { name: "Himalaya", font: "serif-italic", accent: "#3C7A31" },
  { name: "Lenovo", font: "sans-red", accent: "#E1140A" },
  { name: "AMD", font: "sans-bold", accent: "#67B637" },
  { name: "FIFA WC 2026", font: "sans-italic", accent: "#D7E2EA" },
  { name: "ARPANVESTER", font: "mono", accent: "#D7E2EA" },
];

export default function CredentialMarquee() {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    if (rm) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const offset = (window.innerHeight - rect.top) * 0.3;
        if (row1Ref.current)
          row1Ref.current.style.transform = `translateX(${offset - 240}px)`;
        if (row2Ref.current)
          row2Ref.current.style.transform = `translateX(${-(offset - 240)}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const tiles = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0C0C0C] pt-20 pb-14 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-8 md:mb-10 flex items-center justify-between">
        <p className="text-[10px] md:text-xs font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/45">
          Worked on production campaigns for
        </p>
        <span className="text-[10px] md:text-xs font-mono-display uppercase tracking-[0.28em] text-[#D7E2EA]/30">
          / 06 clients
        </span>
      </div>

      {/* Top row (moves right on scroll + auto-marquee) */}
      <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}>
        <div className="flex animate-marquee gap-8 md:gap-12">
          {tiles.map((b, i) => (
            <BrandMark key={`m1-${i}`} brand={b} />
          ))}
        </div>
      </div>

      {/* Bottom row — different pace (parallax gives second speed) */}
      <div className="relative overflow-hidden mt-4 md:mt-6" style={{ maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}>
        <div ref={row2Ref} className="flex gap-8 md:gap-12 will-change-transform" style={{ transform: "translateX(0)" }}>
          {tiles.reverse().map((b, i) => (
            <BrandMark key={`m2-${i}`} brand={b} muted />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandMark({ brand, muted = false }) {
  const base =
    "shrink-0 h-16 md:h-20 flex items-center justify-center px-2 md:px-4 select-none whitespace-nowrap";
  const style = { color: muted ? "rgba(215,226,234,0.35)" : "#D7E2EA" };

  const inner = (() => {
    switch (brand.font) {
      case "serif-caps":
        return (
          <span
            className="font-editorial uppercase tracking-[0.15em]"
            style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, ...style }}
          >
            {brand.name}
          </span>
        );
      case "serif-italic":
        return (
          <span className="font-editorial-italic flex items-center gap-2" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 500, ...style }}>
            <span
              aria-hidden
              className="inline-block w-3 h-3 rotate-45"
              style={{
                background: "linear-gradient(135deg, #3C7A31, #7BB84A)",
                borderRadius: "0 100% 0 100%",
              }}
            />
            {brand.name}
          </span>
        );
      case "sans-red":
        return (
          <span
            className="font-mono-display tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 700, ...style }}
          >
            L<span style={{ color: muted ? "rgba(225,20,10,0.4)" : "#E1140A" }}>e</span>novo
          </span>
        );
      case "sans-bold":
        return (
          <span
            className="font-mono-display uppercase tracking-tight flex items-center gap-1"
            style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 800, ...style }}
          >
            {brand.name}
            <span
              aria-hidden
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: muted ? "rgba(103,182,55,0.4)" : "#67B637" }}
            />
          </span>
        );
      case "sans-italic":
        return (
          <span
            className="font-editorial-italic tracking-tight"
            style={{ fontSize: "clamp(1.35rem, 2.2vw, 2rem)", fontWeight: 700, ...style }}
          >
            {brand.name}
          </span>
        );
      case "mono":
      default:
        return (
          <span
            className="font-mono-display uppercase tracking-[0.24em]"
            style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", fontWeight: 600, ...style }}
          >
            {brand.name}
          </span>
        );
    }
  })();

  return <div className={base}>{inner}</div>;
}
