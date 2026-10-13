import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/*
 * How-it-works phone (inside the hand photo), a 2026-style companion app.
 * Each scene sits on its own rich colour with frosted-glass cards, bold type and spring motion:
 *   1 Intake          dusty rose     glass tiles, tap ripple, sheet slides up, note types in
 *   2 Provider review deep plum      clinician inside a sweeping ring, checklist lights up
 *   3 Your plan       coral peach    product floats up on glass, 3-stage progress fills
 *   4 Ongoing care    soft lilac     check-in slider, streak pills, provider reply, next check-in
 * A step capsule at the top morphs between steps. Cycles only while visible; reduced motion = still frame.
 */
const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 420, damping: 26 } as const;
const STEP_MS = 4600;
const STEPS = ['Online intake', 'Provider review', 'Your treatment plan', 'Ongoing care'];
const DOC = 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=220&h=220&fit=crop&crop=faces&q=70';

const Icon = ({ d }: { d: ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{d}</svg>
);
const CHECK = <path d="M5 12.5l4.2 4.2L19 7" />;

/** Types a string out character by character after `delay` seconds. */
function Typewriter({ text, delay, speed = 32 }: { text: string; delay: number; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    let id: number | undefined;
    const t = window.setTimeout(() => {
      id = window.setInterval(() => { i += 1; setN(i); if (i >= text.length) window.clearInterval(id); }, speed);
    }, delay * 1000);
    return () => { window.clearTimeout(t); window.clearInterval(id); };
  }, [text, delay, speed]);
  return <>{text.slice(0, n)}<i className="jx-caret" /></>;
}

/* ---------- 1. Intake (dusty rose) ---------- */
function Intake() {
  const tiles = [
    { k: 'Skin', d: <><circle cx="12" cy="12" r="7.5" /><path d="M9 10h.01M15 10h.01M9 14.5c1.6 1.4 4.4 1.4 6 0" /></> },
    { k: 'Hair', d: <><path d="M6 20c0-7 2-12 6-12s6 5 6 12" /><path d="M9 9c0-3 1.3-5 3-5s3 2 3 5" /></> },
    { k: 'Weight', d: <><rect x="4" y="5" width="16" height="15" rx="4" /><path d="M9 10a3 3 0 016 0" /><path d="M12 10l1.5-1.5" /></> },
    { k: 'Hormones', d: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="16" r="3" /><path d="M10.5 10.5l3 3" /></> },
  ];
  return (
    <div className="jx-body">
      <p className="jx-kick">Step 1 · Your intake</p>
      <p className="jx-h">What brings you in today?</p>
      <div className="jx-tiles">
        {tiles.map((t, i) => (
          <motion.div
            key={t.k}
            className="jx-tile"
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={i === 0
              ? { opacity: 1, y: 0, scale: [0.92, 1, 1, 0.94, 1], backgroundColor: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,1)'] }
              : { opacity: 1, y: 0, scale: 1 }}
            transition={i === 0 ? { delay: 0.1, duration: 1.5, times: [0, 0.3, 0.62, 0.72, 0.85] } : { ...SPRING, delay: 0.1 + i * 0.07 }}
          >
            <span className={`jx-tile__ic${i === 0 ? ' is-picked' : ''}`}><Icon d={t.d} /></span>
            <b className={i === 0 ? 'is-picked' : ''}>{t.k}</b>
            {i === 0 && (
              <>
                <motion.span className="jx-ripple" initial={{ scale: 0, opacity: 0.55 }} animate={{ scale: 4, opacity: 0 }} transition={{ delay: 1, duration: 0.7 }} />
                <motion.span className="jx-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...SPRING, delay: 1.3 }}><Icon d={CHECK} /></motion.span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div className="jx-sheet" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.7, duration: 0.6, ease: EASE }}>
        <small>Anything else we should know?</small>
        <p><Typewriter text="Sensitive skin, new to retinoids" delay={2.1} /></p>
      </motion.div>
      <motion.span className="jx-cta" animate={{ scale: [1, 1, 0.95, 1] }} transition={{ delay: 3.6, duration: 0.45, times: [0, 0.3, 0.6, 1] }}>
        Continue
      </motion.span>
    </div>
  );
}

/* ---------- 2. Provider review (deep plum) ---------- */
function Review() {
  const rows = ['Health history', 'Your goals', 'Medications'];
  const R = 46, C = 2 * Math.PI * R;
  return (
    <div className="jx-body jx-body--center">
      <p className="jx-kick">Step 2 · Provider review</p>
      <div className="jx-orbit">
        <svg viewBox="0 0 110 110" className="jx-ring">
          <circle cx="55" cy="55" r={R} className="jx-ring__track" />
          <motion.circle
            cx="55" cy="55" r={R} className="jx-ring__fill"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.6, delay: 0.2, ease: EASE }}
          />
        </svg>
        <img src={DOC} alt="" className="jx-ava" />
        <motion.span className="jx-ava__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...SPRING, delay: 2.8 }}><Icon d={CHECK} /></motion.span>
      </div>
      <p className="jx-h jx-h--sm">Your provider is reviewing</p>
      <ul className="jx-rows">
        {rows.map((r, i) => (
          <motion.li key={r} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.55, duration: 0.5, ease: EASE }}>
            {r}
            <motion.i initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...SPRING, delay: 0.9 + i * 0.55 }}><Icon d={CHECK} /></motion.i>
          </motion.li>
        ))}
      </ul>
      <motion.span
        className="jx-pill"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, boxShadow: ['0 0 0 0 rgba(255,205,222,0)', '0 0 0 0 rgba(255,205,222,0)', '0 0 24px 2px rgba(255,205,222,.5)'] }}
        transition={{ delay: 2.9, duration: 0.8 }}
      >
        <Icon d={CHECK} />Review complete
      </motion.span>
    </div>
  );
}

/* ---------- 3. Your plan (coral peach) ---------- */
function Plan() {
  const stages = ['Prescribed', 'Filled', 'Shipped'];
  return (
    <div className="jx-body">
      <p className="jx-kick">Step 3 · Your plan</p>
      <p className="jx-h">Your plan is ready</p>
      <motion.div className="jx-product" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: EASE }}>
        <motion.img
          src="/assets/img/products/tretinoin-cream.webp" alt=""
          initial={{ y: 18, rotate: -6, scale: 0.9 }} animate={{ y: [18, -4, 0], rotate: [-6, 2, 0], scale: [0.9, 1.02, 1] }}
          transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
        />
        <motion.span className="jx-product__shadow" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }} />
        <span className="jx-product__meta"><b>Tretinoin</b><small>Topical cream</small></span>
        <motion.span className="jx-chip" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING, delay: 1.2 }}>
          Written by your provider
        </motion.span>
      </motion.div>
      <div className="jx-track">
        <span className="jx-track__bar"><motion.b initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.6, duration: 1.8, ease: EASE }} /></span>
        {stages.map((st, i) => (
          <motion.span key={st} className="jx-track__stop" initial={{ opacity: 0.45 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 + i * 0.75 }}>
            <motion.i initial={{ scale: 0.5, backgroundColor: 'rgba(255,255,255,0.3)' }} animate={{ scale: 1, backgroundColor: 'rgba(255,255,255,1)' }} transition={{ ...SPRING, delay: 1.7 + i * 0.75 }} />
            {st}
          </motion.span>
        ))}
      </div>
      <motion.span className="jx-cta jx-cta--rose" animate={{ scale: [1, 1, 0.95, 1] }} transition={{ delay: 3.8, duration: 0.45, times: [0, 0.3, 0.6, 1] }}>
        Review my plan
      </motion.span>
    </div>
  );
}

/* ---------- 4. Ongoing care (soft lilac) ---------- */
function Ongoing() {
  const moods = [0, 1, 2, 3, 4];
  const [pick, setPick] = useState(1);
  useEffect(() => { const t = window.setTimeout(() => setPick(3), 900); return () => window.clearTimeout(t); }, []);
  return (
    <div className="jx-body">
      <p className="jx-kick">Step 4 · Ongoing care</p>
      <p className="jx-h">Weekly check-in</p>
      <motion.div className="jx-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: EASE }}>
        <small>How are you feeling this week?</small>
        <div className="jx-mood">
          {moods.map((m) => (
            <span key={m} className={m === pick ? 'is-on' : ''}>
              {m === pick && <motion.b layoutId="jx-mood" transition={SPRING} />}
              <i style={{ height: `${8 + m * 3}px` }} />
            </span>
          ))}
        </div>
        <div className="jx-streak">
          {[0, 1, 2, 3].map((w) => (
            <motion.i key={w} initial={{ scaleY: 0.3, opacity: 0.4 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ ...SPRING, delay: 1.3 + w * 0.12 }} />
          ))}
          <small>4 check-ins</small>
        </div>
      </motion.div>
      <motion.div className="jx-msg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.5, ease: EASE }}>
        <img src={DOC} alt="" />
        <p><Typewriter text="Thanks for checking in. I'm here if anything changes." delay={2.2} speed={24} /></p>
      </motion.div>
      <motion.span className="jx-next" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING, delay: 3.6 }}>
        <Icon d={<><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>} />
        Next check-in scheduled
      </motion.span>
    </div>
  );
}

const SCENES = [Intake, Review, Plan, Ongoing];
const TONES = ['rose', 'plum', 'peach', 'lilac'];

/** Same API the How-it-works card uses: a ref for the card, the active step, the step labels and the phone. */
export function useJourneyPhone() {
  const card = useRef<HTMLDivElement>(null);
  const visible = useInView(card, { amount: 0.3 });
  const reduce = useReducedMotion();
  // dev only: ?jx=2 pins the phone on one scene for review
  const pin = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('jx') : null;
  const [idx, setIdx] = useState(pin ? Number(pin) % SCENES.length : 0);

  useEffect(() => {
    if (!visible || reduce || pin) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % SCENES.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [visible, reduce, pin]);

  const Scene = SCENES[idx];

  const phone = (
    <div className="hand-phone" aria-hidden="true">
      <div className="phone__glow" />
      <div className="hp">
        <div className="phone__screen jx-screen">
          {/* colour layers crossfade underneath the content */}
          {TONES.map((t, i) => (
            <motion.div key={t} className={`jx-bg jx-bg--${t}`} animate={{ opacity: i === idx ? 1 : 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} />
          ))}
          <div className="jx-status"><b>9:41</b><span><i /><i /><i /></span></div>
          <div className="jx-steps">
            {STEPS.map((s, i) => (
              <span key={s} className={i === idx ? 'is-on' : i < idx ? 'is-done' : ''}>
                {i === idx && <motion.b layoutId="jx-step" transition={SPRING} />}
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              className="jx-layer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="hp-key" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 -6 5.3 0" /></filter>
        </svg>
        <img className="hp__photo" src="https://images.unsplash.com/photo-1691256676376-357c3aa66c89?w=1400&q=80&auto=format" alt="" />
      </div>
    </div>
  );

  return { card, idx, steps: STEPS, phone };
}
