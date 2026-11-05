import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TARGET_KEYWORDS } from '@/lib/keywords';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';
import { BrandLogo } from '@/components/BrandLogo';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Radio,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';

interface KeywordPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TARGET_KEYWORDS.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: KeywordPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = TARGET_KEYWORDS.find((k) => k.slug === slug);

  if (!item) {
    return {
      title: 'Topic Not Found | PitchPulse',
    };
  }

  const canonicalPath = `/keywords/${item.slug}`;
  const fullUrl = `${SITE_URL}${canonicalPath}`;

  return {
    title: item.title,
    description: item.description,
    keywords: [item.keyword, ...item.targetQueries, item.category, SITE_NAME],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: item.title,
      description: item.description,
      url: fullUrl,
      siteName: SITE_NAME,
      type: 'article',
      images: [
        {
          url: '/logo.svg',
          width: 512,
          height: 512,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description,
      images: ['/logo.svg'],
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
  };
}

export default async function KeywordDetailPage({ params }: KeywordPageProps) {
  const { slug } = await params;
  const item = TARGET_KEYWORDS.find((k) => k.slug === slug);

  if (!item) {
    notFound();
  }

  const relatedGuide = item.relatedGuideSlug
    ? NICHE_ARTICLES.find((a) => a.slug === item.relatedGuideSlug)
    : null;

  const otherKeywords = TARGET_KEYWORDS.filter((k) => k.slug !== item.slug).slice(0, 4);

  const pageUrl = `${SITE_URL}/keywords/${item.slug}`;

  // Structured Data: Article + FAQPage + BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        headline: item.title,
        description: item.description,
        datePublished: item.lastModified,
        dateModified: item.lastModified,
        inLanguage: 'en-US',
        author: {
          '@type': 'Organization',
          name: `${SITE_NAME} Tactical Intelligence Desk`,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.svg`,
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: item.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Topics',
            item: `${SITE_URL}/keywords`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: item.keyword,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b14]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/keywords"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              All Topics
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Scores
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-400 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link href="/keywords" className="hover:text-white transition-colors">
            Topics
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-semibold truncate max-w-[260px]">
            {item.keyword}
          </span>
        </nav>

        {/* HERO HEADER */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              {item.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
              Search Intent: {item.searchIntent}
            </span>
            <span className="text-xs text-slate-500">
              Updated: {new Date(item.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {item.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {item.description}
          </p>
        </div>

        {/* QUICK SUMMARY CARD */}
        <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0d1526] to-[#0a1b2d] p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            Executive Tactical Summary
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {item.summary}
          </p>

          <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            {item.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-snug">{takeaway}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED DEEP-DIVE GUIDE BANNER (IF AVAILABLE) */}
        {relatedGuide && (
          <section className="rounded-3xl border border-sky-500/30 bg-sky-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-400">
                Connected Tactical Guide
              </span>
              <h3 className="text-base font-bold text-white">{relatedGuide.title}</h3>
              <p className="text-xs text-slate-400">{relatedGuide.excerpt}</p>
            </div>
            <Link
              href={`/guides/${relatedGuide.slug}`}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-sky-500/20"
            >
              Read Full Guide <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </section>
        )}

        {/* FAQ SECTION (SCHEMA OPTIMIZED) */}
        <section className="rounded-3xl border border-white/10 bg-[#0d1526]/80 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                Frequently Asked Tactical Questions
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Google Rich Snippet Data
            </span>
          </div>

          <div className="space-y-4">
            {item.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2"
              >
                <h3 className="text-sm font-bold text-emerald-300">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TARGET SEARCH QUERIES / LSI KEYWORDS TAG CLOUD */}
        <section className="rounded-3xl border border-white/10 bg-[#0d1526]/50 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            Indexed Search Keywords &amp; Variants
          </div>
          <div className="flex flex-wrap gap-2">
            {item.targetQueries.map((query, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300"
              >
                &ldquo;{query}&rdquo;
              </span>
            ))}
          </div>
        </section>

        {/* EXPLORE OTHER TOPICS */}
        <section className="rounded-3xl border border-white/10 bg-[#0d1526]/80 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Explore Related Tactical Topics</span>
            <Link
              href="/keywords"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              View All Topics →
            </Link>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherKeywords.map((k) => (
              <Link
                key={k.slug}
                href={`/keywords/${k.slug}`}
                className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all space-y-1.5"
              >
                <div className="text-[10px] font-extrabold uppercase text-emerald-400">
                  {k.category}
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {k.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {k.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

