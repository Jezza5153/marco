"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function StickyRsvpButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past ~500px (past the hero)
      setVisible(window.scrollY > 500);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToRsvp() {
    const el = document.getElementById("rsvp");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToRsvp}
      className="fixed bottom-6 right-6 z-50 sm:hidden flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-gold)] text-[var(--color-navy)] font-semibold text-sm rounded-full shadow-xl shadow-[var(--color-gold)]/25 animate-fade-in cursor-pointer active:scale-95 transition-transform"
    >
      <ChevronUp className="w-4 h-4" />
      RSVP
    </button>
  );
}
