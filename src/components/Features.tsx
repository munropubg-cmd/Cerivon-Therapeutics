import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from './Icons';

/** Runs `tick` every `ms` only while `ref` is on screen (and motion is allowed). */
function useTicker(ref: React.RefObject<Element>, ms: number, tick: () => void, enabled = true) {
  const visible = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const cb = useRef(tick);
  cb.current = tick;
  useEffect(() => {
    if (!visible || reduce || !enabled) return;
    const id = setInterval(() => cb.current(), ms);
    return () => clearInterval(id);
  }, [visible, reduce, enabled, ms]);
}

/* ---------- Card slider (skincare, peptides, HRT) ---------- */
export function Slider({ label, title, children, trackClass, barClass, labelClass }: {
  label: string; title: string; children: ReactNode; trackClass: string; barClass: string; labelClass: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = () => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft <= 2, end: t.scrollLeft >= t.scrollWidth - t.clientWidth - 2 });
  };
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const step = (d: number) => {
    const t = track.current;
    const card = t?.firstElementChild;
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap || '16') || 16;
    t.scrollBy({ left: d * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };
  return (
    <>
      <div className={barClass}>
        <p className={labelClass}>{title}</p>
        <div className="slider-nav">
          <button className="slider-btn" onClick={() => step(-1)} aria-label="Previous treatments" disabled={edge.start}><ArrowLeft /></button>
          <button className="slider-btn" onClick={() => step(1)} aria-label="Next treatments" disabled={edge.end}><ArrowRight /></button>
        </div>
      </div>
      <StaggerTrack trackRef={track} className={`${trackClass}${edge.start ? ' is-start' : ''}${edge.end ? ' is-end' : ''}`} label={label} onScroll={() => requestAnimationFrame(update)}>
        {children}
      </StaggerTrack>
    </>
  );
}

function StaggerTrack({ trackRef, className, label, onScroll, children }: {
  trackRef: React.RefObject<HTMLDivElement>; className: string; label: string; onScroll: () => void; children: ReactNode;
}) {
  const inView = useInView(trackRef, { once: true, amount: 0.15 });
  return (
    <div ref={trackRef} className={`${className}${inView ? ' is-in' : ''}`} data-stagger="" data-track="" tabIndex={0} aria-label={label} onScroll={onScroll}>
      {children}
    </div>
  );
}

/* ---------- 3D text orbit around a vial ---------- */
export function Orbit({ text }: { text: string }) {
  const chars = useMemo(() => [...text], [text]);
  const step = 360 / chars.length;
  return (
    <div className="orbit">
      {chars.map((c, i) => (
        <span key={i} className="orbit__ch" style={{ transform: `rotateY(${(i * step).toFixed(2)}deg) translateZ(var(--R))` }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </div>
  );
}

/* ---------- Peptides: educational body map ---------- */
const SPOTS = [
  { x: 50, y: 11, side: 'right', name: 'Sermorelin', text: 'A growth hormone-releasing hormone (GHRH) analog. Offered only when a licensed provider determines it is appropriate.' },
  { x: 50, y: 21.5, side: 'left', name: 'NAD+ Nasal Spray', text: 'The same coenzyme as NAD+, in an intranasal form for people who prefer not to inject.' },
  { x: 59, y: 50, side: 'right', name: 'NAD+', text: 'Nicotinamide adenine dinucleotide, a coenzyme involved in cellular energy metabolism.' },
  { x: 43, y: 68, side: 'left', name: 'Glutathione', text: 'An antioxidant the body produces naturally.' },
] as const;

export function BodyMap() {
  const map = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);
  useTicker(map, 3200, () => setI((n) => (n + 1) % SPOTS.length), !manual);
  const take = (k: number) => { setManual(true); setI(k); };
  return (
    <>
      <div className="body-map" ref={map}>
        <div className="body-map__glow" aria-hidden="true" />
        <img className="body-map__img" src="/assets/img/body-figure.webp" alt="Neutral human figure used to show where each compound is discussed" />
        {SPOTS.map((s, k) => (
          <button
            key={s.name}
            type="button"
            className={`hotspot${k === i ? ' is-active' : ''}`}
            style={{ ['--x' as string]: `${s.x}%`, ['--y' as string]: `${s.y}%` }}
            data-side={s.side}
            aria-describedby={`hs-${k}`}
            onMouseEnter={() => take(k)}
            onFocus={() => take(k)}
            onClick={() => take(k)}
          >
            <span className="hotspot__dot" aria-hidden="true" />
            <span className="hotspot__tip" id={`hs-${k}`} role="tooltip"><b>{s.name}</b>{s.text}</span>
          </button>
        ))}
      </div>
      <p className="body-map__label" aria-live="polite"><b>{SPOTS[i].name}</b>{SPOTS[i].text}</p>
    </>
  );
}

/* ---------- Sexual health: discreet parcel ---------- */
const Tile = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <li className="dtile"><i className="dtile__ic"><svg viewBox="0 0 24 24">{icon}</svg></i><span>{children}</span></li>
);
export function DiscreetRow() {
  return (
    <div className="discreet-row">
      <ul className="dtiles" aria-label="Private care">
        <Tile icon={<><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></>}>Private online visit</Tile>
        <Tile icon={<><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>}>Licensed provider review</Tile>
        <Tile icon={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}>No waiting rooms</Tile>
      </ul>
      <div className="parcel-stage" aria-hidden="true">
        <div className="parcel-glow" />
        <div className="parcel">
          <div className="parcel__face parcel__face--front"><i className="tape" /></div>
          <div className="parcel__face parcel__face--back"><i className="tape" /></div>
          <div className="parcel__face parcel__face--right" />
          <div className="parcel__face parcel__face--left" />
          <div className="parcel__face parcel__face--top"><i className="tape tape--top" /></div>
          <div className="parcel__face parcel__face--bottom" />
        </div>
        <div className="parcel-shadow" />
      </div>
      <ul className="dtiles" aria-label="Discreet delivery">
        <Tile icon={<><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>}>Discreet packaging</Tile>
        <Tile icon={<><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V5a3 3 0 016 0v2M12 11v5M9.5 13.5h5" /></>}>Licensed U.S. pharmacy</Tile>
        <Tile icon={<><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></>}>HIPAA-aligned privacy</Tile>
      </ul>
    </div>
  );
}
