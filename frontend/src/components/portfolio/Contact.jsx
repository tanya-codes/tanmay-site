import React, { useRef, useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { Instagram, Mail, Phone, MapPin, Send, Check, X } from "lucide-react";
import MagneticButton from "./MagneticButton";
import FadeIn from "./FadeIn";
import { WHATSAPP_URL, TEST_IDS } from "../../constants";
import { API, trackEvent } from "../../lib/track";

export default function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Name, phone and message are required.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await axios.post(`${API}/contact`, form);
      setStatus("success");
      trackEvent("contact_submit", { has_brand: !!form.brand });
      setForm({ name: "", brand: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.detail || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-[#051A24] rounded-t-[50px] md:rounded-t-[60px] py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(118,33,176,0.15) 0%, transparent 60%), radial-gradient(50% 50% at 10% 90%, rgba(190,76,0,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <motion.h2
          style={{ y: headingY }}
          className="hero-heading font-black uppercase tracking-tight leading-none text-center"
        >
          <span
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", display: "block" }}
          >
            Let&apos;s Talk
          </span>
        </motion.h2>

        <FadeIn delay={0.15} className="mt-10 md:mt-14 flex justify-center">
          <MagneticButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="accent"
            data-testid={TEST_IDS.contactWhatsapp}
            onClick={() => trackEvent("whatsapp_click", { source: "contact" })}
          >
            Message on WhatsApp <span aria-hidden>→</span>
          </MagneticButton>
        </FadeIn>

        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-16">
          <FadeIn className="lg:col-span-2 space-y-6 text-[#D7E2EA]">
            <InfoRow
              icon={<Instagram size={18} />}
              href="https://instagram.com/tanmayvisuals.in"
            >
              instagram.com/tanmayvisuals.in
            </InfoRow>
            <InfoRow icon={<Mail size={18} />} href="mailto:work.tanmay.in@gmail.com">
              work.tanmay.in@gmail.com
            </InfoRow>
            <InfoRow icon={<Phone size={18} />} href="tel:+919266553033">
              +91 9266553033
            </InfoRow>
            <InfoRow icon={<MapPin size={18} />}>
              Based in Delhi NCR. Working with brands across India.
            </InfoRow>

            <p className="pt-6 text-sm text-[#D7E2EA]/60 max-w-md">
              I work with 2–3 brands at a time. Strategy first. Shoot second.
              Everything else follows.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-3">
            <form onSubmit={submit} className="space-y-5">
              <Field
                label="Your name"
                required
                testId={TEST_IDS.contactName}
                value={form.name}
                onChange={onChange("name")}
              />
              <Field
                label="Brand or business (optional)"
                testId={TEST_IDS.contactBrand}
                value={form.brand}
                onChange={onChange("brand")}
              />
              <Field
                label="Phone / WhatsApp"
                required
                testId={TEST_IDS.contactPhone}
                value={form.phone}
                onChange={onChange("phone")}
              />
              <Field
                label="What are you looking to build?"
                textarea
                required
                testId={TEST_IDS.contactMessage}
                value={form.message}
                onChange={onChange("message")}
              />

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  data-testid={TEST_IDS.contactSubmit}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F6FCFF] text-[#051A24] px-6 py-3 text-sm font-medium tracking-wide hover:bg-white transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send message <Send size={16} />
                    </>
                  )}
                </button>

                {status === "success" && (
                  <span
                    data-testid={TEST_IDS.contactSuccess}
                    className="inline-flex items-center gap-2 text-emerald-400 text-sm"
                  >
                    <Check size={16} /> Sent — I&apos;ll be in touch soon.
                  </span>
                )}
                {status === "error" && (
                  <span
                    data-testid={TEST_IDS.contactError}
                    className="inline-flex items-center gap-2 text-red-400 text-sm"
                  >
                    <X size={16} /> {errorMsg}
                  </span>
                )}
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, href, children }) {
  const inner = (
    <span className="inline-flex items-center gap-3">
      <span className="text-[#D7E2EA]/60">{icon}</span>
      <span>{children}</span>
    </span>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block hover:text-white transition-colors"
    >
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function Field({ label, required, textarea, testId, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-[#D7E2EA]/60 mb-2 font-mono">
        {label} {required && <span className="text-[#B600A8]">*</span>}
      </span>
      {textarea ? (
        <textarea
          data-testid={testId}
          value={value}
          onChange={onChange}
          rows={5}
          className="w-full rounded-xl border border-[rgba(215,226,234,0.2)] bg-transparent text-[#D7E2EA] px-4 py-3 outline-none focus:border-[rgba(215,226,234,0.5)] transition-colors resize-y"
        />
      ) : (
        <input
          data-testid={testId}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-[rgba(215,226,234,0.2)] bg-transparent text-[#D7E2EA] px-4 py-3 outline-none focus:border-[rgba(215,226,234,0.5)] transition-colors"
        />
      )}
    </label>
  );
}
