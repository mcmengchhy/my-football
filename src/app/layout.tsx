import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PitchPulse • Football Match Previews, Tactical Analysis, xG & Live 2D Match Center',
  description:
    'In-depth European football match previews, 3-2-5 tactical analysis, post-match reviews, live 2D pitch momentum radar, boot buying guides, and Football-Data.org v4 league tables across the Top 5 European Leagues & Champions League.',
  keywords: [
    'Arsenal vs Liverpool preview',
    'best formation against low block',
    'best football boots 2026 under $150',
    'football tactical analysis',
    'Premier League match previews',
    'Champions League tactical review',
    'expected goals xG stats',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060b14] text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
