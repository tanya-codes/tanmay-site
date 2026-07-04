import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { NAV_LINKS, WHATSAPP_URL, TEST_IDS } from "../../constants";
import { trackEvent } from "../../lib/track";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(12,12,12,0)", "rgba(12,12,12,0.85)"]
  );
  const border = useTransform(
    scrollY,
    [0, 120],
    ["rgba(215,226,234,0)", "rgba(215,226,234,0.08)"]
  );
  const blur = useTransform(scrollY, [0, 120], ["blur(0px)", "blur(12px)"]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        style={{
          background: bg,
          borderBottom: "1px solid",
          borderColor: border,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
        }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 md:px-10 h-16 md:h-20">
          <a
            href="#top"
            data-testid="nav-brand"
            className="font-serif-accent text-xl md:text-2xl tracking-tight text-[#D7E2EA]"
          >
            Tanmay Visuals
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-${l.label.toLowerCase()}`}
                className="text-[#D7E2EA] text-xs uppercase tracking-[0.18em] hover:opacity-70 transition-opacity"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              data-testid={TEST_IDS.navLetTalk}
              onClick={() => trackEvent("whatsapp_click", { source: "nav" })}
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </MagneticButton>
          </div>

          <button
            className="md:hidden p-2 text-[#D7E2EA]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            data-testid={TEST_IDS.navMobileToggle}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#0C0C0C] pt-24 px-6 md:hidden"
            data-testid={TEST_IDS.navMobileMenu}
          >
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  data-testid={`nav-${l.label.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="hero-heading text-4xl font-black uppercase tracking-tight"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="pt-6">
                <MagneticButton
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  onClick={() => {
                    setOpen(false);
                    trackEvent("whatsapp_click", { source: "nav_mobile" });
                  }}
                >
                  Let&apos;s Talk <span aria-hidden>→</span>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
