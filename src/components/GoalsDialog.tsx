import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { areaIntake } from '../data/intake';
import { CATEGORIES } from '../data/treatments';
import { SmartLink } from './Bits';
import { ArrowRight, Close } from './Icons';
import { LineMark } from './LineMark';
import { Logo } from './Logo';
import { useUi } from './UiContext';

const THUMB: Record<string, { cls: string; img: string }> = {
  'weight-management': { cls: 'teal', img: '/assets/img/weight-woman.webp' },
  skincare: { cls: 'sand', img: '/assets/img/skincare-woman.webp' },
  'hair-loss': { cls: 'sky', img: '/assets/img/hairloss-man.webp' },
  peptides: { cls: 'photo', img: '/assets/img/card-peptides.webp' },
  'sexual-health': { cls: 'photo', img: '/assets/img/sexual-couple.webp' },
  hrt: { cls: 'photo', img: '/assets/img/sections/hrt-model.webp' },
};

/** Full-screen treatment chooser, opened by every general "Start your visit" button. */
export function GoalsDialog() {
  const { goalsOpen, closeGoals } = useUi();
  const ref = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    if (!goalsOpen) return;
    lastFocus.current = document.activeElement;
    document.documentElement.classList.add('goals-open');
    const t = setTimeout(() => ref.current?.focus({ preventScroll: true }), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGoals();
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('a, button')];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('goals-open');
      (lastFocus.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [goalsOpen, closeGoals]);

  return (
    <AnimatePresence>
      {goalsOpen && (
        <motion.div
          ref={ref}
          className="goals is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goalsTitle"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <LineMark className="goals__mark" />
          <div className="goals__bar">
            <Logo tone="light" onClick={closeGoals} />
            <button type="button" className="goals__close" onClick={closeGoals} aria-label="Close"><Close /></button>
          </div>

          <div className="goals__body">
            <motion.p className="goals__kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}>
              Start your online visit
            </motion.p>
            <motion.h2 className="goals__title" id="goalsTitle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.8 }}>
              What can we help you <em>with?</em>
            </motion.h2>
            <motion.p className="goals__lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>
              Choose a treatment area to begin. A licensed provider reviews every intake.
            </motion.p>

            <ul className="goals__list">
              {CATEGORIES.map((c, i) => (
                <motion.li
                  key={c.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SmartLink className="goal" to={areaIntake(c.slug)} onClick={closeGoals}>
                    <span className={`goal__thumb goal__thumb--${THUMB[c.slug].cls}`}><img src={THUMB[c.slug].img} alt="" loading="lazy" /></span>
                    <span className="goal__text"><b>{c.name === 'HRT' ? 'Hormone Therapy (HRT)' : c.name}</b><small>{c.blurb}</small></span>
                    <span className="goal__arrow" aria-hidden="true"><ArrowRight /></span>
                  </SmartLink>
                </motion.li>
              ))}
            </ul>

            <p className="goals__note">Treatment is not guaranteed. Not for emergencies. If you are experiencing a medical emergency, call 911.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
