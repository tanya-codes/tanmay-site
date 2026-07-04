import React, { useEffect, useRef, useState } from "react";
import { CREDENTIAL_TILES } from "../../constants";

export default function CredentialMarquee() {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const offset = (window.innerHeight - rect.top) * 0.3;
        if (row1Ref.current)
          row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
        if (row2Ref.current)
          row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      });
    };

    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const tiles = [...CREDENTIAL_TILES, ...CREDENTIAL_TILES, ...CREDENTIAL_TILES];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0C0C0C] pt-24 pb-16 overflow-hidden"
    >
      <p className="text-center text-[10px] md:text-xs font-mono uppercase tracking-[0.28em] text-[#273C46] mb-8">
        Worked on production campaigns for
      </p>

      <div className="space-y-4">
        <div
          ref={row1Ref}
          className="flex gap-4 md:gap-6 will-change-transform"
          style={{ transform: "translateX(0)" }}
        >
          {tiles.map((t, i) => (
            <Tile key={`r1-${i}`} label={t} />
          ))}
        </div>
        <div
          ref={row2Ref}
          className="flex gap-4 md:gap-6 will-change-transform"
          style={{ transform: "translateX(0)" }}
        >
          {tiles.map((t, i) => (
            <Tile key={`r2-${i}`} label={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ label }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center text-center"
      style={{
        width: 260,
        height: 130,
        border: "1px solid rgba(215,226,234,0.10)",
        background: "rgba(215,226,234,0.03)",
        borderRadius: 20,
      }}
    >
      <span className="text-[#D7E2EA] uppercase tracking-[0.18em] font-medium text-xs md:text-sm px-4">
        {label}
      </span>
    </div>
  );
}
