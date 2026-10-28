import { motion, useReducedMotion } from 'framer-motion';
import { useId, useMemo } from 'react';

/*
 * Cerivon molecular strand: a fine double helix (two phase-shifted strands, base-pair rungs,
 * atom nodes) drawn in brand teal → cyan. Used across section boundaries as a branded
 * transition and as a quiet background line. It draws itself in once when scrolled into view.
 */
const W = 1440, H = 120, MID = 60, AMP = 30, WAVE = 320;

function strand(phase: number) {
  let d = '';
  for (let x = 0; x <= W; x += 8) {
    const y = MID + AMP * Math.sin((2 * Math.PI * x) / WAVE + phase);
    d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`;
  }
  return d;
}

export function Helix({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const { a, b, rungs } = useMemo(() => {
    const rs: { x: number; y1: number; y2: number }[] = [];
    for (let x = 20; x < W; x += 40) {
      const s = Math.sin((2 * Math.PI * x) / WAVE);
      if (Math.abs(s) > 0.28) rs.push({ x, y1: MID + AMP * s, y2: MID - AMP * s });
    }
    return { a: strand(0), b: strand(Math.PI), rungs: rs };
  }, []);
  const draw = (delay: number) => (reduce ? {} : {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 2.4, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
  return (
    <svg className={`helix ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`hx-${id}`} gradientUnits="userSpaceOnUse" x1="0" x2={W} y1="0" y2="0">
          <stop offset="0" stopColor="#258F9F" stopOpacity="0" />
          <stop offset=".18" stopColor="#258F9F" />
          <stop offset=".55" stopColor="#52DCE1" />
          <stop offset=".85" stopColor="#258F9F" />
          <stop offset="1" stopColor="#258F9F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#hx-${id})`} strokeLinecap="round">
        <motion.path d={a} strokeWidth="1.4" vectorEffect="non-scaling-stroke" {...draw(0)} />
        <motion.path d={b} strokeWidth="1.4" vectorEffect="non-scaling-stroke" opacity=".7" {...draw(0.15)} />
        {rungs.map((r, i) => (
          <motion.line
            key={r.x}
            x1={r.x} x2={r.x} y1={r.y1} y2={r.y2}
            strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".45"
            {...(reduce ? {} : { initial: { opacity: 0 }, whileInView: { opacity: 0.45 }, viewport: { once: true }, transition: { delay: 0.6 + i * 0.025, duration: 0.5 } })}
          />
        ))}
      </g>
      <g fill={`url(#hx-${id})`}>
        {rungs.map((r) => (
          <g key={r.x}>
            <circle cx={r.x} cy={r.y1} r="2.6" />
            <circle cx={r.x} cy={r.y2} r="1.8" opacity=".7" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Thin band that straddles two sections: half over the one above, half over the one below. */
export function HelixDivider({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className={`helix-divider helix-divider--${tone}`} aria-hidden="true">
      <Helix />
    </div>
  );
}
