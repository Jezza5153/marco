"use client";

import { CalendarDays, Clock, MapPin, ShieldAlert } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative sparkle-bg px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-xl mx-auto text-center space-y-8">
        {/* Title */}
        <div className="animate-fade-in-up space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text leading-tight">
            🎉 Verrassingsfeest voor Marco Jonk 🎉
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-cream)]/80">
            We organiseren een verrassingsfeest en jij bent uitgenodigd!
          </p>
        </div>

        {/* Photo */}
        <div className="animate-fade-in-up animation-delay-200 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-[var(--color-gold)]/40 to-[var(--color-gold-dark)]/20 rounded-2xl blur-sm" />
            <video
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="relative w-64 h-auto sm:w-80 object-cover rounded-2xl shadow-2xl ring-2 ring-[var(--color-gold)]/30"
            />
          </div>
        </div>

        {/* Party details */}
        <div className="animate-fade-in-up animation-delay-300 space-y-4">
          <div className="inline-flex flex-col gap-3 text-left bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-xl p-5 sm:p-6 card-glow">
            <div className="flex items-center gap-3 text-[var(--color-cream)]">
              <CalendarDays className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>Datum:</strong> Vrijdag 17 april
              </span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-cream)]">
              <Clock className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>Tijd:</strong> vanaf 20:00 uur
              </span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-cream)]">
              <MapPin className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>Adres:</strong> Jacobus Boumanlaan 55, Leusden
              </span>
            </div>
          </div>
        </div>

        {/* Surprise warning */}
        <div className="animate-fade-in-up animation-delay-400">
          <div className="inline-flex items-center gap-2.5 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 px-5 py-3 rounded-full">
            <ShieldAlert className="w-5 h-5 text-[var(--color-gold)]" />
            <span className="text-sm sm:text-base font-medium text-[var(--color-gold-light)]">
              Dit is een surprise party — mondje dicht! 🤫
            </span>
          </div>
        </div>

        {/* RSVP deadline */}
        <p className="animate-fade-in-up animation-delay-500 text-sm sm:text-base text-[var(--color-cream)]/60">
          Laat vóór <strong className="text-[var(--color-gold)]">12 april</strong> weten of je erbij bent.
        </p>
      </div>
    </section>
  );
}
