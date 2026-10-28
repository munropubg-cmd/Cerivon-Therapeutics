import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Link } from 'react-router-dom';
import { BrandPattern, SymbolMark } from '../components/BrandPattern';
import { GoalsBtn, PrimaryBtn, RoleNote, SmartLink } from '../components/Bits';
import { ArrowRight, Chat, Shield, Stethoscope } from '../components/Icons';
import { useJourneyPhone } from '../components/JourneyPhone';
import { LineMark } from '../components/LineMark';
import { areaIntake, productIntake } from '../data/intake';
import { PHOTOS, pic, picSet } from '../data/photos';
import { PARTNERS } from '../data/site';
import { CATEGORIES, categoryPath, treatmentsIn, type CategorySlug } from '../data/treatments';
import { R, Split, useReveal } from '../hooks/useReveal';

const EASE = [0.16, 1, 0.3, 1] as const;
const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>;

/* ==========================================================================
   1. Hero (ReviveX layout): full-screen photo under a transparent header, headline left,
      provider / pharmacy / follow-up list and a rotating product card on the right.
   ========================================================================== */
const FEATURES = [
  { icon: <Stethoscope />, text: 'Licensed provider review' },
  { icon: <Shield />, text: 'Filled by a licensed pharmacy' },
  { icon: <Chat />, text: 'Ongoing follow-up care' },
];
const FEATURED = [
  { slug: 'semaglutide', area: 'Compounded weight management', name: 'Semaglutide' },
  { slug: 'nad', area: 'Compounded peptides and wellness', name: 'NAD+' },
  { slug: 'tretinoin-cream', area: 'Prescription skincare', name: 'Tretinoin' },
];

function FeaturedCard() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % FEATURED.length), 4200);
    return () => window.clearInterval(id);
  }, [reduce]);
  const f = FEATURED[i];
  return (
    <motion.div className="lh__product-wrap" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1.3, ease: EASE }}>
      <SmartLink to={productIntake(f.slug)} className="lh__product" aria-label={`${f.name}: see if I qualify`}>
        <span className="lh__product-top">
          <AnimatePresence mode="wait" initial={false}>
            <motion.small key={f.area} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>{f.area}</motion.small>
          </AnimatePresence>
          <span className="lh__plus" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" /></svg></span>
        </span>
        <span className="lh__product-img">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img key={f.slug} src={`/assets/img/products/${f.slug}.webp`} alt="" initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.96 }} transition={{ duration: 0.55, ease: EASE }} />
          </AnimatePresence>
        </span>
        <span className="lh__product-foot">
          <b>{f.name}</b>
          <span>See if I qualify</span>
        </span>
        <span className="lh__dots" aria-hidden="true">{FEATURED.map((x, n) => <i key={x.slug} className={n === i ? 'is-on' : ''} />)}</span>
      </SmartLink>
    </motion.div>
  );
}

export function LifeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const appear = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });
  return (
    <section className="lh" ref={ref} aria-labelledby="lh-title">
      <motion.div className="lh__media" style={reduce ? undefined : { y: imgY }}>
        <motion.img
          src={PHOTOS.hero}
          alt="A woman in her forties smiling with her face to the sun"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </motion.div>
      <div className="lh__veil" />
      <BrandPattern className="lh__pattern" />

      <motion.div className="container lh__inner" style={reduce ? undefined : { y: contentY, opacity: fade }}>
        <div className="lh__left">
          <motion.span {...appear(0.3)} className="lh__eyebrow"><span className="lh__ping" />Online care from licensed providers</motion.span>
          <h1 className="lh__title" id="lh-title">
            <motion.span className="line" {...appear(0.45)}>Care designed</motion.span>
            <motion.span className="line" {...appear(0.6)}>around <em>you.</em></motion.span>
          </h1>
          <motion.div {...appear(0.9)} className="lh__btns">
            <GoalsBtn className="btn btn--primary lh__cta">Start your online visit</GoalsBtn>
          </motion.div>
          <motion.p {...appear(1.1)} className="lh__lede">
            Cerivon connects you with licensed providers for online medical evaluations. When it's appropriate,
            your provider prescribes treatment, and a licensed pharmacy delivers it to your door.
          </motion.p>
        </div>

        <div className="lh__right">
          <ul className="lh__features">
            {FEATURES.map((f, n) => (
              <motion.li key={f.text} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 1 + n * 0.12, ease: EASE }}>
                <span>{f.icon}</span>{f.text}
              </motion.li>
            ))}
          </ul>
          <FeaturedCard />
        </div>
      </motion.div>
    </section>
  );
}

/* ==========================================================================
   3. Explore treatment areas: one consistent layout for every category,
      people first, a short introduction, then the dedicated page or the intake.
   ========================================================================== */
const AREA: Record<CategorySlug, { photo: string | number; pos: string; label: string; goal: string; accent: string; alt: string }> = {
  'weight-management': { photo: PHOTOS.weight, pos: '62% 30%', label: 'Weight Management', goal: 'Managing my weight', accent: '#2BA9B4', alt: 'A woman in her forties running by the sea' },
  skincare: { photo: PHOTOS.skincare, pos: '50% 30%', label: 'Skincare', goal: 'Caring for my skin', accent: '#C2607E', alt: 'A woman in her forties smiling, touching the skin by her eye' },
  'hair-loss': { photo: PHOTOS.hair, pos: '50% 25%', label: 'Hair Loss', goal: 'Thinning hair', accent: '#3E7FB0', alt: 'A man in his forties running a hand through his hair in the evening sun' },
  hrt: { photo: PHOTOS.hrt, pos: '38% 30%', label: 'Hormone Therapy', goal: 'Hormone changes', accent: '#258F9F', alt: 'A woman in her forties at home with her eyes closed' },
  'sexual-health': { photo: PHOTOS.sexual, pos: '50% 35%', label: 'Sexual Health', goal: 'Intimacy and sexual health', accent: '#3A5BA0', alt: 'A couple embracing' },
  peptides: { photo: PHOTOS.peptides, pos: '55% 30%', label: 'Peptides & Wellness', goal: 'Overall wellness', accent: '#4E9A8A', alt: 'A woman stretching in a warm, sunlit studio' },
};
const ORDER: CategorySlug[] = ['weight-management', 'skincare', 'hair-loss', 'hrt', 'sexual-health', 'peptides'];

/** Short display names for the "may include" chips. */
const shortName = (n: string) => n.replace(/^Compounded /, '').replace(/ \(Topical\)$/, '');

export function CareExplorer() {
  const [active, setActive] = useState<CategorySlug>('weight-management');
  const cat = CATEGORIES.find((c) => c.slug === active)!;
  const a = AREA[active];
  const names = treatmentsIn(active).map((t) => shortName(t.name));
  return (
    <section className="cx" id="treatments" aria-labelledby="cx-title">
      <BrandPattern className="cx__pattern" />
      <div className="container">
        <div className="cx__head">
          <div>
            <R as="p" className="kicker">Treatment areas</R>
            <Split as="h2" className="h-section" id="cx-title" lines={['Care for every', <>stage of <em>life</em></>]} />
          </div>
          <R as="p" className="cx__lede">
            Every visit starts with your health, your history and your goals. Tell us what brings you here,
            and we'll show you how care works for it.
          </R>
        </div>

        <R as="p" className="cx__ask" id="cx-ask">What brings you here today?</R>
        <R className="cx__tabs" role="tablist" aria-labelledby="cx-ask">
          {ORDER.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={s === active}
              className={`cx__tab${s === active ? ' is-on' : ''}`}
              style={{ ['--acc' as string]: AREA[s].accent }}
              onClick={() => setActive(s)}
            >
              {s === active && <motion.span className="cx__tab-bg" layoutId="cx-tab" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="cx__tab-dot" />{AREA[s].goal}
            </button>
          ))}
        </R>

        <R className="cx__stage" style={{ ['--acc' as string]: a.accent }}>
          <div className="cx__media">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={active}
                src={pic(a.photo, 1100, 900)}
                srcSet={picSet(a.photo, 1100, 900)}
                alt={a.alt}
                style={{ objectPosition: a.pos }}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </AnimatePresence>
            <span className="cx__badge"><SymbolMark />Provider-guided</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="cx__info"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="cx__area"><span />{a.label}</p>
              <h3 className="cx__title">{cat.blurb}</h3>
              <p className="cx__text">{cat.intro}</p>
              <p className="cx__label">Treatment options may include</p>
              <ul className="cx__chips">
                {names.map((n) => <li key={n}>{n}</li>)}
              </ul>
              <div className="cx__btns">
                <PrimaryBtn to={areaIntake(active)}>Start your visit</PrimaryBtn>
                <Link to={categoryPath(active)} className="link-arrow">Explore {a.label.toLowerCase()} <ArrowRight /></Link>
              </div>
              <p className="cx__note">Treatment is prescribed only if a licensed provider determines it's appropriate.</p>
            </motion.div>
          </AnimatePresence>
        </R>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. How it works: the four steps, side by side with the live phone.
   ========================================================================== */
const HOW_TEXT = [
  'Answer questions about your health, history and goals from any device. It is private and takes a few minutes.',
  'An independent, licensed provider reviews your intake, and may follow up with questions or order lab work.',
  'If treatment is right for you, your provider writes a prescription. Treatment is never guaranteed.',
  'A licensed pharmacy fills and ships your prescription discreetly, and your care continues with follow-ups as applicable.',
];

export function HowItWorks() {
  const { card, idx, setIdx, steps, phone } = useJourneyPhone('general');
  const [ref, inView] = useReveal<HTMLDivElement>(0.12);
  const setRefs = (el: HTMLDivElement | null) => {
    (card as MutableRefObject<HTMLDivElement | null>).current = el;
    (ref as MutableRefObject<HTMLDivElement | null>).current = el;
  };
  return (
    <section className="how" id="how" aria-labelledby="how-title">
      <BrandPattern className="how__pattern" />
      <div className="container">
        <div className="how__head">
          <R as="p" className="kicker">How it works</R>
          <Split as="h2" className="h-section" id="how-title" lines={['What happens after you', <>start your <em>visit</em></>]} />
          <R as="p" className="how__lede">Four simple steps, from your first answer to ongoing care. You can stop at any point.</R>
        </div>

        <div className={`how__grid${inView ? ' is-in' : ''}`} ref={setRefs}>
          <ol className="how__steps">
            {steps.map((s, i) => (
              <li key={s} className={i === idx ? 'is-on' : ''}>
                <button type="button" onClick={() => setIdx(i)} aria-current={i === idx ? 'step' : undefined}>
                  <span className="how__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="how__txt">
                    <b>{s}</b>
                    <span>{HOW_TEXT[i]}</span>
                  </span>
                  {i === idx && <motion.i className="how__bar" layoutId="how-bar" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                </button>
              </li>
            ))}
          </ol>
          <div className="how__phone">
            <div className="how__halo" />
            <LineMark className="how__mark" />
            {phone}
          </div>
        </div>

        <R className="how__foot">
          <GoalsBtn>Start your online visit</GoalsBtn>
          <RoleNote className="how__role" />
        </R>
      </div>
    </section>
  );
}

/* ==========================================================================
   5. Providers, pharmacy and ongoing support: who does what.
   ========================================================================== */
const TEAM = [
  { icon: <Stethoscope />, role: 'Licensed providers', who: PARTNERS.clinical.name, text: 'Independent, U.S.-licensed providers evaluate every intake and make all treatment decisions.' },
  { icon: <Shield />, role: 'Licensed pharmacy', who: PARTNERS.pharmacy.name, text: 'Prescriptions are filled by a licensed pharmacy and shipped to your door in discreet packaging.' },
  { icon: <Chat />, role: 'Ongoing support', who: 'Cerivon care team', text: 'Help with your account, orders and next steps, with follow-up care as your plan continues.' },
];

export function CareTeam() {
  return (
    <section className="ct" aria-labelledby="ct-title">
      <div className="container ct__grid">
        <R className="ct__media">
          <img src={pic(PHOTOS.careTeam, 1000, 1150)} srcSet={picSet(PHOTOS.careTeam, 1000, 1150)} alt="A couple in their sixties completing an online visit together on a laptop" loading="lazy" />
          <div className="ct__chip ct__chip--a"><i><Check /></i><span><b>Intake submitted</b><small>Private and secure</small></span></div>
          <div className="ct__chip ct__chip--b"><SymbolMark /><span><b>Provider review</b><small>Licensed clinician</small></span></div>
        </R>
        <div className="ct__copy">
          <R as="p" className="kicker">Your care team</R>
          <Split as="h2" className="h-section" id="ct-title" lines={['Real providers.', <>A licensed <em>pharmacy</em>.</>]} />
          <R as="p" className="ct__lede">
            Cerivon brings everything together in one simple online experience, so you always know who is
            looking after you and what happens next.
          </R>
          <R as="ul" className="ct__list" kind="stagger">
            {TEAM.map((t, i) => (
              <li key={t.role} style={{ ['--i' as string]: i }}>
                <span className="ct__ic">{t.icon}</span>
                <span>
                  <small>{t.role}</small>
                  <b>{t.who}</b>
                  <span>{t.text}</span>
                </span>
              </li>
            ))}
          </R>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   6. The Cerivon experience: what care looks like day to day.
   ========================================================================== */
export function Experience() {
  return (
    <section className="xp" aria-labelledby="xp-title">
      <div className="container">
        <div className="xp__head">
          <R as="p" className="kicker">The Cerivon experience</R>
          <Split as="h2" className="h-section" id="xp-title" lines={['Care that fits', <>into real <em>life</em></>]} />
        </div>
        <R className="xp__grid" kind="stagger">
          <article className="xp__tile xp__tile--photo xp__tile--a" style={{ ['--i' as string]: 0 }}>
            <img src={pic(PHOTOS.experienceHome, 1100, 900)} srcSet={picSet(PHOTOS.experienceHome, 1100, 900)} alt="A woman in her fifties starting an online visit from her sofa" loading="lazy" />
            <div className="xp__ui xp__ui--progress">
              <small>Your intake</small>
              <b>Step 3 of 4</b>
              <span><i /></span>
            </div>
            <div className="xp__cap"><h3>Start from home</h3><p>No waiting rooms. Complete your visit whenever it suits you.</p></div>
          </article>

          <article className="xp__tile xp__tile--chat" style={{ ['--i' as string]: 1 }}>
            <h3>Questions along the way</h3>
            <p>Stay in touch with your care team as your plan continues.</p>
            <div className="xp__bubbles">
              <span className="xp__bubble xp__bubble--me">Can I ask about my next refill?</span>
              <span className="xp__bubble">Of course. Your provider will review it at your next check-in.</span>
            </div>
          </article>

          <article className="xp__tile xp__tile--brand" style={{ ['--i' as string]: 2 }}>
            <BrandPattern className="xp__brand-pattern" />
            <div className="xp__box">
              <span className="xp__box-top" />
              <span className="xp__box-face"><img src="/brand/cerivon-logo-reverse.svg" alt="Cerivon Therapeutics" /></span>
            </div>
            <div className="xp__cap xp__cap--light"><h3>Delivered with care</h3><p>Shipped by a licensed pharmacy in discreet packaging.</p></div>
          </article>

          <article className="xp__tile xp__tile--photo xp__tile--d" style={{ ['--i' as string]: 3 }}>
            <img src={pic(PHOTOS.experienceLife, 1100, 900)} srcSet={picSet(PHOTOS.experienceLife, 1100, 900)} alt="A woman in her forties enjoying a calm moment at home" loading="lazy" />
            <div className="xp__ui xp__ui--checkin"><i><Check /></i><span><b>Check-in complete</b><small>Next follow-up scheduled</small></span></div>
            <div className="xp__cap"><h3>Care that continues</h3><p>Follow-ups keep your plan in step with you.</p></div>
          </article>
        </R>
      </div>
    </section>
  );
}

/** Final call to action with a real couple behind it. */
export function LifeCta() {
  return (
    <section className="lcta" aria-labelledby="lcta-title">
      <div className="container">
        <R className="lcta__panel">
          <img className="lcta__photo" src={PHOTOS.cta} alt="" loading="lazy" />
          <div className="lcta__veil" />
          <BrandPattern className="lcta__pattern" />
          <div className="lcta__copy">
            <p className="kicker kicker--light">Ready when you are</p>
            <h2 className="h-section h-section--light" id="lcta-title">
              <span className="line"><span>Start your online visit</span></span>
              <span className="line"><span>in just a few <em>minutes</em></span></span>
            </h2>
            <p className="lcta__lede">Answer a few questions online. A licensed provider takes it from there.</p>
            <div className="lcta__btns">
              <GoalsBtn className="btn btn--light" icon={false}>Start your online visit</GoalsBtn>
              <Link to="/#how" className="btn btn--outline-light">How it works</Link>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}


