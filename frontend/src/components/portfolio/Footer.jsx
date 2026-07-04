import React from "react";
import { NAV_LINKS } from "../../constants";

export default function Footer() {
  return (
    <footer className="bg-[#0C0C0C] pt-16 pb-10 border-t border-[#D7E2EA]/8">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-[#D7E2EA]/50 text-xs md:text-sm tracking-wide">
          © 2026 · Tanmay Visuals · Delhi NCR.
        </p>
        <nav className="flex flex-wrap items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[#D7E2EA]/60 text-xs uppercase tracking-[0.24em] hover:text-[#D7E2EA] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
