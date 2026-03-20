"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserCheck, UserX, PartyPopper } from "lucide-react";
import type { RsvpEntry } from "@/lib/db";

type Stats = {
  totalResponses: number;
  totalGuests: number;
  totalAttending: number;
  totalDeclined: number;
};

type LiveStatsProps = {
  refreshTrigger?: number;
};

function getFirstName(fullName: string): string {
  return fullName.split(" ")[0];
}

export function LiveStats({ refreshTrigger }: LiveStatsProps) {
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalResponses: 0,
    totalGuests: 0,
    totalAttending: 0,
    totalDeclined: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp");
      if (!res.ok) return;
      const data = await res.json();
      setEntries(data.entries);
      setStats(data.stats);
    } catch {
      // silently fail on poll errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Poll every 12 seconds 
  useEffect(() => {
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-6 h-6 border-2 border-[var(--color-gold)]/30 border-t-[var(--color-gold)] rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Section title */}
        <div className="text-center animate-fade-in-up">
          <h2 className="text-2xl font-bold gold-text">Wie komen er?</h2>
          <p className="text-sm text-[var(--color-cream)]/50 mt-1.5">
            Live bijgewerkt
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up animation-delay-100">
          <div className="bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-xl p-4 card-glow text-center">
            <UserCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-[var(--color-cream)]">
              {stats.totalGuests}
            </p>
            <p className="text-xs text-[var(--color-cream)]/50 mt-0.5">
              gasten
            </p>
          </div>
          <div className="bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-xl p-4 card-glow text-center">
            <Users className="w-5 h-5 text-[var(--color-gold)] mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-[var(--color-cream)]">
              {stats.totalResponses}
            </p>
            <p className="text-xs text-[var(--color-cream)]/50 mt-0.5">
              reacties
            </p>
          </div>
          <div className="bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-xl p-4 card-glow text-center">
            <UserX className="w-5 h-5 text-[var(--color-cream)]/40 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-[var(--color-cream)]">
              {stats.totalDeclined}
            </p>
            <p className="text-xs text-[var(--color-cream)]/50 mt-0.5">
              helaas niet
            </p>
          </div>
        </div>

        {/* Guest list */}
        {entries.length > 0 && (
          <div className="bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 card-glow animate-fade-in-up animation-delay-200">
            <div className="flex items-center gap-2 mb-4">
              <PartyPopper className="w-4 h-4 text-[var(--color-gold)]" />
              <h3 className="text-sm font-semibold text-[var(--color-cream)]/80">
                Reacties
              </h3>
            </div>
            <div className="space-y-2.5">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 text-sm py-1.5"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      entry.attending ? "bg-emerald-400" : "bg-[var(--color-cream)]/20"
                    }`}
                  />
                  <span className="text-[var(--color-cream)]/90">
                    {entry.attending ? (
                      <>
                        <strong>{getFirstName(entry.name)}</strong> komt
                        {entry.guests_count > 1 && (
                          <span className="text-[var(--color-cream)]/50">
                            {" "}
                            met {entry.guests_count}{" "}
                            {entry.guests_count === 1 ? "persoon" : "personen"}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <strong>{getFirstName(entry.name)}</strong>
                        <span className="text-[var(--color-cream)]/50">
                          {" "}
                          kan helaas niet
                        </span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <p className="text-center text-sm text-[var(--color-cream)]/40 animate-fade-in">
            Nog geen reacties — wees de eerste! 🎊
          </p>
        )}
      </div>
    </section>
  );
}
