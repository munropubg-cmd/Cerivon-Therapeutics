import { motion, useReducedMotion } from 'framer-motion';

/*
 * The recurring graphic from the brief: the geometric line mark of the Cerivon symbol
 * (same three paths as the client's logo file), drawn as thin lines. It draws itself in once.
 * Colour comes from `currentColor`, so each placement sets its own tint and opacity in CSS.
 */
const PATHS = [
  'M 92,278 V 140 l 108,-62 100,60 -53,31 -47,-27 -73,42',
  'm 92,237 v 41 l 108,62 100,-59',
  'm 128,238 72,-41 50,29',
];

export function LineMark({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg className={`linemark ${className}`} viewBox="26 39 340 340" fill="none" aria-hidden="true">
      {PATHS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          className={i === 0 ? 'linemark__a' : 'linemark__b'}
          {...(reduce
            ? {}
            : {
                initial: { pathLength: 0, opacity: 0 },
                whileInView: { pathLength: 1, opacity: 1 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 2.2, delay: 0.2 * i, ease: [0.16, 1, 0.3, 1] },
              })}
        />
      ))}
    </svg>
  );
}
