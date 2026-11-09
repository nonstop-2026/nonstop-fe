import { useId, type ReactNode } from "react";

// Field slugs match FieldSlug in the backend openapi.yaml
export type FieldSlug = "ai" | "nlp" | "cv" | "hci" | "se";

const FIELD_BY_CATEGORY: Record<string, FieldSlug> = {
  "cs.AI": "ai",
  "cs.CL": "nlp",
  "cs.CV": "cv",
  "cs.HC": "hci",
  "cs.SE": "se",
};

const FIELD_LABEL: Record<FieldSlug, string> = {
  ai: "인공지능",
  nlp: "자연어처리",
  cv: "컴퓨터 비전",
  hci: "HCI",
  se: "소프트웨어공학",
};

type Rng = () => number;

// FNV-1a hash so the same paperId always yields the same cover
function hashString(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// mulberry32: small deterministic PRNG seeded by the hash
function createRng(seed: number): Rng {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

// AI: connected nodes, one accent node
function drawNodes(rng: Rng, box: Box): ReactNode {
  const nodes = Array.from({ length: 7 }, () => [box.x + rng() * box.w, box.y + rng() * box.h] as const);
  const accent = Math.floor(rng() * nodes.length);
  const edges: ReactNode[] = [];
  nodes.forEach(([ax, ay], i) => {
    const nearest = nodes
      .map(([bx, by], j) => ({ j, d: Math.hypot(ax - bx, ay - by) }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    nearest.forEach(({ j }) => {
      const [bx, by] = nodes[j];
      edges.push(<line key={`e${i}-${j}`} x1={ax} y1={ay} x2={bx} y2={by} className="stroke-line-divider" strokeWidth={1.5} />);
    });
  });
  return (
    <>
      {edges}
      {nodes.map(([cx, cy], i) => (
        <circle
          key={`n${i}`}
          cx={cx}
          cy={cy}
          r={i === accent ? box.h / 14 : box.h / 22}
          className={i === accent ? "fill-accent-graphic" : "fill-fg-tertiary"}
        />
      ))}
    </>
  );
}

// NLP: text lines, one highlighted line
function drawLines(rng: Rng, box: Box): ReactNode {
  const rows = 6;
  const gap = box.h / rows;
  const accent = Math.floor(rng() * rows);
  return Array.from({ length: rows }, (_, i) => {
    const length = box.w * (0.35 + rng() * 0.65);
    const centerY = box.y + i * gap + gap / 2;
    if (i !== accent) {
      return <rect key={i} x={box.x} y={centerY - gap * 0.12} width={length} height={gap * 0.24} rx={2} className="fill-line-divider" />;
    }
    return (
      <g key={i}>
        <rect x={box.x} y={centerY - gap * 0.32} width={length} height={gap * 0.64} rx={2} className="fill-highlight" />
        <rect x={box.x} y={centerY - gap * 0.12} width={length * 0.7} height={gap * 0.24} rx={2} className="fill-accent-graphic" />
      </g>
    );
  });
}

// CV: pixel grid, one accent cell
function drawGrid(rng: Rng, box: Box): ReactNode {
  const cols = 6;
  const rows = 4;
  const step = Math.min(box.w / cols, box.h / rows);
  const size = step * 0.78;
  const offsetX = box.x + (box.w - step * cols) / 2;
  const accent = Math.floor(rng() * cols * rows);
  return Array.from({ length: cols * rows }, (_, index) => {
    const value = rng();
    const fill =
      index === accent
        ? "fill-accent-graphic"
        : value < 0.45
          ? "fill-surface-muted"
          : value < 0.8
            ? "fill-line-divider"
            : "fill-fg-tertiary";
    return (
      <rect
        key={index}
        x={offsetX + (index % cols) * step}
        y={box.y + Math.floor(index / cols) * step}
        width={size}
        height={size}
        rx={3}
        className={`${fill} stroke-line-divider`}
        strokeWidth={1}
      />
    );
  });
}

// HCI: two overlapping circles, shared area highlighted
function drawCircles(rng: Rng, box: Box, clipId: string): ReactNode {
  const radius = box.h * 0.36;
  const cx = box.x + box.w * (0.38 + rng() * 0.08);
  const cy = box.y + box.h / 2;
  const distance = radius * (0.9 + rng() * 0.4);
  const meetY = cy - Math.sqrt(Math.max(radius * radius - (distance * distance) / 4, 0));
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={radius} />
        </clipPath>
      </defs>
      <circle cx={cx + distance} cy={cy} r={radius} className="fill-highlight" clipPath={`url(#${clipId})`} />
      <circle cx={cx} cy={cy} r={radius} className="fill-none stroke-fg-tertiary" strokeWidth={1.5} />
      <circle cx={cx + distance} cy={cy} r={radius} className="fill-none stroke-fg-tertiary" strokeWidth={1.5} />
      <circle cx={cx + distance / 2} cy={meetY} r={box.h / 16} className="fill-accent-graphic" />
      <circle cx={cx + distance + radius * 0.9} cy={cy + radius * 0.6} r={radius * 0.35} className="fill-none stroke-line-divider" strokeWidth={1.5} />
    </>
  );
}

// SE: indented code lines, one accent line
function drawCode(rng: Rng, box: Box): ReactNode {
  const rows = 7;
  const gap = box.h / rows;
  const accent = Math.floor(rng() * rows);
  let indent = 0;
  return Array.from({ length: rows }, (_, i) => {
    const step = rng() < 0.6 ? (rng() < 0.5 ? 1 : -1) : 0;
    indent = Math.max(0, Math.min(3, indent + step));
    const x = box.x + indent * box.w * 0.08;
    const y = box.y + i * gap + gap * 0.3;
    return (
      <g key={i}>
        <rect x={box.x - 10} y={y} width={4} height={gap * 0.38} rx={1} className="fill-fg-tertiary" />
        <rect
          x={x}
          y={y}
          width={box.w * (0.2 + rng() * 0.45)}
          height={gap * 0.38}
          rx={2}
          className={i === accent ? "fill-accent-graphic" : "fill-line-divider"}
        />
      </g>
    );
  });
}

function drawMotif(field: FieldSlug, rng: Rng, box: Box, clipId: string): ReactNode {
  switch (field) {
    case "ai":
      return drawNodes(rng, box);
    case "nlp":
      return drawLines(rng, box);
    case "cv":
      return drawGrid(rng, box);
    case "hci":
      return drawCircles(rng, box, clipId);
    case "se":
      return drawCode(rng, box);
  }
}

interface PaperCoverProps {
  paperId: string;
  arxivId: string;
  primaryCategory: string;
  // Korean keyword labels, already mapped from KeywordSlug by the caller
  keywordLabels?: string[];
  variant?: "large" | "thumb";
}

export function PaperCover({ paperId, arxivId, primaryCategory, keywordLabels = [], variant = "large" }: PaperCoverProps) {
  const clipId = useId();
  const field = FIELD_BY_CATEGORY[primaryCategory] ?? "ai";
  const rng = createRng(hashString(paperId));

  if (variant === "thumb") {
    return (
      <svg viewBox="0 0 64 64" className="size-14 shrink-0 rounded-control border border-line-divider bg-surface-muted" aria-hidden="true">
        {drawMotif(field, rng, { x: 10, y: 12, w: 44, h: 40 }, clipId)}
      </svg>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-surface-muted" aria-hidden="true">
      <svg viewBox="0 0 320 180" className="absolute inset-0 size-full">
        {drawMotif(field, rng, { x: 56, y: 50, w: 224, h: 94 }, clipId)}
      </svg>
      <div className="absolute left-4 top-3 flex items-baseline gap-2">
        <span className="text-headline text-fg">{primaryCategory}</span>
        <span className="text-caption text-fg-tertiary">{FIELD_LABEL[field]}</span>
      </div>
      <div className="absolute inset-x-4 bottom-3 flex justify-between text-caption text-fg-tertiary">
        <span className="tabular-nums slashed-zero">arXiv {arxivId}</span>
        <span>{keywordLabels.slice(0, 2).join(" · ")}</span>
      </div>
    </div>
  );
}