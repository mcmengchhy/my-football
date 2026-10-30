import type { Metadata } from 'next';
import './globals.css';

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://my-football.vercel.app';
}

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'PitchPulse',
  title: {
    default: 'PitchPulse • Live Football Scores, Match Previews, Tactical Analysis & 2D Match Center',
    template: '%s | PitchPulse',
  },
  description:
    'Live European football scores, match previews, 3-2-5 tactical analysis, post-match reviews, interactive 2D pitch momentum radar, and official standings across the Premier League, LaLiga, Serie A, Bundesliga, Ligue 1 & Champions League.',
  keywords: [
    'PitchPulse',
    'live football scores',
    'football tactical analysis',
    'Arsenal vs Liverpool preview',
    'best formation against low block',
    'Premier League match previews',
    'Champions League tactical review',
    'expected goals xG stats',
    'footballset piece tactics guide',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'PitchPulse',
    url: siteUrl,
    title: 'PitchPulse • Live Football Scores, Match Previews & Tactical Hub',
    description:
      'Real-time European football scores, interactive 2D pitch radar, xG telemetry, and deep-dive tactical breakdowns.',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'PitchPulse Football Tactical Hub Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'PitchPulse • Live Football Scores, Match Previews & Tactical Hub',
    description:
      'Real-time European football scores, interactive 2D pitch radar, xG telemetry, and deep-dive tactical breakdowns.',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'PitchPulse',
        alternateName: 'PitchPulse Football Tactical Hub',
        url: siteUrl,
      },
      {
        '@type': 'Organization',
        name: 'PitchPulse',
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060b14] text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
