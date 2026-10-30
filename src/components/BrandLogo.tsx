'use client';

import React from 'react';
import { Radio } from 'lucide-react';

interface BrandLogoProps {
  liveCount?: number;
  subtitle?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function BrandLogo({
  liveCount = 0,
  subtitle = 'Match Previews • Tactical Analysis • Top 5 Leagues & UCL',
  size = 'md',
  onClick,
}: BrandLogoProps) {
  const isSmall = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 shrink-0 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Custom Football Pitch + Tactical Pulse Crest SVG */}
      <div
        className={`relative flex items-center justify-center ${
          isSmall ? 'w-8 h-8 rounded-xl' : 'w-11 h-11 rounded-2xl'
        } bg-[#091324] shadow-lg shadow-emerald-500/15 group-hover:shadow-emerald-500/30 transition-all`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="PitchPulse Logo"
        >
          <defs>
            <linearGradient
              id="ppBgGrad"
              x1="6"
              y1="4"
              x2="58"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#0f1f38" />
              <stop offset="100%" stopColor="#060b14" />
            </linearGradient>
            <linearGradient
              id="ppBorderGrad"
              x1="8"
              y1="6"
              x2="56"
              y2="58"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient
              id="ppPulseGrad"
              x1="10"
              y1="32"
              x2="54"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="55%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Outer Crest Frame */}
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="16"
            fill="url(#ppBgGrad)"
            stroke="url(#ppBorderGrad)"
            strokeWidth="2.6"
          />

          {/* Tactical Pitch Inner Boundary & Halfway Line */}
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="10"
            stroke="#10b981"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          <line
            x1="32"
            y1="10"
            x2="32"
            y2="54"
            stroke="#10b981"
            strokeOpacity="0.22"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
          />

          {/* Center Circle & Football Pentagon */}
          <circle
            cx="32"
            cy="32"
            r="14.5"
            fill="#10b981"
            fillOpacity="0.1"
            stroke="url(#ppBorderGrad)"
            strokeWidth="1.8"
          />
          <polygon
            points="32,23.2 39.8,28.7 36.8,37.8 27.2,37.8 24.2,28.7"
            fill="#10b981"
            fillOpacity="0.24"
            stroke="#34d399"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Dynamic Tactical Pulse Wave */}
          <path
            d="M11 33H20L24.5 21.5L30 43.5L35.5 18.5L40.5 36.5L44 33H53"
            stroke="url(#ppPulseGrad)"
            strokeWidth="3.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="53" cy="33" r="2.8" fill="#34d399" />
        </svg>

        {liveCount > 0 && !isSmall && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-slate-950" />
          </span>
        )}
      </div>

      {/* Brand Wordmark & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`${
              isSmall ? 'text-sm' : 'text-lg'
            } font-black tracking-tight text-white flex items-center`}
          >
            PITCH
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              PULSE
            </span>
          </span>

          {liveCount > 0 && !isSmall && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Radio className="w-2.5 h-2.5" /> {liveCount} LIVE
            </span>
          )}
        </div>
        {!isSmall && subtitle && (
          <p className="text-[11px] text-slate-400 hidden sm:block">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

