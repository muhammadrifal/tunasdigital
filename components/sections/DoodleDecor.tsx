// Per-corner doodle decorations. Each corner can have its own pattern + color.
// All patterns are designed for top-left; CSS transforms mirror for other corners.

import type { CSSProperties } from "react";

export interface CornerConfig {
  active?: boolean;
  pattern?: string;
  color?: string;
}

export interface DoodleDecorProps {
  corners?: {
    tl?: CornerConfig;
    tr?: CornerConfig;
    bl?: CornerConfig;
    br?: CornerConfig;
  };
  /** @deprecated use corners instead */
  color?: string;
}

// ── Pattern renderers ────────────────────────────────────────────────────────

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.4;
    return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} />;
}

type P = { fill: string; stroke: string };

const PATTERNS: Record<string, (p: P) => React.ReactNode> = {
  arcs: ({ stroke }) => (
    <>
      <path d="M0,50 A50,50,0,0,1,50,0"   stroke={stroke} strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M0,90 A90,90,0,0,1,90,0"   stroke={stroke} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M0,130 A130,130,0,0,1,130,0" stroke={stroke} strokeWidth="9"  fill="none" strokeLinecap="round" />
    </>
  ),
  dots: ({ fill }) => (
    <>
      {[20, 48, 76, 104].flatMap((x) =>
        [20, 48, 76, 104].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={fill} />
        ))
      )}
    </>
  ),
  plus: ({ stroke }) => (
    <>
      {([[28, 28], [90, 52], [48, 100], [115, 112]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} stroke={stroke} strokeWidth="9" strokeLinecap="round" />
          <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 14} stroke={stroke} strokeWidth="9" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  waves: ({ stroke }) => (
    <>
      {[20, 55, 90, 125].map((y, i) => (
        <path key={i} d={`M-10,${y} Q30,${y - 20} 70,${y} Q110,${y + 20} 150,${y} Q190,${y - 20} 230,${y}`}
          stroke={stroke} strokeWidth="8" fill="none" strokeLinecap="round" />
      ))}
    </>
  ),
  triangles: ({ fill }) => (
    <>
      <polygon points="25,5  55,55  -5,55"  fill={fill} opacity="0.9" />
      <polygon points="88,35 112,78  64,78"  fill={fill} opacity="0.7" />
      <polygon points="15,88  48,140 -18,140" fill={fill} opacity="0.8" />
      <polygon points="98,98 130,150  66,150" fill={fill} opacity="0.5" />
    </>
  ),
  squares: ({ fill }) => (
    <>
      <rect x="8"  y="8"  width="44" height="44" rx="7" fill={fill} opacity="0.85" transform="rotate(18 30 30)"  />
      <rect x="76" y="18" width="30" height="30" rx="5" fill={fill} opacity="0.65" transform="rotate(-12 91 33)" />
      <rect x="18" y="80" width="34" height="34" rx="6" fill={fill} opacity="0.75" transform="rotate(22 35 97)"  />
      <rect x="92" y="90" width="46" height="46" rx="8" fill={fill} opacity="0.50" transform="rotate(-16 115 113)" />
    </>
  ),
  stars: ({ fill }) => (
    <g fill={fill}>
      <g opacity="0.85"><Star cx={34} cy={34} r={22} /></g>
      <g opacity="0.65"><Star cx={102} cy={48} r={14} /></g>
      <g opacity="0.75"><Star cx={48}  cy={108} r={16} /></g>
      <g opacity="0.50"><Star cx={116} cy={118} r={20} /></g>
    </g>
  ),
  lines: ({ stroke }) => (
    <>
      {[0, 28, 56, 84, 112, 140].map((offset, i) => (
        <line key={i}
          x1={offset - 10} y1={-10}
          x2={offset + 170} y2={170}
          stroke={stroke} strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      ))}
    </>
  ),
  circles: ({ stroke }) => (
    <>
      <circle cx="0"   cy="0"   r="55"  stroke={stroke} strokeWidth="18" fill="none" />
      <circle cx="105" cy="25"  r="32"  stroke={stroke} strokeWidth="13" fill="none" />
      <circle cx="28"  cy="118" r="42"  stroke={stroke} strokeWidth="13" fill="none" />
    </>
  ),
  bubbles: ({ fill }) => (
    <>
      <circle cx="32"  cy="32"  r="26" fill={fill} opacity="0.75" />
      <circle cx="88"  cy="16"  r="14" fill={fill} opacity="0.55" />
      <circle cx="16"  cy="88"  r="18" fill={fill} opacity="0.65" />
      <circle cx="82"  cy="88"  r="34" fill={fill} opacity="0.40" />
      <circle cx="128" cy="56"  r="10" fill={fill} opacity="0.60" />
    </>
  ),
  zigzag: ({ stroke }) => (
    <>
      {[0, 35, 70, 105].map((base, i) => (
        <polyline key={i}
          points={`-10,${base + 17} 20,${base} 50,${base + 34} 80,${base} 110,${base + 34} 140,${base} 170,${base + 17}`}
          stroke={stroke} strokeWidth="8" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.75" />
      ))}
    </>
  ),
};

export const PATTERN_LABELS: Record<string, string> = {
  arcs:      "Lengkung",
  dots:      "Titik",
  plus:      "Plus",
  waves:     "Gelombang",
  triangles: "Segitiga",
  squares:   "Kotak",
  stars:     "Bintang",
  lines:     "Garis",
  circles:   "Lingkaran",
  bubbles:   "Gelembung",
  zigzag:    "Zigzag",
};

// ── Corner component ─────────────────────────────────────────────────────────

const TRANSFORMS: Record<string, string> = {
  tl: "none",
  tr: "scaleX(-1)",
  bl: "scaleY(-1)",
  br: "scale(-1,-1)",
};

const POSITIONS: Record<string, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
};

function CornerDoodle({ config, position }: { config: CornerConfig; position: "tl" | "tr" | "bl" | "br" }) {
  if (!config.active) return null;
  const pattern = config.pattern ?? "arcs";
  const color   = config.color   ?? "#ffffff";
  const render  = PATTERNS[pattern] ?? PATTERNS.arcs;

  return (
    <svg
      width="160" height="160"
      viewBox="0 0 160 160"
      fill="none"
      className={`absolute ${POSITIONS[position]} pointer-events-none select-none`}
      style={{ transform: TRANSFORMS[position], opacity: 0.22 } as CSSProperties}
    >
      {render({ fill: color, stroke: color })}
    </svg>
  );
}

// ── Legacy color map (for old doodle_color string) ───────────────────────────

const LEGACY_COLORS: Record<string, string> = {
  white:  "#ffffff",
  dark:   "#1a1a2e",
  orange: "#f97316",
  blue:   "#3b82f6",
  yellow: "#eab308",
};

const LEGACY_CORNERS = (color: string) => ({
  tl: { active: true,  pattern: "arcs",   color },
  tr: { active: true,  pattern: "dots",   color },
  bl: { active: true,  pattern: "plus",   color },
  br: { active: true,  pattern: "bubbles",color },
});

// ── Main export ───────────────────────────────────────────────────────────────

export default function DoodleDecor({ corners, color }: DoodleDecorProps) {
  const resolved = corners ?? LEGACY_CORNERS(LEGACY_COLORS[color ?? "white"] ?? "#ffffff");
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((pos) =>
        resolved[pos] ? <CornerDoodle key={pos} config={resolved[pos]!} position={pos} /> : null
      )}
    </>
  );
}
