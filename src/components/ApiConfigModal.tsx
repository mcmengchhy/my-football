'use client';

import React, { useState } from 'react';
import { ApiConfig, ApiProvider } from '@/types/football';
import {
  CheckCircle2,
  Cpu,
  ExternalLink,
  Globe,
  KeyRound,
  RefreshCw,
  Server,
  ShieldCheck,
  X,
} from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  config: ApiConfig;
  onClose: () => void;
  onSave: (newConfig: ApiConfig) => void;
  activeWarning?: string;
}

export function ApiConfigModal({
  isOpen,
  config,
  onClose,
  onSave,
  activeWarning,
}: ApiConfigModalProps) {
  const [draft, setDraft] = useState<ApiConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  React.useEffect(() => {
    setDraft(config);
  }, [config]);

  if (!isOpen) return null;

  const providers: {
    id: ApiProvider;
    title: string;
    subtitle: string;
    endpoint: string;
    badge: string;
  }[] = [
    {
      id: 'football-data',
      title: 'Football-Data.org (v4 REST API • Primary)',
      subtitle: 'Top 5 European Leagues + UCL • 10 req/min with 3-hour server cache',
      endpoint: 'https://api.football-data.org/v4/matches & /standings',
      badge: 'Recommended • Active Key',
    },
    {
      id: 'api-football',
      title: 'API-Football (api-sports.io v3 • Backup)',
      subtitle: 'Backup live fixtures, events & lineups (100 requests/day free tier)',
      endpoint: 'https://v3.football.api-sports.io/fixtures',
      badge: 'Backup API',
    },
    {
      id: 'demo',
      title: 'Built-in Live Match Engine',
      subtitle: 'Real-time ticking minutes, 2D pitch telemetry, lineups & simulated goals',
      endpoint: 'Local Real-Time Engine',
      badge: 'Instant / Offline Mode',
    },
  ];

  async function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/matches?dateOffset=0', {
        headers: {
          'x-api-provider': draft.provider,
          'x-api-football-key': draft.apiFootballKey,
          'x-football-data-key': draft.footballDataKey,
        },
      });
      const data = await res.json();
      if (data.warning) {
        setTestResult({ ok: false, msg: data.warning });
      } else {
        setTestResult({
          ok: true,
          msg: `Connected to ${draft.provider.toUpperCase()} (${data.matches?.length || 0} matches loaded).`,
        });
      }
    } catch (err: any) {
      setTestResult({ ok: false, msg: err?.message || 'Connection failed' });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0d1526] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Football Data Provider & API Key</h2>
              <p className="text-xs text-slate-400">
                Connect API-Football, Football-Data.org, or run the built-in Live Match Engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {activeWarning && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              {activeWarning}
            </div>
          )}

          {/* Provider Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Active Data Source
            </label>
            <div className="space-y-2">
              {providers.map((p) => {
                const selected = draft.provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, provider: p.id });
                      setTestResult(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      selected
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{p.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            selected
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{p.subtitle}</p>
                      <p className="text-[11px] font-mono text-slate-500">{p.endpoint}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                          : 'border-white/20'
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key Input for API-Football */}
          {draft.provider === 'api-football' && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  API-Football Key (`x-apisports-key`)
                </label>
                <a
                  href="https://dashboard.api-football.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={draft.apiFootballKey}
                onChange={(e) => setDraft({ ...draft, apiFootballKey: e.target.value })}
                placeholder="Paste your API-Football v3 key (or set API_FOOTBALL_KEY in .env.local)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Requests are proxied securely via <code className="text-slate-300">/api/matches</code>{' '}
                to avoid CORS issues.
              </p>
            </div>
          )}

          {/* API Key Input for Football-Data.org */}
          {draft.provider === 'football-data' && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  Football-Data.org Token (`X-Auth-Token`)
                </label>
                <a
                  href="https://www.football-data.org/client/register"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  Get Free Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={draft.footballDataKey}
                onChange={(e) => setDraft({ ...draft, footballDataKey: e.target.value })}
                placeholder="Paste your Football-Data.org v4 key (or set FOOTBALL_DATA_API_KEY in .env.local)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Requests are proxied securely via <code className="text-slate-300">/api/matches</code>{' '}
                with automatic fallback if rate-limited.
              </p>
            </div>
          )}

          {/* Auto-refresh Interval */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Live Polling & Ticker Interval</div>
                <div className="text-[11px] text-slate-400">
                  How frequently live scores & pitch radar refresh
                </div>
              </div>
            </div>
            <select
              value={draft.autoRefreshSeconds}
              onChange={(e) =>
                setDraft({ ...draft, autoRefreshSeconds: Number(e.target.value) })
              }
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs font-semibold text-white focus:outline-none"
            >
              <option value={5}>Every 5s (Fast)</option>
              <option value={15}>Every 15s (Standard)</option>
              <option value={30}>Every 30s (API Saver)</option>
              <option value={60}>Every 60s</option>
            </select>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                testResult.ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{testResult.msg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-slate-900/60">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing Endpoint...' : 'Test Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(draft);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

