"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  PartyPopper,
  Heart,
  CalendarDays,
  MapPin,
  Clock,
  ShieldAlert,
  Share2,
  Copy,
  Check,
  UserCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { RsvpEntry } from "@/lib/db";

type Stats = {
  totalResponses: number;
  totalGuests: number;
  totalAttending: number;
  totalDeclined: number;
};

export default function Home() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<boolean | null>(null);

  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setEntries(data.entries ?? []);
      setStats(data.stats ?? null);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, [fetchData]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Vul je naam in";
    if (attending === null) newErrors.attending = "Laat weten of je komt";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guests_count: attending ? guestsCount : 0,
          message: message.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error || "Er ging iets mis" });
        return;
      }

      setSubmitted(attending);
      setName("");
      setGuestsCount(1);
      setMessage("");
      setErrors({});
      fetchData();
    } catch {
      setErrors({ form: "Er ging iets mis. Probeer het opnieuw." });
    } finally {
      setSubmitting(false);
    }
  }

  function handleWhatsApp() {
    const url = "https://www.marcojonk.nl";
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Je bent uitgenodigd voor Marco zijn verrassingsfeest 🎉 Bekijk de uitnodiging en RSVP hier: ${url}`
      )}`,
      "_blank"
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function getFirstName(fullName: string): string {
    return fullName.trim().split(" ")[0];
  }

  const hasResponses = !!stats && stats.totalResponses > 0;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.08),_transparent_35%),linear-gradient(180deg,#0b1220_0%,#10182b_55%,#0b1220_100%)] text-white">
      {/* Ambient festive glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
        <div className="absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-amber-300/5 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-yellow-200/5 blur-3xl" />

        <div className="absolute left-[10%] top-[12%] animate-pulse text-[var(--color-gold)]/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="absolute right-[14%] top-[18%] animate-pulse text-[var(--color-gold)]/15 [animation-delay:0.6s]">
          <Sparkles className="h-3 w-3" />
        </div>
        <div className="absolute left-[16%] bottom-[20%] animate-pulse text-[var(--color-gold)]/15 [animation-delay:1.2s]">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div className="grid w-full gap-3 md:grid-cols-[1.02fr_0.98fr] lg:gap-4">
          {/* LEFT SIDE */}
          <section className="flex h-full flex-col justify-center rounded-[28px] border border-white/8 bg-white/[0.04] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-4 lg:p-5">
            <div className="mb-3 flex items-center justify-center gap-2 text-[var(--color-gold)]/90">
              <PartyPopper className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                Surprise Invite
              </span>
              <PartyPopper className="h-4 w-4" />
            </div>

            <div className="grid items-center gap-3 sm:gap-4">
              {/* Hero media */}
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
                <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-br from-[var(--color-gold)]/35 via-[var(--color-gold)]/10 to-transparent blur-md" />
                <video
                  src="/hero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative aspect-[4/4.2] w-full rounded-[24px] border border-[var(--color-gold)]/18 object-cover shadow-2xl"
                />
                <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-md">
                  <p className="text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
                    Keep it secret 🤫
                  </p>
                </div>
              </div>

              {/* Copy */}
              <div className="space-y-2 text-center">
                <h1 className="text-[1.55rem] font-bold leading-tight text-white sm:text-[1.9rem] lg:text-[2.1rem]">
                  🎉 Verrassingsfeest voor{" "}
                  <span className="bg-gradient-to-r from-[var(--color-gold-light)] to-[var(--color-gold)] bg-clip-text text-transparent">
                    Marco Jonk
                  </span>{" "}
                  🎉
                </h1>

                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/72 sm:text-[15px]">
                  We organiseren een verrassingsfeest en jij bent uitgenodigd.
                  Laat even weten of je erbij bent.
                </p>
              </div>

              {/* Event info */}
              <div className="rounded-[24px] border border-[var(--color-gold)]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2.5">
                  <div className="rounded-2xl border border-white/8 bg-black/15 px-3 py-3 text-center">
                    <CalendarDays className="mx-auto mb-1.5 h-4 w-4 text-[var(--color-gold)]" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                      Datum
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Vrijdag 17 april
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/15 px-3 py-3 text-center">
                    <Clock className="mx-auto mb-1.5 h-4 w-4 text-[var(--color-gold)]" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                      Tijd
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Vanaf 20:00
                    </p>
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Jacobus+Boumanlaan+12+1461AA+Leusden"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/8 bg-black/15 px-3 py-3 text-center transition-colors hover:bg-white/8 active:scale-[0.98]"
                  >
                    <MapPin className="mx-auto mb-1.5 h-4 w-4 text-[var(--color-gold)]" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                      Locatie
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Jacobus Boumanlaan 12
                    </p>
                    <p className="text-xs text-white/50">1461AA Leusden</p>
                  </a>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/16 bg-[var(--color-gold)]/10 px-3 py-2">
                    <ShieldAlert className="h-4 w-4 text-[var(--color-gold)]" />
                    <span className="text-xs font-medium text-[var(--color-gold-light)]">
                      Surprise party, mondje dicht
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    <Clock className="h-3.5 w-3.5 text-white/60" />
                    <span className="text-xs text-white/70">
                      RSVP vóór 12 april
                    </span>
                  </div>
                </div>


              </div>

              {/* Stats */}
              {hasResponses && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-3 text-center">
                    <p className="text-xl font-bold text-white">
                      {stats.totalGuests}
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                      Gasten
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3 text-center">
                    <p className="text-xl font-bold text-white">
                      {stats.totalResponses}
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                      Reacties
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3 text-center">
                    <p className="text-xl font-bold text-white">
                      {stats.totalDeclined}
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                      Afmeldingen
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="flex h-full flex-col rounded-[28px] border border-white/8 bg-white/[0.04] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-4 lg:p-5">
            {submitted !== null ? (
              <div className="flex h-full flex-col items-center justify-center rounded-[24px] border border-[var(--color-gold)]/12 bg-black/15 px-5 py-8 text-center">
                {submitted ? (
                  <>
                    <div className="mb-4 rounded-full bg-[var(--color-gold)]/12 p-4">
                      <PartyPopper className="h-10 w-10 text-[var(--color-gold)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Top, je staat op de lijst!
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
                      We zien je op 17 april 🎉
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 rounded-full bg-white/8 p-4">
                      <Heart className="h-10 w-10 text-[var(--color-gold)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Dankjewel voor je reactie
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
                      Jammer dat je er niet bij kunt zijn 💛
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col gap-3">
                {/* RSVP card */}
                <div className="rounded-[24px] border border-[var(--color-gold)]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-[var(--color-gold)]/12 p-2">
                      <Send className="h-4 w-4 text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Laat weten of je komt
                      </h2>
                      <p className="text-xs text-white/45">
                        Duurt minder dan 15 seconden
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <Input
                        id="name"
                        placeholder="Je naam"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: "" }));
                          }
                        }}
                        className="h-12 rounded-xl border-[var(--color-gold)]/18 bg-black/20 text-white placeholder:text-white/28 focus-visible:ring-[var(--color-gold)]/25"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAttending(true);
                            if (errors.attending) {
                              setErrors((prev) => ({
                                ...prev,
                                attending: "",
                              }));
                            }
                          }}
                          className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            attending === true
                              ? "scale-[1.02] bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-gold)] text-[var(--color-navy)] shadow-[0_10px_30px_rgba(212,175,55,0.22)]"
                              : "border border-white/10 bg-black/20 text-white/72 hover:border-[var(--color-gold)]/28 hover:text-white"
                          }`}
                        >
                          🎉 Ik kom
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAttending(false);
                            if (errors.attending) {
                              setErrors((prev) => ({
                                ...prev,
                                attending: "",
                              }));
                            }
                          }}
                          className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            attending === false
                              ? "scale-[1.02] border border-white/20 bg-white/12 text-white shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                              : "border border-white/10 bg-black/20 text-white/72 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          😔 Nee, sorry
                        </button>
                      </div>

                      {errors.attending && (
                        <p className="text-xs text-red-400">
                          {errors.attending}
                        </p>
                      )}
                    </div>

                    {attending === true && (
                      <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-[var(--color-gold)]/12 bg-black/15 px-3 py-2.5">
                        <div className="flex items-center gap-2 text-sm text-white/72">
                          <Users className="h-4 w-4 text-[var(--color-gold)]" />
                          <span>Met hoeveel personen?</span>
                        </div>

                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={guestsCount}
                          onChange={(e) =>
                            setGuestsCount(
                              Math.min(10, Math.max(1, Number(e.target.value)))
                            )
                          }
                          className="h-10 w-20 rounded-lg border-[var(--color-gold)]/18 bg-black/25 text-center text-white"
                        />
                      </div>
                    )}

                    <Textarea
                      placeholder="Berichtje (optioneel)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="min-h-[88px] resize-none rounded-xl border-[var(--color-gold)]/18 bg-black/20 text-white placeholder:text-white/28 focus-visible:ring-[var(--color-gold)]/25"
                    />

                    {errors.form && (
                      <p className="text-center text-xs text-red-400">
                        {errors.form}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-xl bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-gold)] text-sm font-bold text-[var(--color-navy)] shadow-[0_14px_40px_rgba(212,175,55,0.22)] transition-all duration-200 hover:scale-[1.01] hover:from-[var(--color-gold)] hover:to-[var(--color-gold-light)] disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-navy)]/25 border-t-[var(--color-navy)]" />
                          Even geduld...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {attending === false
                            ? "Laat het weten"
                            : "Bevestig aanwezigheid"}
                        </span>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Guest list */}
                {hasResponses && (
                  <div className="min-h-0 flex-1 rounded-[24px] border border-white/8 bg-black/15 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-[var(--color-gold)]" />
                      <h3 className="text-sm font-semibold text-white/82">
                        Live reacties
                      </h3>
                    </div>

                    <div className="max-h-[180px] space-y-1.5 overflow-auto pr-1 sm:max-h-[220px]">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-2 rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2"
                        >
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              entry.attending
                                ? "bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                                : "bg-white/20"
                            }`}
                          />
                          <div className="min-w-0 text-sm text-white/80">
                            {entry.attending ? (
                              <>
                                <strong className="text-white">
                                  {getFirstName(entry.name)}
                                </strong>{" "}
                                komt
                                {entry.guests_count > 1 && (
                                  <span className="text-white/50">
                                    {" "}
                                    met {entry.guests_count} personen
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                <strong className="text-white">
                                  {getFirstName(entry.name)}
                                </strong>{" "}
                                <span className="text-white/50">
                                  kan helaas niet
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#25D366]/18 bg-[#25D366]/10 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/18"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/72 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400">Gekopieerd</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Kopieer link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}