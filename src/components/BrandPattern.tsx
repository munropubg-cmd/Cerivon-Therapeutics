import { useId } from 'react';

/*
 * Cerivon molecular lattice: the hexagonal geometry of the logo symbol repeated as a fine
 * line-and-node pattern (a nod to the molecular artwork on the packaging concept).
 * Purely decorative; tint and opacity come from CSS via `currentColor`.
 */
export function BrandPattern({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  // one hexagon cell (flat-top), 56 wide; nodes on alternate vertices like atoms in a ring
  return (
    <svg className={`brand-pattern ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`bp-${id}`} width="84" height="97" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M42 0 L84 24.25 L84 72.75 L42 97 L0 72.75 L0 24.25 Z" />
            <path d="M42 0 V-24 M42 97 V121" />
            <path d="M42 30 L58 39.5 L58 58 L42 67.5 L26 58 L26 39.5 Z" opacity=".55" />
          </g>
          <g fill="currentColor">
            <circle cx="42" cy="0" r="2.4" />
            <circle cx="84" cy="72.75" r="2.4" />
            <circle cx="0" cy="72.75" r="2.4" />
            <circle cx="42" cy="97" r="2.4" />
            <circle cx="58" cy="39.5" r="1.6" />
            <circle cx="26" cy="58" r="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#bp-${id})`} />
    </svg>
  );
}

/** The logo symbol as a small solid mark (for badges on cards and photos). */
export function SymbolMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`symbol-mark ${className}`} viewBox="26 39 340 340" aria-hidden="true" focusable="false">
      <g fill="none" strokeLinecap="square" strokeLinejoin="miter" strokeWidth="42">
        <path d="M 92,278 V 140 l 108,-62 100,60 -53,31 -47,-27 -73,42" stroke="#52dce1" />
        <path d="m 92,237 v 41 l 108,62 100,-59" stroke="#258f9f" />
        <path d="m 128,238 72,-41 50,29" stroke="#258f9f" />
      </g>
    </svg>
  );
}
