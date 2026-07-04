import React from "react";
import MagneticButton from "./MagneticButton";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

export default function BottomNav() {
  return (
    <div
      className="fixed left-1/2 bottom-6 z-50 animate-pulse-soft"
      style={{ transform: "translateX(-50%)" }}
    >
      <div className="flex items-center gap-3 bg-white rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.35)] pl-4 pr-1 py-1">
        <span className="font-serif-accent text-xl text-[#051A24]">T</span>
        <MagneticButton
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          className="!py-2 !px-4 text-xs md:text-sm"
          data-testid={TEST_IDS.bottomNavCta}
          onClick={() => trackEvent("whatsapp_click", { source: "bottom_nav" })}
        >
          Let&apos;s Talk <span aria-hidden>→</span>
        </MagneticButton>
      </div>
    </div>
  );
}
