// WildflowerSVGs.jsx — Decorative botanical SVG components

export const Daisy = ({ className = "", size = 60, color = "#f9a8d4", centerColor = "#fde68a" }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden="true">
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <ellipse
        key={i}
        cx="30"
        cy="12"
        rx="4"
        ry="10"
        fill={color}
        opacity="0.85"
        transform={`rotate(${deg} 30 30)`}
      />
    ))}
    <circle cx="30" cy="30" r="9" fill={centerColor} />
    <circle cx="30" cy="30" r="5" fill="#f59e0b" opacity="0.7" />
  </svg>
);

export const Poppy = ({ className = "", size = 56, color = "#fca5a5" }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" className={className} aria-hidden="true">
    {[0, 90, 180, 270].map((deg, i) => (
      <ellipse
        key={i}
        cx="28"
        cy="13"
        rx="7"
        ry="13"
        fill={color}
        opacity="0.8"
        transform={`rotate(${deg} 28 28)`}
      />
    ))}
    {[45, 135, 225, 315].map((deg, i) => (
      <ellipse
        key={i + 4}
        cx="28"
        cy="14"
        rx="5.5"
        ry="11"
        fill={color}
        opacity="0.6"
        transform={`rotate(${deg} 28 28)`}
      />
    ))}
    <circle cx="28" cy="28" r="7" fill="#1a1a2e" opacity="0.85" />
    <circle cx="26" cy="26" r="2" fill="#4a1c40" opacity="0.6" />
  </svg>
);

export const Lavender = ({ className = "", size = 70 }) => (
  <svg width={size} height={size * 1.8} viewBox="0 0 40 72" className={className} aria-hidden="true">
    <path d="M20 70 Q18 50 20 35" stroke="#a78bfa" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M20 35 Q14 28 16 20 Q20 14 20 10" stroke="#a78bfa" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M20 35 Q26 28 24 20 Q20 14 20 10" stroke="#a78bfa" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {[8, 12, 16, 20, 24].map((y, i) => (
      <g key={i}>
        <ellipse cx="16" cy={y} rx="3.5" ry="2" fill="#c4b5fd" opacity="0.9" transform={`rotate(-20 16 ${y})`} />
        <ellipse cx="24" cy={y} rx="3.5" ry="2" fill="#c4b5fd" opacity="0.9" transform={`rotate(20 24 ${y})`} />
      </g>
    ))}
    <ellipse cx="20" cy="7" rx="3" ry="2.5" fill="#ddd6fe" opacity="0.95" />
  </svg>
);

export const WildLeaf = ({ className = "", size = 50, color = "#86efac" }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" className={className} aria-hidden="true">
    <path
      d="M25 45 C10 35 5 20 15 10 C20 5 30 3 38 8 C46 13 46 25 38 35 C32 42 25 45 25 45 Z"
      fill={color}
      opacity="0.75"
    />
    <path
      d="M25 45 C22 35 18 22 20 12"
      stroke="#4ade80"
      strokeWidth="1"
      fill="none"
      opacity="0.6"
      strokeLinecap="round"
    />
    <path d="M23 30 C28 26 32 22 35 18" stroke="#4ade80" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />
    <path d="M22 22 C27 19 30 16 33 13" stroke="#4ade80" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />
  </svg>
);

export const ButtercupFlower = ({ className = "", size = 48, color = "#fde68a" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
    {[0, 72, 144, 216, 288].map((deg, i) => (
      <ellipse
        key={i}
        cx="24"
        cy="10"
        rx="5"
        ry="10"
        fill={color}
        opacity="0.9"
        transform={`rotate(${deg} 24 24)`}
      />
    ))}
    <circle cx="24" cy="24" r="7" fill="#f59e0b" />
    <circle cx="24" cy="24" r="4" fill="#d97706" opacity="0.8" />
  </svg>
);

export const CornflowerBlue = ({ className = "", size = 52, color = "#93c5fd" }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" className={className} aria-hidden="true">
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <path
        key={i}
        d={`M26 26 Q${26 + 7 * Math.cos((deg * Math.PI) / 180)} ${26 + 7 * Math.sin((deg * Math.PI) / 180)} ${26 + 16 * Math.cos(((deg - 5) * Math.PI) / 180)} ${26 + 16 * Math.sin(((deg - 5) * Math.PI) / 180)} Q${26 + 14 * Math.cos((deg * Math.PI) / 180)} ${26 + 14 * Math.sin((deg * Math.PI) / 180)} ${26 + 16 * Math.cos(((deg + 5) * Math.PI) / 180)} ${26 + 16 * Math.sin(((deg + 5) * Math.PI) / 180)} Z`}
        fill={color}
        opacity="0.85"
      />
    ))}
    <circle cx="26" cy="26" r="6" fill="#60a5fa" />
    <circle cx="26" cy="26" r="3" fill="#3b82f6" opacity="0.7" />
  </svg>
);

export const SmallPetal = ({ className = "", size = 20, color = "#fbcfe8" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
    <ellipse cx="10" cy="10" rx="4" ry="8" fill={color} opacity="0.7" />
  </svg>
);

export const TinyLeaf = ({ className = "", size = 24, color = "#bbf7d0" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 22 C6 16 4 10 8 5 C10 2 15 1 19 4 C22 7 21 14 16 19 C14 21 12 22 12 22 Z"
      fill={color}
      opacity="0.8"
    />
    <path d="M12 22 C11 16 10 10 11 6" stroke="#4ade80" strokeWidth="0.7" fill="none" opacity="0.5" />
  </svg>
);

export const WatercolorBlob = ({ className = "", width = 300, height = 200, color = "#fce7f3", id }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
    <defs>
      <filter id={`blur-${id}`}>
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width * 0.42}
      ry={height * 0.42}
      fill={color}
      filter={`url(#blur-${id})`}
      opacity="0.55"
    />
    <ellipse
      cx={width * 0.45}
      cy={height * 0.48}
      rx={width * 0.35}
      ry={height * 0.36}
      fill={color}
      filter={`url(#blur-${id})`}
      opacity="0.4"
    />
  </svg>
);

export const StemWithLeaves = ({ className = "", height = 120 }) => (
  <svg width="40" height={height} viewBox={`0 0 40 ${height}`} className={className} aria-hidden="true">
    <path
      d={`M20 ${height} Q18 ${height * 0.6} 20 ${height * 0.1}`}
      stroke="#86efac"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M20 ${height * 0.65} Q10 ${height * 0.5} 8 ${height * 0.35}`}
      stroke="#86efac"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M20 ${height * 0.45} Q30 ${height * 0.3} 32 ${height * 0.15}`}
      stroke="#86efac"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="10" cy={height * 0.42} rx="6" ry="3.5" fill="#bbf7d0" opacity="0.8" transform={`rotate(-40 10 ${height * 0.42})`} />
    <ellipse cx="30" cy={height * 0.25} rx="6" ry="3.5" fill="#bbf7d0" opacity="0.8" transform={`rotate(40 30 ${height * 0.25})`} />
  </svg>
);
