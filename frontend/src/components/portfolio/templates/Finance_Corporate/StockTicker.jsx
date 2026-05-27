import { useState, useEffect, useRef } from "react";
import {
  TrendingUp, TrendingDown, Activity, BarChart3,
  Zap, Globe, ChevronUp, ChevronDown, Clock, Wifi
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────

const TICKER_STOCKS = [
  { symbol: "AAPL",  price: "189.42", change: "+1.24",  pct: "+0.66%", vol: "52.3M" },
  { symbol: "MSFT",  price: "415.87", change: "+3.51",  pct: "+0.85%", vol: "21.1M" },
  { symbol: "NVDA",  price: "875.39", change: "+22.14", pct: "+2.59%", vol: "41.8M" },
  { symbol: "GOOGL", price: "175.23", change: "-0.87",  pct: "-0.49%", vol: "18.6M" },
  { symbol: "AMZN",  price: "192.64", change: "+1.95",  pct: "+1.02%", vol: "29.4M" },
  { symbol: "META",  price: "527.18", change: "+8.73",  pct: "+1.68%", vol: "14.2M" },
  { symbol: "TSLA",  price: "248.91", change: "-5.32",  pct: "-2.09%", vol: "98.7M" },
  { symbol: "JPM",   price: "207.55", change: "+0.63",  pct: "+0.30%", vol: "11.9M" },
  { symbol: "V",     price: "284.77", change: "+2.11",  pct: "+0.75%", vol: "8.3M"  },
  { symbol: "UNH",   price: "521.34", change: "-3.74",  pct: "-0.71%", vol: "3.8M"  },
  { symbol: "PLTR",  price: "24.88",  change: "+0.94",  pct: "+3.92%", vol: "67.4M" },
  { symbol: "AMD",   price: "168.22", change: "+4.17",  pct: "+2.54%", vol: "38.2M" },
  { symbol: "NFLX",  price: "632.10", change: "+9.88",  pct: "+1.59%", vol: "6.1M"  },
  { symbol: "DIS",   price: "111.47", change: "-0.55",  pct: "-0.49%", vol: "9.3M"  },
  { symbol: "BAC",   price: "38.92",  change: "+0.21",  pct: "+0.54%", vol: "44.6M" },
  { symbol: "GS",    price: "452.73", change: "+3.27",  pct: "+0.73%", vol: "2.7M"  },
];

const MARKET_OVERVIEW = [
  { label: "NASDAQ",  value: "18,247.31", change: "+1.42%", raw: 1.42,  sub: "Composite",    icon: BarChart3, color: "cyan"    },
  { label: "S&P 500", value: "5,432.18",  change: "+0.87%", raw: 0.87,  sub: "Large Cap",    icon: Activity,  color: "emerald" },
  { label: "BTC/USD", value: "68,423.50", change: "+3.21%", raw: 3.21,  sub: "Bitcoin Spot", icon: Zap,       color: "amber"   },
  { label: "XAU/USD", value: "2,387.40",  change: "-0.34%", raw: -0.34, sub: "Gold $/oz",    icon: Globe,     color: "rose"    },
];

// Deterministic sparkline points (7-point, normalized 0–1)
const SPARKLINES = {
  cyan:    [0.45, 0.52, 0.48, 0.60, 0.55, 0.70, 0.74],
  emerald: [0.50, 0.53, 0.56, 0.52, 0.61, 0.64, 0.68],
  amber:   [0.40, 0.55, 0.62, 0.58, 0.70, 0.65, 0.80],
  rose:    [0.60, 0.58, 0.65, 0.62, 0.59, 0.55, 0.52],
};

// ─────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────

const COLORS = {
  cyan:    { hex: "#22d3ee", glow: "rgba(34,211,238,0.18)",  border: "rgba(34,211,238,0.22)", badge: "rgba(34,211,238,0.09)" },
  emerald: { hex: "#34d399", glow: "rgba(52,211,153,0.18)",  border: "rgba(52,211,153,0.22)", badge: "rgba(52,211,153,0.09)" },
  amber:   { hex: "#fbbf24", glow: "rgba(251,191,36,0.18)",  border: "rgba(251,191,36,0.22)", badge: "rgba(251,191,36,0.09)" },
  rose:    { hex: "#fb7185", glow: "rgba(251,113,133,0.18)", border: "rgba(251,113,133,0.22)",badge: "rgba(251,113,133,0.09)"},
};

// ─────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────

/** Jitters price by ±0.05 every 3-5 s for a live-data feel */
function useLivePrice(base) {
  const [display, setDisplay] = useState(base);
  useEffect(() => {
    const schedule = () =>
      setTimeout(() => {
        const n = parseFloat(base.replace(/,/g, "")) + (Math.random() - 0.5) * 0.05;
        setDisplay(n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        t.current = schedule();
      }, 3000 + Math.random() * 2000);
    const t = { current: schedule() };
    return () => clearTimeout(t.current);
  }, [base]);
  return display;
}

/** Returns HH:MM:SS in ET */
function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/New_York" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─────────────────────────────────────────────────────────────────
// SPARKLINE SVG
// ─────────────────────────────────────────────────────────────────

function Sparkline({ points, color, isUp }) {
  const W = 80, H = 28, pad = 2;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (W - pad * 2));
  const ys = points.map(v => H - pad - v * (H - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const fill = `${d} L${xs[xs.length-1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;
  const stroke = isUp ? "#34d399" : "#fb7185";
  const gradId = `sg-${color}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={d} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// VOLUME BAR
// ─────────────────────────────────────────────────────────────────

const MAX_VOL = 98.7; // TSLA reference

function VolumeBar({ vol, isUp }) {
  const pct = Math.min(100, (parseFloat(vol) / MAX_VOL) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden" style={{ maxWidth: 56 }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isUp ? "rgba(52,211,153,0.6)" : "rgba(251,113,133,0.6)",
          }}
        />
      </div>
      <span className="font-mono text-[10px] text-slate-500">{vol}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MARKET CARD
// ─────────────────────────────────────────────────────────────────

function MarketCard({ item }) {
  const c = COLORS[item.color];
  const liveVal = useLivePrice(item.value);
  const isUp = item.raw >= 0;
  const Icon = item.icon;
  const pts = SPARKLINES[item.color];

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-xl p-4 overflow-hidden cursor-default
                 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(9,14,31,0.95) 100%)",
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.35), 0 0 0 0 ${c.glow}`,
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.45), 0 0 20px ${c.glow}`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.35), 0 0 0 0 ${c.glow}`)}
    >
      {/* Ambient corner glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity duration-300 group-hover:opacity-25"
        style={{ background: c.hex }}
      />

      {/* ── Row 1: label + live dot ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
            style={{ background: c.badge, border: `1px solid ${c.border}` }}
          >
            <Icon size={13} style={{ color: c.hex }} />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase leading-none" style={{ color: c.hex }}>
              {item.label}
            </p>
            <p className="text-[9px] text-slate-600 tracking-wide mt-0.5">{item.sub}</p>
          </div>
        </div>
        {/* Pulsing live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: c.hex }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: c.hex }} />
          </span>
          <span className="text-[8px] text-slate-600 tracking-[0.15em] uppercase">Live</span>
        </div>
      </div>

      {/* ── Row 2: price + sparkline ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xl font-bold text-white leading-none tracking-tight">
            {liveVal}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            {isUp
              ? <ChevronUp size={11} className="text-emerald-400" />
              : <ChevronDown size={11} className="text-rose-400" />
            }
            <span className={`font-mono text-xs font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
              {item.change}
            </span>
            <span className="text-[9px] text-slate-600 ml-0.5">1D</span>
          </div>
        </div>
        <Sparkline points={pts} color={item.color} isUp={isUp} />
      </div>

      {/* ── Bottom rule with gradient ── */}
      <div className="h-px w-full opacity-20 mt-1"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${c.hex} 50%, transparent 100%)` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TICKER STRIP ITEM
// ─────────────────────────────────────────────────────────────────

function TickerItem({ item }) {
  const isUp = item.change.startsWith("+");
  return (
    <div className="flex items-center gap-2.5 px-5 shrink-0 select-none">
      <span className="text-slate-700 text-[9px]">◆</span>
      <span className="font-mono text-[11px] font-bold tracking-widest text-slate-300">{item.symbol}</span>
      <span className="font-mono text-[12px] font-semibold text-white">{item.price}</span>
      <span className={`font-mono text-[10px] font-medium flex items-center gap-0.5 ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
        {isUp ? "▲" : "▼"}{item.pct}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// WATCHLIST TABLE
// ─────────────────────────────────────────────────────────────────

function WatchlistTable({ stocks }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(9,14,31,0.85)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Table header bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(34,211,238,0.03)" }}
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={12} className="text-cyan-500" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">Watchlist</span>
        </div>
        <span className="text-[9px] text-slate-600 tracking-widest">{stocks.length} securities</span>
      </div>

      {/* Column headings */}
      <div
        className="grid px-5 py-2 border-b"
        style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 2fr", borderColor: "rgba(255,255,255,0.04)" }}
      >
        {["Symbol", "Last", "Change", "% Chg", "Volume"].map(h => (
          <span key={h} className="text-[9px] text-slate-600 tracking-widest uppercase">{h}</span>
        ))}
      </div>

      {/* Rows */}
      {stocks.map((stock, i) => {
        const isUp = stock.change.startsWith("+");
        const isHov = hovered === i;
        return (
          <div
            key={stock.symbol}
            className="grid items-center px-5 py-2.5 cursor-default transition-colors duration-150"
            style={{
              gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 2fr",
              borderBottom: i < stocks.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
              background: isHov ? "rgba(34,211,238,0.04)" : "transparent",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Symbol */}
            <div className="flex items-center gap-2">
              <div
                className="w-0.5 h-3.5 rounded-full shrink-0"
                style={{
                  background: isUp ? "#34d399" : "#fb7185",
                  boxShadow: `0 0 4px ${isUp ? "#34d399" : "#fb7185"}`,
                }}
              />
              <span className="font-mono text-[11px] font-bold text-slate-200 tracking-wider">{stock.symbol}</span>
            </div>

            {/* Last price */}
            <span className="font-mono text-[11px] text-white font-semibold">{stock.price}</span>

            {/* Change */}
            <span className={`font-mono text-[11px] font-medium ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
              {stock.change}
            </span>

            {/* Pct */}
            <div className="flex items-center gap-1">
              {isUp
                ? <TrendingUp size={9} className="text-emerald-400 shrink-0" />
                : <TrendingDown size={9} className="text-rose-400 shrink-0" />
              }
              <span className={`font-mono text-[10px] font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                {stock.pct}
              </span>
            </div>

            {/* Volume bar */}
            <VolumeBar vol={stock.vol} isUp={isUp} />
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SIDEBAR SUMMARY
// ─────────────────────────────────────────────────────────────────

function SidebarSummary({ stocks }) {
  const gainers  = stocks.filter(s => s.change.startsWith("+")).length;
  const losers   = stocks.length - gainers;
  const topGain  = [...stocks].sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct))[0];
  const topLoss  = [...stocks].sort((a, b) => parseFloat(a.pct) - parseFloat(b.pct))[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Breadth */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(9,14,31,0.85)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase mb-3">Market Breadth</p>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${(gainers / stocks.length) * 100}%`, background: "#34d399", boxShadow: "0 0 6px #34d399" }}
          />
          <div
            className="h-1.5 rounded-full flex-1"
            style={{ background: "#fb7185", boxShadow: "0 0 6px rgba(251,113,133,0.4)" }}
          />
        </div>
        <div className="flex justify-between text-[9px] mt-1">
          <span className="text-emerald-400 font-semibold">{gainers} gaining</span>
          <span className="text-rose-400 font-semibold">{losers} falling</span>
        </div>
      </div>

      {/* Top mover */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(9,14,31,0.85)",
          border: "1px solid rgba(52,211,153,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase mb-2">Top Gainer</p>
        <p className="font-mono text-sm font-bold text-white">{topGain.symbol}</p>
        <p className="font-mono text-xs text-emerald-400 font-semibold mt-0.5">{topGain.pct}</p>
        <p className="font-mono text-[10px] text-slate-500 mt-0.5">${topGain.price}</p>
      </div>

      {/* Top loser */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(9,14,31,0.85)",
          border: "1px solid rgba(251,113,133,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase mb-2">Top Loser</p>
        <p className="font-mono text-sm font-bold text-white">{topLoss.symbol}</p>
        <p className="font-mono text-xs text-rose-400 font-semibold mt-0.5">{topLoss.pct}</p>
        <p className="font-mono text-[10px] text-slate-500 mt-0.5">${topLoss.price}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION DIVIDER
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.25), transparent)" }} />
      <span className="text-[9px] text-slate-500 tracking-[0.25em] uppercase shrink-0">{children}</span>
      <div className="h-px flex-1" style={{ background: "linear-gradient(-90deg, rgba(34,211,238,0.25), transparent)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function StockTicker() {
  const [paused, setPaused]       = useState(false);
  const [marketOpen, setMktOpen]  = useState(true);
  const time                      = useClock();
  const tickerItems               = [...TICKER_STOCKS, ...TICKER_STOCKS]; // seamless loop

  // Determine market open by NY hour
  useEffect(() => {
    const h = new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "America/New_York" });
    setMktOpen(Number(h) >= 9 && Number(h) < 16);
  }, [time]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(160deg, #020817 0%, #0a1628 45%, #030d1a 100%)",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
      }}
    >
      {/* ── Keyframes ──────────────────────────────────────────── */}
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ticker-track {
          display: flex;
          will-change: transform;
          animation: ticker-scroll 50s linear infinite;
        }
        .ticker-track.paused { animation-play-state: paused; }
        .fade-up { animation: fade-up 0.5s ease-out both; }
      `}</style>

      {/* ── Background grid ──────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.025,
        }}
      />
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-[0.06]"
        style={{ background: "#22d3ee" }} />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-[0.05]"
        style={{ background: "#34d399" }} />

      {/* ── Page shell ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col gap-6">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <header
          className="fade-up rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{
            background: "rgba(9,14,31,0.85)",
            border: "1px solid rgba(34,211,238,0.14)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 32px rgba(34,211,238,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
            animationDelay: "0ms",
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(52,211,153,0.08))",
                border: "1px solid rgba(34,211,238,0.3)",
                boxShadow: "0 0 14px rgba(34,211,238,0.2)",
              }}
            >
              <BarChart3 size={16} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-white">
                APEX<span className="text-cyan-400">MARKETS</span>
              </h1>
              <p className="text-[9px] text-slate-600 tracking-[0.18em] uppercase">Financial Intelligence Platform</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[9px] tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inset-0 rounded-full opacity-70 ${marketOpen ? "bg-emerald-400" : "bg-rose-500"}`} />
                <span className={`relative rounded-full h-1.5 w-1.5 ${marketOpen ? "bg-emerald-400" : "bg-rose-500"}`} />
              </span>
              <span className={marketOpen ? "text-emerald-400" : "text-rose-400"}>
                {marketOpen ? "Market Open" : "Market Closed"}
              </span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock size={9} />
              <span>{time} ET</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Wifi size={9} />
              <span>NYSE · NASDAQ · CRYPTO</span>
            </div>
          </div>
        </header>

        {/* ── LIVE TICKER STRIP ────────────────────────────────── */}
        <section
          className="fade-up rounded-xl overflow-hidden"
          style={{
            background: "rgba(9,14,31,0.9)",
            border: "1px solid rgba(34,211,238,0.1)",
            animationDelay: "60ms",
          }}
        >
          {/* Top bar */}
          <div
            className="flex items-center gap-2.5 px-4 py-2 border-b"
            style={{ borderColor: "rgba(34,211,238,0.08)", background: "rgba(34,211,238,0.03)" }}
          >
            <Activity size={10} className="text-cyan-500" />
            <span className="text-[9px] text-cyan-600 tracking-[0.2em] uppercase font-semibold">Live Quotes</span>
            <div className="flex-1 h-px" style={{ background: "rgba(34,211,238,0.07)" }} />
            <button
              onClick={() => setPaused(p => !p)}
              className="text-[9px] text-slate-600 hover:text-cyan-400 tracking-widest uppercase transition-colors duration-200"
              aria-label={paused ? "Resume ticker" : "Pause ticker"}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>

          {/* Scrolling strip */}
          <div
            className="relative overflow-hidden py-2.5"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Edge masks */}
            <div className="absolute left-0 inset-y-0 w-12 z-10 pointer-events-none"
              style={{ background: "linear-gradient(90deg,rgba(9,14,31,1),transparent)" }} />
            <div className="absolute right-0 inset-y-0 w-12 z-10 pointer-events-none"
              style={{ background: "linear-gradient(-90deg,rgba(9,14,31,1),transparent)" }} />

            <div className={`ticker-track${paused ? " paused" : ""}`}>
              {tickerItems.map((item, i) => (
                <TickerItem key={`${item.symbol}-${i}`} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* ── MARKET OVERVIEW ──────────────────────────────────── */}
        <section className="fade-up" style={{ animationDelay: "120ms" }}>
          <SectionLabel>Market Overview</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {MARKET_OVERVIEW.map((item, i) => (
              <div key={item.label} className="fade-up" style={{ animationDelay: `${160 + i * 50}ms` }}>
                <MarketCard item={item} />
              </div>
            ))}
          </div>
        </section>

        {/* ── WATCHLIST + SIDEBAR ──────────────────────────────── */}
        <section className="fade-up" style={{ animationDelay: "380ms" }}>
          <SectionLabel>Watchlist</SectionLabel>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-4">
            <WatchlistTable stocks={TICKER_STOCKS} />
            <SidebarSummary stocks={TICKER_STOCKS} />
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="fade-up pb-2 text-center" style={{ animationDelay: "460ms" }}>
          <p className="text-[8px] text-slate-700 tracking-[0.18em] uppercase">
            Simulated data · Not financial advice · ApexMarkets © 2026
          </p>
        </footer>

      </div>
    </div>
  );
}
