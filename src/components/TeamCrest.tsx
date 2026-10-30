'use client';

import React, { useState } from 'react';
import { TeamInfo } from '@/types/football';

interface TeamCrestProps {
  team: TeamInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 'w-6 h-6', text: 'text-[9px]' },
  md: { box: 'w-8 h-8', text: 'text-[10px]' },
  lg: { box: 'w-11 h-11', text: 'text-xs' },
  xl: { box: 'w-14 h-14', text: 'text-sm' },
};

export function TeamCrest({ team, size = 'md', className = '' }: TeamCrestProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_MAP[size];
  const gradId = `crest-${team.id}-${size}`;

  if (team.crestUrl && !imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${s.box} ${className}`}
        title={team.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={team.crestUrl}
          alt={team.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${s.box} ${className}`}
      title={team.name}
    >
      <svg viewBox="0 0 40 44" className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={team.primaryColor} />
            <stop offset="65%" stopColor={team.primaryColor} />
            <stop offset="100%" stopColor={team.secondaryColor} />
          </linearGradient>
        </defs>
        {/* Outer Shield */}
        <path
          d="M20 2 L36 8 V20 C36 31 28.5 38.5 20 42 C11.5 38.5 4 31 4 20 V8 L20 2 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="2"
        />
        {/* Diagonal Accent Stripe */}
        <path
          d="M11 6 L29 36"
          stroke={team.secondaryColor}
          strokeWidth="3.5"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />
        {/* Inner Gloss Highlight */}
        <path
          d="M20 4.5 L33.5 9.5 V19.5 C33.5 22 32.8 24.5 31.5 26.8 L8.5 14 C8.5 11.5 8.5 9.5 8.5 9.5 L20 4.5 Z"
          fill="rgba(255,255,255,0.12)"
        />
      </svg>
      <span
        className={`absolute font-extrabold tracking-tighter text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${s.text}`}
      >
        {team.code.slice(0, 3)}
      </span>
    </div>
  );
}
