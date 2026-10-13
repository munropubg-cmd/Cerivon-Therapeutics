import { useInView } from 'framer-motion';
import { createElement, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

/*
 * Reveal-on-scroll. Framer Motion's useInView watches the element and adds `.is-in`,
 * which triggers the template's tuned CSS reveals: [data-reveal] fade-up, [data-split] masked
 * heading lines, [data-stagger] clip-in cards. Reduced motion is handled in CSS.
 */
type Kind = 'reveal' | 'split' | 'stagger' | 'plain';

type Props = {
  as?: ElementType;
  kind?: Kind;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
};

export function useReveal<T extends Element>(amount = 0.15) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount, margin: '0px 0px -40px 0px' });
  return [ref, inView] as const;
}

export function R({ as = 'div', kind = 'reveal', className = '', delay, style, children, ...rest }: Props) {
  const [ref, inView] = useReveal<HTMLElement>();
  const data = kind === 'plain' ? {} : { [`data-${kind}`]: '' };
  return createElement(
    as,
    {
      ref,
      className: `${className}${inView ? ' is-in' : ''}`.trim() || undefined,
      style: delay !== undefined ? { ...style, ['--d' as string]: `${delay}s` } : style,
      ...data,
      ...rest,
    },
    children,
  );
}

/** Two-line masked heading: <Split as="h2" className="h-section" lines={["A weight plan built", <>around your <em>goals</em></>]} /> */
export function Split({ as = 'h2', className, lines, id }: { as?: ElementType; className: string; lines: ReactNode[]; id?: string }) {
  return (
    <R as={as} kind="split" className={className} id={id}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </R>
  );
}
