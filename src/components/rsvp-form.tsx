"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, PartyPopper, Heart } from "lucide-react";

type RsvpFormProps = {
  onSuccess?: () => void;
};

export function RsvpForm({ onSuccess }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<boolean | null>(null); // true = attending, false = not

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Vul je naam in";
    if (attending === null) newErrors.attending = "Geef aan of je komt";
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
      onSuccess?.();
    } catch {
      setErrors({ form: "Er ging iets mis. Probeer het opnieuw." });
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (submitted !== null) {
    return (
      <section id="rsvp" className="px-4 py-12 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-2xl p-8 card-glow text-center space-y-4 animate-fade-in-up">
            {submitted ? (
              <>
                <PartyPopper className="w-12 h-12 text-[var(--color-gold)] mx-auto animate-float" />
                <h3 className="text-xl font-bold text-[var(--color-cream)]">
                  Top, je staat op de lijst!
                </h3>
                <p className="text-[var(--color-cream)]/70">
                  We zien je op 17 april 🎉
                </p>
              </>
            ) : (
              <>
                <Heart className="w-12 h-12 text-[var(--color-gold)] mx-auto" />
                <h3 className="text-xl font-bold text-[var(--color-cream)]">
                  Dankjewel voor je reactie
                </h3>
                <p className="text-[var(--color-cream)]/70">
                  Jammer dat je er niet bij kunt zijn 💛
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-4 py-12 sm:py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 card-glow animate-fade-in-up">
          <h2 className="text-2xl font-bold gold-text text-center mb-6">
            RSVP
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[var(--color-cream)]/90 text-sm font-medium"
              >
                Naam *
              </Label>
              <Input
                id="name"
                placeholder="Je volledige naam"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
                className="bg-[var(--color-navy)]/60 border-[var(--color-gold)]/20 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:border-[var(--color-gold)]/50 focus:ring-[var(--color-gold)]/20"
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Attending */}
            <div className="space-y-2">
              <Label className="text-[var(--color-cream)]/90 text-sm font-medium">
                Kom je? *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAttending(true);
                    if (errors.attending)
                      setErrors((p) => ({ ...p, attending: "" }));
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    attending === true
                      ? "bg-[var(--color-gold)] text-[var(--color-navy)] shadow-lg shadow-[var(--color-gold)]/20"
                      : "bg-[var(--color-navy)]/60 text-[var(--color-cream)]/70 border border-[var(--color-gold)]/20 hover:border-[var(--color-gold)]/40"
                  }`}
                >
                  🎉 Ik kom!
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttending(false);
                    if (errors.attending)
                      setErrors((p) => ({ ...p, attending: "" }));
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    attending === false
                      ? "bg-[var(--color-cream)]/10 text-[var(--color-cream)] ring-1 ring-[var(--color-cream)]/30"
                      : "bg-[var(--color-navy)]/60 text-[var(--color-cream)]/70 border border-[var(--color-gold)]/20 hover:border-[var(--color-gold)]/40"
                  }`}
                >
                  😔 Nee, sorry
                </button>
              </div>
              {errors.attending && (
                <p className="text-sm text-red-400">{errors.attending}</p>
              )}
            </div>

            {/* Guests count - only if attending */}
            {attending === true && (
              <div className="space-y-2 animate-fade-in">
                <Label
                  htmlFor="guests"
                  className="text-[var(--color-cream)]/90 text-sm font-medium"
                >
                  Met hoeveel personen kom je?
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={10}
                  value={guestsCount}
                  onChange={(e) =>
                    setGuestsCount(Math.max(1, Number(e.target.value)))
                  }
                  className="bg-[var(--color-navy)]/60 border-[var(--color-gold)]/20 text-[var(--color-cream)] focus:border-[var(--color-gold)]/50 focus:ring-[var(--color-gold)]/20 w-24"
                />
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-[var(--color-cream)]/90 text-sm font-medium"
              >
                Berichtje{" "}
                <span className="text-[var(--color-cream)]/40">(optioneel)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Leuk om even iets te zeggen..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="bg-[var(--color-navy)]/60 border-[var(--color-gold)]/20 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:border-[var(--color-gold)]/50 focus:ring-[var(--color-gold)]/20 resize-none"
              />
            </div>

            {/* Error */}
            {errors.form && (
              <p className="text-sm text-red-400 text-center">{errors.form}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-6 text-base font-semibold rounded-xl cursor-pointer transition-all duration-200 bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-gold)] text-[var(--color-navy)] hover:from-[var(--color-gold)] hover:to-[var(--color-gold-light)] shadow-lg shadow-[var(--color-gold)]/20 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[var(--color-navy)]/30 border-t-[var(--color-navy)] rounded-full animate-spin" />
                  Even geduld...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {attending === false
                    ? "Laat het weten"
                    : "Bevestig aanwezigheid"}
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
