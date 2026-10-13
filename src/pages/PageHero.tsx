import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LineMark } from '../components/LineMark';
import { R, Split } from '../hooks/useReveal';

export function PageHero({ crumbs, line1, line2, lede, meta, children }: {
  crumbs: { to?: string; label: string }[];
  line1: ReactNode;
  line2?: ReactNode;
  lede?: ReactNode;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <LineMark className="page-hero__mark" />
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="crumbs__item">
              <span aria-hidden="true">/</span>
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <Split as="h1" className="h-section" lines={line2 ? [line1, line2] : [line1]} />
        {meta && <R as="p" className="page-hero__meta">{meta}</R>}
        {lede && <R as="p" className="page-hero__lede">{lede}</R>}
        {children}
      </div>
    </section>
  );
}
