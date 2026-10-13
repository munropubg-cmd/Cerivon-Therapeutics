import { motion, useReducedMotion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PanelBtn, SmartLink } from '../components/Bits';
import { ArrowRight, Chat, Clipboard, Flask, Shield, Stethoscope, Truck } from '../components/Icons';
import { LineMark } from '../components/LineMark';
import { TreatmentCard } from '../components/TreatmentCard';
import { productIntake } from '../data/intake';
import { COMPOUNDED_DISCLOSURE, HRT_NOTE, NOT_GUARANTEED, ROLE_DISCLOSURE } from '../data/site';
import { categoryBySlug, categoryPath, treatmentBySlug, treatmentsIn } from '../data/treatments';
import { R } from '../hooks/useReveal';
import { FinalCta } from '../sections/Sections';
import { usePageMeta } from './usePageMeta';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TreatmentPage() {
  const { category, slug } = useParams();
  const t = treatmentBySlug(slug);
  const cat = categoryBySlug(t?.category);
  const reduce = useReducedMotion();
  usePageMeta(t?.name ?? 'Treatment', t?.description);
  if (!t || !cat || t.category !== category) return <Navigate to={cat ? categoryPath(cat.slug) : '/'} replace />;

  const isHrt = t.category === 'hrt';
  const catName = cat.name === 'HRT' ? 'Hormone Therapy (HRT)' : cat.name;
  const others = treatmentsIn(t.category).filter((x) => x.slug !== t.slug);
  const words = t.name.split(' ');
  const start = productIntake(t.slug);
  const fade = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: EASE } });

  const steps = [
    { icon: <Clipboard />, title: 'Online intake', text: 'Share your health history, medications and goals in a private intake.' },
    { icon: <Stethoscope />, title: 'Provider review', text: `A licensed provider reviews your intake${isHrt ? ' and orders lab testing where appropriate' : ''} and may ask follow-up questions.` },
    { icon: <Truck />, title: 'Treatment plan', text: 'If treatment is appropriate, your prescription is filled and shipped by a licensed U.S. pharmacy.' },
    { icon: <Chat />, title: 'Ongoing care', text: 'Follow-up check-ins and messaging with your care team before any refill.' },
  ];

  return (
    <div className={`tp tp--${cat.theme}`}>
      <section className="tp-hero">
        <div className="container">
          <div className="tp-hero__panel">
            <LineMark className="tp-hero__mark" />
            <div className="tp-hero__media" aria-hidden="true">
              <div className="tp-hero__glow" />
              <motion.img
                key={t.slug}
                src={t.image}
                alt=""
                className="tp-hero__img"
                initial={reduce ? false : { opacity: 0, y: 40, rotate: -6, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: EASE }}
              />
              <div className="tp-hero__shadow" />
            </div>

            <div className="tp-hero__info">
              <motion.nav className="crumbs" aria-label="Breadcrumb" {...fade(0)}>
                <Link to="/">Home</Link><span aria-hidden="true">/</span>
                <Link to={categoryPath(cat.slug)}>{catName}</Link><span aria-hidden="true">/</span>
                <span>{t.name}</span>
              </motion.nav>
              <motion.p className="tp-hero__eyebrow" {...fade(0.05)}>{catName}</motion.p>
              <motion.h1 className="tp-hero__title" {...fade(0.1)}>
                {words.length > 1 ? <>{words.slice(0, -1).join(' ')} <em>{words[words.length - 1]}</em></> : <em>{t.name}</em>}
              </motion.h1>
              <motion.ul className="tp-chips" {...fade(0.18)}>
                <li>{t.meta.split(' · ')[0]}</li>
                <li>{t.form}</li>
                <li>{t.tag}</li>
                {t.compounded && <li className="tp-chips__flag">Compounded</li>}
              </motion.ul>
              <motion.p className="tp-hero__desc" {...fade(0.24)}>{t.description}</motion.p>
              <motion.div className="tp-hero__cta" {...fade(0.32)}>
                <PanelBtn tone={['ocean', 'dusk', 'teal'].includes(cat.theme) ? 'light' : 'dark'} to={start}>Start treatment</PanelBtn>
                <Link to="/faq" className="link-arrow">Questions? Read our FAQs <ArrowRight /></Link>
              </motion.div>
              <motion.ul className="tp-trust" {...fade(0.4)}>
                <li><Shield />Licensed provider review</li>
                {isHrt && <li><Flask />Labs where appropriate</li>}
                <li><Truck />Licensed U.S. pharmacy</li>
              </motion.ul>
              <motion.p className="tp-hero__fine" {...fade(0.46)}>{NOT_GUARANTEED}</motion.p>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-details">
        <div className="container">
          <R className="tp-grid" kind="stagger">
            <article className="tp-card" style={{ ['--i' as string]: 0 }}>
              <p className="tp-card__kicker">What it is</p>
              <p>{t.description}</p>
            </article>
            <article className="tp-card" style={{ ['--i' as string]: 1 }}>
              <p className="tp-card__kicker">How it's used</p>
              <p>{t.usage}</p>
              <p className="tp-card__small">Your provider explains dosing, use and any precautions if treatment is prescribed.</p>
            </article>
            <article className="tp-card tp-card--accent" style={{ ['--i' as string]: 2 }}>
              <p className="tp-card__kicker">{isHrt ? 'Before you start' : 'Your provider decides'}</p>
              <p>{isHrt ? HRT_NOTE : 'A licensed provider reviews your intake and decides whether this treatment is appropriate for you. Treatment is not guaranteed.'}</p>
              <SmartLink to={start} className="link-arrow">Start treatment <ArrowRight /></SmartLink>
            </article>
          </R>

          <div className="tp-journey">
            <R as="h2" className="tp-journey__title">How your care works</R>
            <R as="ol" className="tp-steps" kind="stagger">
              {steps.map((s, i) => (
                <li key={s.title} className="tp-step" style={{ ['--i' as string]: i }}>
                  <span className="tp-step__icon">{s.icon}</span>
                  <span className="tp-step__num">0{i + 1}</span>
                  <b>{s.title}</b>
                  <p>{s.text}</p>
                </li>
              ))}
            </R>
          </div>

          <R className="tp-notes">
            {t.compounded && <p><b>Compounded medication.</b> {COMPOUNDED_DISCLOSURE}</p>}
            {isHrt && <p><b>Hormone therapy.</b> {HRT_NOTE}</p>}
            <p><b>About {`Cerivon Therapeutics`}.</b> {ROLE_DISCLOSURE}</p>
            {t.pending && <p className="tp-notes__todo">Before launch: {t.pending}</p>}
          </R>

          {others.length > 0 && (
            <div className="tp-more">
              <R className="tp-more__head">
                <h2 className="tp-journey__title">More in {catName}</h2>
                <Link to={categoryPath(cat.slug)} className="link-arrow">View all <ArrowRight /></Link>
              </R>
              <R className={`tp-more__cards tp-more__cards--${Math.min(others.length, 3)}`} kind="stagger">
                {others.slice(0, 3).map((o, i) => <TreatmentCard key={o.slug} t={o} i={i} />)}
              </R>
            </div>
          )}
        </div>
      </section>
      <FinalCta />
    </div>
  );
}
