# 🎉 Verrassingsfeest RSVP — Marco Jonk

A beautiful, mobile-first RSVP invitation page for Marco's surprise birthday party.

## Quick Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database table

Go to your [Neon dashboard](https://console.neon.tech) → SQL Editor → paste and run:

```sql
CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Set environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` — Your Neon connection string (with `?sslmode=require`)
- `ADMIN_PASSWORD` — Any password you choose for `/admin`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel
```

Add the same env vars in your Vercel project settings.

## Features

- 🎨 Festive dark theme with gold accents
- 📱 Mobile-first responsive design
- 📝 Simple RSVP form with validation
- 📊 Live guest count + guest list (auto-updates)
- 🔐 Admin dashboard at `/admin` with password protection
- 📤 CSV export of all responses
- 📲 WhatsApp share + copy link buttons
- 🎯 Sticky RSVP button on mobile

## Hero Photo

Replace `public/hero.jpg` with a real photo of Marco. Recommended: square crop, at least 400×400px.
