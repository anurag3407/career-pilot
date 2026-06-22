import React from 'react';
import { Heart, Activity, Droplets, Thermometer } from 'lucide-react';

export default function VitalsMonitor() {
  return (
    <section className="w-full rounded-[2rem] bg-white border border-slate-200 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
        <div className="flex-1">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Medical Dashboard</p>
            <h2 className="text-3xl font-semibold text-slate-900">Patient Vitals</h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-50 text-teal-600 shadow-sm">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Heart Rate</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-slate-900">72</span>
                  <span className="text-sm text-slate-500">BPM</span>
                </div>
                <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Healthy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-50 text-sky-600 shadow-sm">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Blood Pressure</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-slate-900">120/80</span>
                </div>
                <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  Normal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-50 text-sky-700 shadow-sm">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Oxygen Saturation</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-slate-900">98</span>
                  <span className="text-sm text-slate-500">%</span>
                </div>
                <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  Stable
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-rose-600 shadow-sm">
                <Thermometer className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Body Temperature</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-slate-900">98.6</span>
                  <span className="text-sm text-slate-500">°F</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 shadow-[0_26px_60px_-24px_rgba(15,23,42,0.75)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live Monitoring</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">ECG Monitor</h3>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 ring-1 ring-slate-700">
                Active
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-[#041825] p-4">
              <div className="relative h-44 w-full overflow-hidden rounded-[1.5rem] bg-slate-950">
                <svg viewBox="0 0 900 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <rect width="900" height="160" fill="#041825" />
                  <path
                    d="M0 80 L40 80 L60 45 L80 115 L100 80 L140 80 L170 62 L190 95 L220 78 L260 30 L300 80 L340 80 L380 55 L420 110 L460 80 L520 80 L560 45 L600 80 L640 78 L680 80 L720 80 L760 36 L800 80 L900 80"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="14 8"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-520" dur="2.8s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
              <p className="mt-4 text-sm text-slate-400">Real-time pulse waveform with medical monitor styling for premium healthcare diagnostics.</p>
            </div>
          </div>
        </div>

        <aside className="w-full max-w-md rounded-[2rem] border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm xl:mt-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Summary</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Medical Summary</h3>
            </div>

            <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Patient Stability</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Excellent</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monitoring Accuracy</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">99.8%</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Emergency Readiness</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Active</span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Stability Score</span>
                  <span className="font-semibold text-slate-900">98%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-sky-50 p-5 text-slate-700">
              <p className="text-sm font-semibold">Care Insight</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">Maintain continuous monitoring to ensure optimal patient stability and quick response readiness across all vital channels.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
