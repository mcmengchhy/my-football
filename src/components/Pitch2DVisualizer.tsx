'use client';

import React, { useState } from 'react';
import { Match, MomentumPoint } from '@/types/football';
import { Activity, Eye, Flame, Radio, Sparkles } from 'lucide-react';

interface Pitch2DVisualizerProps {
  match: Match;
}

export function Pitch2DVisualizer({ match }: Pitch2DVisualizerProps) {
  const [showPlayersOverlay, setShowPlayersOverlay] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<MomentumPoint | null>(null);

  const pitch = match.livePitch || {
    possession: 'home' as const,
    statusText:
      match.status === 'FT'
        ? 'Full Time • Final Whistle'
        : match.status === 'UPCOMING'
        ? 'Pre-Match Warmup • Pitch Ready'
        : 'Midfield Possession',
    ballX: 50,
    ballY: 50,
    trail: [{ x: 50, y: 50 }],
  };

  const isHomePossession = pitch.possession === 'home';
  const activeTeam = isHomePossession ? match.homeTeam : match.awayTeam;

  return (
    <div className="space-y-5">
      {/* 2D LIVE PITCH TRACKER CARD */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 overflow-hidden shadow-xl">
        {/* Pitch Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {match.status === 'LIVE' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  match.status === 'LIVE' ? 'bg-emerald-400' : 'bg-slate-400'
                }`}
              />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              2D Live Pitch Radar
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs font-medium text-slate-200">{pitch.statusText}</span>
          </div>

          {match.lineups && (
            <button
              type="button"
              onClick={() => setShowPlayersOverlay((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                showPlayersOverlay
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showPlayersOverlay ? '22 Players On' : 'Show Players'}
            </button>
          )}
        </div>

        {/* SVG Football Pitch */}
        <div className="relative p-3 sm:p-4 bg-gradient-to-b from-[#081510] to-[#06100c]">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-emerald-500/25 shadow-inner">
            <svg
              viewBox="0 0 1000 625"
              className="w-full h-full select-none"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Pitch turf stripes */}
                <pattern id="turf-stripes" width="100" height="625" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="50" height="625" fill="#0d291e" />
                  <rect x="50" y="0" width="50" height="625" fill="#0f3023" />
                </pattern>

                {/* Home Attack Glow */}
                <linearGradient id="attack-home" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={match.homeTeam.primaryColor} stopOpacity="0.02" />
                  <stop offset="55%" stopColor={match.homeTeam.primaryColor} stopOpacity="0.12" />
                  <stop offset="100%" stopColor={match.homeTeam.primaryColor} stopOpacity="0.32" />
                </linearGradient>

                {/* Away Attack Glow */}
                <linearGradient id="attack-away" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor={match.awayTeam.primaryColor} stopOpacity="0.02" />
                  <stop offset="55%" stopColor={match.awayTeam.primaryColor} stopOpacity="0.12" />
                  <stop offset="100%" stopColor={match.awayTeam.primaryColor} stopOpacity="0.32" />
                </linearGradient>

                {/* Radial spotlight around ball */}
                <radialGradient id="ball-spotlight" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#34d399" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base Turf */}
              <rect x="0" y="0" width="1000" height="625" fill="url(#turf-stripes)" />

              {/* Active Attack Direction Cone */}
              {match.status === 'LIVE' && (
                <rect
                  x={isHomePossession ? 350 : 30}
                  y="25"
                  width="620"
                  height="575"
                  fill={isHomePossession ? 'url(#attack-home)' : 'url(#attack-away)'}
                  className="transition-all duration-700"
                />
              )}

              {/* Pitch Outer Boundary Lines */}
              <g stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none">
                <rect x="30" y="25" width="940" height="575" rx="4" />
                {/* Halfway Line */}
                <line x1="500" y1="25" x2="500" y2="600" />
                {/* Center Circle */}
                <circle cx="500" cy="312.5" r="78" />
                <circle cx="500" cy="312.5" r="4" fill="rgba(255,255,255,0.65)" />

                {/* Left Penalty Area (Home) */}
                <rect x="30" y="135" width="150" height="355" />
                <rect x="30" y="220" width="55" height="185" />
                <circle cx="135" cy="312.5" r="3.5" fill="rgba(255,255,255,0.6)" />
                <path d="M 180 250 A 75 75 0 0 1 180 375" />
                {/* Left Goal */}
                <rect x="14" y="268" width="16" height="89" stroke="rgba(255,255,255,0.55)" />

                {/* Right Penalty Area (Away) */}
                <rect x="820" y="135" width="150" height="355" />
                <rect x="915" y="220" width="55" height="185" />
                <circle cx="865" cy="312.5" r="3.5" fill="rgba(255,255,255,0.6)" />
                <path d="M 820 250 A 75 75 0 0 0 820 375" />
                {/* Right Goal */}
                <rect x="970" y="268" width="16" height="89" stroke="rgba(255,255,255,0.55)" />

                {/* Corner Arcs */}
                <path d="M 30 42 A 17 17 0 0 0 47 25" />
                <path d="M 953 25 A 17 17 0 0 0 970 42" />
                <path d="M 30 583 A 17 17 0 0 1 47 600" />
                <path d="M 953 600 A 17 17 0 0 1 970 583" />
              </g>

              {/* Team Watermark Labels on Turf */}
              <text
                x="265"
                y="322"
                textAnchor="middle"
                fill="rgba(255,255,255,0.06)"
                fontSize="54"
                fontWeight="900"
                letterSpacing="4"
              >
                {match.homeTeam.code}
              </text>
              <text
                x="735"
                y="322"
                textAnchor="middle"
                fill="rgba(255,255,255,0.06)"
                fontSize="54"
                fontWeight="900"
                letterSpacing="4"
              >
                {match.awayTeam.code}
              </text>

              {/* Optional 22-Player Tactical Dots Overlay */}
              {showPlayersOverlay && match.lineups && (
                <g className="transition-opacity duration-300">
                  {match.lineups.home.startingXI.map((p) => {
                    const cx = (p.x / 100) * 940 + 30;
                    const cy = (p.y / 100) * 575 + 25;
                    return (
                      <g key={p.id} transform={`translate(${cx}, ${cy})`}>
                        <circle
                          r="13"
                          fill={match.homeTeam.primaryColor}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          y="4"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="800"
                        >
                          {p.number}
                        </text>
                      </g>
                    );
                  })}
                  {match.lineups.away.startingXI.map((p) => {
                    const cx = (p.x / 100) * 940 + 30;
                    const cy = (p.y / 100) * 575 + 25;
                    return (
                      <g key={p.id} transform={`translate(${cx}, ${cy})`}>
                        <circle
                          r="13"
                          fill={match.awayTeam.primaryColor}
                          stroke="#e2e8f0"
                          strokeWidth="2"
                        />
                        <text
                          y="4"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="800"
                        >
                          {p.number}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Ball Movement Trail */}
              {pitch.trail && pitch.trail.length > 1 && (
                <g>
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3"
                    strokeDasharray="6 5"
                    strokeOpacity="0.7"
                    points={pitch.trail
                      .map((pt) => `${(pt.x / 100) * 940 + 30},${(pt.y / 100) * 575 + 25}`)
                      .join(' ')}
                  />
                  {pitch.trail.slice(0, -1).map((pt, i) => (
                    <circle
                      key={i}
                      cx={(pt.x / 100) * 940 + 30}
                      cy={(pt.y / 100) * 575 + 25}
                      r="4.5"
                      fill="#34d399"
                      fillOpacity={0.35 + i * 0.15}
                    />
                  ))}
                </g>
              )}

              {/* Live Ball Marker */}
              {(() => {
                const bx = (pitch.ballX / 100) * 940 + 30;
                const by = (pitch.ballY / 100) * 575 + 25;
                return (
                  <g transform={`translate(${bx}, ${by})`} className="transition-all duration-700">
                    <circle r="42" fill="url(#ball-spotlight)" />
                    <circle
                      r="16"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                    <circle r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                    <circle r="3" fill="#0f172a" />
                  </g>
                );
              })()}
            </svg>

            {/* Bottom Floating Possession Pill */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: match.homeTeam.primaryColor }}
                />
                <span>{match.homeTeam.shortName}</span>
                <span className="text-slate-400">→</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{activeTeam.shortName} Possession</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-2">
                <span className="text-slate-400">←</span>
                <span>{match.awayTeam.shortName}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: match.awayTeam.primaryColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATTACK MOMENTUM WAVE GRAPH CARD */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Attack Momentum & Match Pressure
            </h4>
          </div>
          {hoveredPoint ? (
            <div className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white">
              {hoveredPoint.minute}&apos; •{' '}
              {hoveredPoint.value >= 0 ? match.homeTeam.shortName : match.awayTeam.shortName} Pressure (
              {Math.abs(hoveredPoint.value)}%)
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ backgroundColor: match.homeTeam.primaryColor }}
                />
                {match.homeTeam.code}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ backgroundColor: match.awayTeam.primaryColor }}
                />
                {match.awayTeam.code}
              </span>
            </div>
          )}
        </div>

        {match.momentum.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-white/10 rounded-xl">
            <Activity className="w-5 h-5 mb-1.5 text-slate-600" />
            Momentum telemetry begins at kick-off
          </div>
        ) : (
          <div className="relative">
            <div className="h-36 w-full bg-slate-950/60 rounded-xl border border-white/5 p-2 flex flex-col justify-between relative overflow-hidden">
              {/* Center 0-line */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/15 z-0" />
              {/* Half-time 45' vertical divider */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-white/15 z-0" />
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 bg-slate-950/90 px-1.5 rounded">
                HT 45&apos;
              </span>

              {/* Bars across 90 minutes */}
              <div className="relative z-10 grid grid-cols-90 gap-[1.5px] items-center h-full w-full">
                {Array.from({ length: 90 }, (_, idx) => {
                  const minute = idx + 1;
                  const pt = match.momentum.find((m) => m.minute === minute);
                  if (!pt) {
                    return <div key={minute} className="h-full" />;
                  }
                  const isHome = pt.value >= 0;
                  const heightPct = Math.max(8, Math.min(100, Math.abs(pt.value))) / 2;
                  const isGoal = pt.event === 'goal-home' || pt.event === 'goal-away';

                  return (
                    <div
                      key={minute}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="relative h-full flex items-center justify-center group cursor-pointer"
                    >
                      <div
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: isGoal
                            ? '#10b981'
                            : isHome
                            ? match.homeTeam.primaryColor
                            : match.awayTeam.primaryColor,
                          transform: isHome ? 'translateY(-50%)' : 'translateY(50%)',
                        }}
                        className={`w-full rounded-[1px] transition-all duration-150 ${
                          isGoal
                            ? 'opacity-100 ring-1 ring-emerald-300'
                            : 'opacity-80 group-hover:opacity-100'
                        }`}
                      />
                      {isGoal && (
                        <span
                          className={`absolute ${
                            isHome ? 'top-0.5' : 'bottom-0.5'
                          } w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow`}
                          title={`Goal at ${minute}'`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Minute Axis Labels */}
            <div className="flex justify-between text-[10px] font-medium text-slate-500 mt-1.5 px-1">
              <span>1&apos;</span>
              <span>22&apos;</span>
              <span>HT</span>
              <span>68&apos;</span>
              <span>90&apos;</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

