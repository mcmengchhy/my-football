import type { Metadata, Viewport } from 'next';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site-config';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#060b14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default:
      'PitchPulse • Live Football Scores, Match Previews, Tactical Analysis & 2D Match Center',
    template: '%s | PitchPulse',
  },
  description:
    'Live European football scores, match previews, 3-2-5 tactical analysis, post-match reviews, interactive 2D pitch momentum radar, and official standings across the Premier League, LaLiga, Serie A, Bundesliga, Ligue 1 & Champions League.',
  keywords: [
    'PitchPulse',
    'PITCH PULSE',
    'Pitch Pulse football',
    'live football scores',
    'football tactical analysis',
    'Arsenal vs Liverpool preview',
    'best formation against low block',
    'Real Madrid vs Barcelona post match analysis',
    'Premier League match previews',
    'Champions League tactical review',
    'expected goals xG stats',
    'football set piece tactics guide',
    'best young football players 2026',
    'football pressing training drills',
  ],
  authors: [{ name: 'PitchPulse Tactical Analysis Desk', url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'sports',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
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
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
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
    card: 'summary_large_image',
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
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: ['PITCH PULSE', 'Pitch Pulse', SITE_ALTERNATE_NAME],
        url: SITE_URL,
        inLanguage: 'en-US',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'SportsOrganization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        sport: 'Association Football',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.svg`,
          width: 512,
          height: 512,
        },
      },
      {
        '@type': 'ItemList',
        name: 'Featured Football Tactical Analysis & Match Previews',
        itemListElement: NICHE_ARTICLES.map((art, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: art.title,
          url: `${SITE_URL}/guides/${art.slug}`,
        })),
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
