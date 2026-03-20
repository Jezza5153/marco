"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Download,
  LogIn,
  Users,
  UserCheck,
  UserX,
  Lock,
  FileText,
} from "lucide-react";

type RsvpEntry = {
  id: number;
  name: string;
  attending: boolean;
  guests_count: number;
  message: string | null;
  created_at: string;
};

type Stats = {
  totalResponses: number;
  totalGuests: number;
  totalAttending: number;
  totalDeclined: number;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalResponses: 0,
    totalGuests: 0,
    totalAttending: 0,
    totalDeclined: 0,
  });
  const [storedPassword, setStoredPassword] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin", {
        headers: { "x-admin-password": storedPassword },
      });
      if (!res.ok) return;
      const data = await res.json();
      setEntries(data.entries);
      setStats(data.stats);
    } catch {
      // silent
    }
  }, [storedPassword]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setStoredPassword(password);
        setAuthenticated(true);
      } else {
        setError("Verkeerd wachtwoord");
      }
    } catch {
      setError("Er ging iets mis");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Weet je zeker dat je deze reactie wilt verwijderen?")) return;

    try {
      await fetch(`/api/admin?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": storedPassword },
      });
      fetchData();
    } catch {
      alert("Verwijderen mislukt");
    }
  }

  function exportPDF() {
    const rows = entries
      .map(
        (e) =>
          `<tr>
            <td>${e.name}</td>
            <td>${e.attending ? "✓ Komt" : "✗ Niet"}</td>
            <td>${e.attending ? e.guests_count : "—"}</td>
            <td>${e.message || "—"}</td>
            <td>${new Date(e.created_at).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
          </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html><head><title>RSVP Export</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; }
  h1 { font-size: 20px; margin-bottom: 8px; }
  .stats { font-size: 13px; color: #555; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #0f172a; color: #fff; text-align: left; padding: 8px 10px; }
  td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) { background: #f9fafb; }
  @media print { body { padding: 0; } }
</style></head><body>
<h1>RSVP Overzicht — Verrassingsfeest Marco</h1>
<div class="stats">
  Totaal reacties: ${stats.totalResponses} &nbsp;|&nbsp; Gasten komen: ${stats.totalGuests} &nbsp;|&nbsp; Afmeldingen: ${stats.totalDeclined}<br/>
  Geëxporteerd: ${new Date().toLocaleString("nl-NL")}
</div>
<table><thead><tr><th>Naam</th><th>Status</th><th>Personen</th><th>Bericht</th><th>Datum</th></tr></thead>
<tbody>${rows}</tbody></table>
<script>window.onload=function(){window.print();}</script>
</body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-navy)] px-4">
        <div className="w-full max-w-sm bg-[var(--color-navy-light)]/60 backdrop-blur-sm rounded-2xl p-8 card-glow">
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 text-[var(--color-gold)] mx-auto mb-3" />
            <h1 className="text-xl font-bold text-[var(--color-cream)]">
              Admin
            </h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[var(--color-navy)]/60 border-[var(--color-gold)]/20 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-gold)] text-[var(--color-navy)] font-semibold cursor-pointer"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Inloggen
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[var(--color-navy)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gold-text">Admin — RSVP&apos;s</h1>
          <Button
            onClick={exportPDF}
            variant="outline"
            size="sm"
            className="border-[var(--color-gold)]/20 text-[var(--color-cream)]/70 hover:bg-[var(--color-gold)]/10 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--color-navy-light)]/60 rounded-xl p-4 card-glow text-center">
            <UserCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-[var(--color-cream)]">
              {stats.totalGuests}
            </p>
            <p className="text-xs text-[var(--color-cream)]/50">
              gasten komen
            </p>
          </div>
          <div className="bg-[var(--color-navy-light)]/60 rounded-xl p-4 card-glow text-center">
            <Users className="w-5 h-5 text-[var(--color-gold)] mx-auto mb-1" />
            <p className="text-2xl font-bold text-[var(--color-cream)]">
              {stats.totalResponses}
            </p>
            <p className="text-xs text-[var(--color-cream)]/50">
              totaal reacties
            </p>
          </div>
          <div className="bg-[var(--color-navy-light)]/60 rounded-xl p-4 card-glow text-center">
            <UserX className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-[var(--color-cream)]">
              {stats.totalDeclined}
            </p>
            <p className="text-xs text-[var(--color-cream)]/50">
              afmeldingen
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--color-navy-light)]/60 rounded-2xl card-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-gold)]/10">
                  <th className="text-left py-3 px-4 text-[var(--color-cream)]/50 font-medium">
                    Naam
                  </th>
                  <th className="text-left py-3 px-4 text-[var(--color-cream)]/50 font-medium">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-[var(--color-cream)]/50 font-medium">
                    Personen
                  </th>
                  <th className="text-left py-3 px-4 text-[var(--color-cream)]/50 font-medium">
                    Bericht
                  </th>
                  <th className="text-left py-3 px-4 text-[var(--color-cream)]/50 font-medium">
                    Datum
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[var(--color-cream)]/5 hover:bg-[var(--color-cream)]/3"
                  >
                    <td className="py-3 px-4 text-[var(--color-cream)]">
                      {entry.name}
                    </td>
                    <td className="py-3 px-4">
                      {entry.attending ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          ✓ Komt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[var(--color-cream)]/40 text-xs font-medium bg-[var(--color-cream)]/5 px-2 py-0.5 rounded-full">
                          ✗ Niet
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-cream)]/70">
                      {entry.attending ? entry.guests_count : "—"}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-cream)]/50 max-w-[200px] truncate">
                      {entry.message || "—"}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-cream)]/40 whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-[var(--color-cream)]/30"
                    >
                      Nog geen reacties
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
