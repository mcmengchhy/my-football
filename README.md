# PitchPulse — Football Niche Site, Tactical Analysis & Live 2D Match Center

A modern football content & live telemetry web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, implementing the complete blueprint in `football_niche_site_plan.txt`.

## Key Features Implemented

1. **Primary API Integration (`football-data.org` v4) + Multi-Hour Caching**
   - Configured with `NEXT_PUBLIC_DEFAULT_PROVIDER=football-data` and `FOOTBALL_DATA_API_KEY` in `.env.local`.
   - **Heavy Server-Side Caching**: Fixtures (`/api/matches`) are cached for **3 hours** and League Standings (`/api/standings`) for **6 hours** in memory + Next.js Data Cache (`revalidate`), protecting the `10 requests/minute` rate limit and ensuring the API is never called on every page load.
   - **Smart Matchweek Window**: Automatically expands to a 7-day matchweek window if a single date has no scheduled matches, and renders official club crests (`crests.football-data.org`) with SVG shield fallbacks.

2. **Top 5 European Leagues + UEFA Champions League**
   - Full competition filtering and live standings/form tables for **Premier League (`PL`)**, **LaLiga (`PD`)**, **Serie A (`SA`)**, **Bundesliga (`BL1`)**, **Ligue 1 (`FL1`)**, and **UEFA Champions League (`CL`)**.

3. **Interactive Match Center (`Preview & Tactics` + `2D Pitch`)**
   - **Preview & Tactics Tab**: Match Previews, Post-Match Reviews, Home vs. Away Tactical Systems (e.g., `3-2-5 Box Midfield` vs `4-2-3-1 Mid-Block`), Key Player-vs-Player Battles, Injury & Team News Summary, Head-to-Head (H2H) record, and Expected Goals (xG) Analyst Verdict.
   - **2D Live Pitch Radar & Attack Momentum Wave**: Real-time ball telemetry, 22-player tactical overlay, and 90-minute pressure bars.
   - **Social Sharing Bar**: One-click sharing to **X (Twitter)**, **Reddit (`r/soccer`)**, or **Copy Link**.

4. **Core Content Pillars Hub (`Tactical Hub`, `Gear & Boot Lab`, `90-Day Plan`)**
   - **Tactical Hub & Guides**: Timely match previews, post-match reviews, and evergreen tactical guides (*"Best Formation Against a Low Block"*, *"Set-Piece Corner Routines"*, *"Top U-21 Wonderkids 2026"*, *"Coaching Rondo Drills"*).
   - **Gear & Boot Lab**: Pitch-tested buying guides targeting *"best football boots 2026 under $150"*, GPS player vests, and the Digital Tactical Playbook.
   - **Weekly Tactical Briefing Newsletter**: Built-in email list signup with a free *3-2-5 Low-Block Tactical Guide PDF* lead magnet.

## Getting Started

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.
