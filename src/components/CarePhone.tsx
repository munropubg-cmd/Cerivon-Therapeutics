import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/*
 * HRT "care app" phone: an original concept (not the ViaRx mini phone).
 * Three scenes loop while the phone is on screen:
 *   0 Lab day        → ring fills as the lab kit moves through its steps
 *   1 Your panel     → each marker flips from pending to reviewed
 *   2 Provider note  → typing dots, a message, then the care plan card with a tap
 * The Dynamic Island morphs into a live activity for each scene. No lab values are shown.
 */
const EASE = [0.16, 1, 0.3, 1] as const;
const SCENE_MS = 4200;
const DOC = 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=120&h=120&fit=crop&crop=faces&q=70';
const MARKERS = ['Estradiol', 'Progesterone', 'DHEA-S', 'TSH', 'Free T3', 'Free T4'];

const ISLAND = [
  { icon: 'kit', label: 'Lab kit', status: 'Kit at the lab' },
  { icon: 'flask', label: 'Labs received', status: 'In review' },
  { icon: 'avatar', label: 'Your provider', status: 'New note' },
];

const Icon = ({ name }: { name: string }) => {
  const p: Record<string, JSX.Element> = {
    kit: <><path d="M4 8l8-4 8 4v8l-8 4-8-4z" /><path d="M4 8l8 4 8-4M12 12v8" /></>,
    flask: <><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3" /><path d="M7.5 15h9" /></>,
    home: <><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-6h4v6" /></>,
    chat: <><path d="M4 5h16v11H9l-5 4z" /></>,
    check: <path d="M5 12.5l4.2 4.2L19 7" />,
    drop: <path d="M12 3s6 6.4 6 11a6 6 0 01-12 0c0-4.6 6-11 6-11z" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{p[name]}</svg>;
};

function LabDay() {
  const steps = ['Kit shipped', 'Sample collected', 'At the lab'];
  return (
    <div className="cp-scene">
      <p className="cp-kicker">Hormone care</p>
      <p className="cp-title">Lab day</p>
      <div className="cp-ring">
        <svg viewBox="0 0 140 140">
          <circle className="cp-ring__track" cx="70" cy="70" r="58" />
          <motion.circle
            className="cp-ring__fill" cx="70" cy="70" r="58" pathLength={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.6, delay: 0.3, ease: EASE }}
          />
        </svg>
        <motion.span className="cp-ring__core" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}>
          <Icon name="drop" />
        </motion.span>
        <motion.span className="cp-ring__done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.7, duration: 0.5 }}>
          Sample received
        </motion.span>
      </div>
      <ol className="cp-steps">
        {steps.map((s, i) => (
          <motion.li key={s} initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.8 }}>
            <motion.i initial={{ scale: 0.4, backgroundColor: 'rgba(255,255,255,0.14)' }} animate={{ scale: 1, backgroundColor: 'rgba(82,220,225,1)' }} transition={{ delay: 0.5 + i * 0.8, type: 'spring', stiffness: 300, damping: 16 }}>
              <Icon name="check" />
            </motion.i>
            <span>{s}</span>
          </motion.li>
        ))}
        <motion.b className="cp-steps__bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 1.8, ease: EASE }} />
      </ol>
    </div>
  );
}

function Panel() {
  return (
    <div className="cp-scene">
      <p className="cp-kicker">Your lab panel</p>
      <p className="cp-title">Reviewed by your provider</p>
      <div className="cp-grid">
        {MARKERS.map((m, i) => (
          <motion.div key={m} className="cp-tile" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: EASE }}>
            <span className="cp-tile__name">{m}</span>
            <span className="cp-tile__state">
              <motion.span className="cp-spin" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.9 + i * 0.32, duration: 0.2 }} />
              <motion.span className="cp-ok" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 + i * 0.32, type: 'spring', stiffness: 420, damping: 18 }}>
                <Icon name="check" />
              </motion.span>
            </span>
          </motion.div>
        ))}
        <motion.span className="cp-sweep" initial={{ x: '-120%' }} animate={{ x: '220%' }} transition={{ delay: 0.4, duration: 1.6, ease: 'easeInOut' }} />
      </div>
      <motion.p className="cp-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
        All markers reviewed
      </motion.p>
    </div>
  );
}

function Note() {
  return (
    <div className="cp-scene">
      <div className="cp-doc">
        <span className="cp-doc__ava"><img src={DOC} alt="" /><i /></span>
        <span><b>Your provider</b><small>Licensed provider · online</small></span>
      </div>
      <div className="cp-chat">
        <motion.div className="cp-typing" initial={{ opacity: 1 }} animate={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ delay: 1.1, duration: 0.3 }}>
          {[0, 1, 2].map((d) => (
            <motion.i key={d} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: 2, delay: d * 0.12 }} />
          ))}
        </motion.div>
        <motion.p className="cp-bubble" initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.2, duration: 0.6, ease: EASE }}>
          I've reviewed your history and labs. Your care plan is ready to go over together.
        </motion.p>
      </div>
      <motion.div className="cp-plan" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.7, ease: EASE }}>
        <p className="cp-plan__k">Your care plan</p>
        <ul><li>Provider-led</li><li>Ongoing check-ins</li></ul>
        <motion.span className="cp-btn" animate={{ scale: [1, 1, 0.94, 1] }} transition={{ delay: 2.9, duration: 0.5, times: [0, 0.3, 0.6, 1] }}>
          View my plan
          <motion.i className="cp-tap" initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 3, opacity: 0 }} transition={{ delay: 3.05, duration: 0.7 }} />
        </motion.span>
      </motion.div>
    </div>
  );
}

const SCENES = [LabDay, Panel, Note];

export function CarePhone() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => setScene((s) => (s + 1) % SCENES.length), SCENE_MS);
    return () => clearInterval(id);
  }, [visible, reduce]);

  const Scene = SCENES[scene];
  const isl = ISLAND[scene];

  return (
    <div className="cp" ref={ref} aria-hidden="true">
      <div className="cp__screen">
        <div className="cp-status">
          <b>9:41</b>
          <span className="cp-status__icons"><i /><i /><i /></span>
        </div>

        {/* Dynamic Island → live activity */}
        <motion.div className="cp-island" layout transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={scene} className="cp-island__row" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.35 }}>
              <span className="cp-island__ic">{isl.icon === 'avatar' ? <img src={DOC} alt="" /> : <Icon name={isl.icon} />}</span>
              <span className="cp-island__st">{isl.status}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="cp-body">
          <AnimatePresence mode="wait">
            <motion.div key={scene} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: EASE }}>
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>

        <nav className="cp-tabs">
          {[{ n: 'home', l: 'Care' }, { n: 'flask', l: 'Labs' }, { n: 'chat', l: 'Messages' }].map((t, i) => (
            <span key={t.l} className={`cp-tab${i === scene ? ' is-on' : ''}`}>
              {i === scene && <motion.b className="cp-tab__pill" layoutId="cp-tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <Icon name={t.n} />
              <small>{t.l}</small>
            </span>
          ))}
        </nav>
        <span className="cp-home" />
      </div>
    </div>
  );
}
