import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CompoundedNote, GoalsBtn, PanelBtn, RoleNote, SmartLink } from '../components/Bits';
import { GaugeArcs } from '../components/BmiDialog';
import { CarePhone } from '../components/CarePhone';
import { BodyMap, DiscreetRow, Orbit, Slider } from '../components/Features';
import { useJourneyPhone } from '../components/JourneyPhone';
import { ArrowRight } from '../components/Icons';
import { LineMark } from '../components/LineMark';
import { TreatmentCard } from '../components/TreatmentCard';
import { useUi } from '../components/UiContext';
import { FAQS } from '../data/faqs';
import { areaIntake } from '../data/intake';
import { HRT_NOTE, NOT_GUARANTEED } from '../data/site';
import { compoundedIn, treatmentsIn } from '../data/treatments';
import { R, Split, useReveal } from '../hooks/useReveal';

/** Gentle scroll parallax for section portraits and vials. */
function useDrift(range = 60) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return [ref, y] as const;
}

/*
 * Photo sections: the photo sits at the top of the panel and fades into the section colour.
 * The fade mask lives on the frame (not the moving image) and the image is oversized, so the
 * scroll parallax can never expose an edge or a hard line. Each section colour is sampled from
 * the bottom of its photo, so the fade is seamless.
 */
function PhotoBg({ src, position }: { src: string; position?: string }) {
  const [ref, y] = useDrift(36);
  return (
    <div className="photo-sec__bg" aria-hidden="true" ref={ref}>
      <motion.img style={{ y, objectPosition: position }} src={src} alt="" />
    </div>
  );
}

function PhotoHead({ eyebrow, id, lines, light, children }: { eyebrow: string; id: string; lines: React.ReactNode[]; light?: boolean; children: React.ReactNode }) {
  return (
    <div className="photo-sec__head">
      <div>
        <R as="p" className="wm__eyebrow wm__eyebrow--left">{eyebrow}</R>
        <Split className={`h-section${light ? ' h-section--light' : ''}`} id={id} lines={lines} />
      </div>
      <R delay={0.25}>{children}</R>
    </div>
  );
}

/* ============ WEIGHT MANAGEMENT: blue sky fading into deep navy-blue ============ */
export function WeightSection() {
  const { openBmi } = useUi();
  const [bmiRef, bmiIn] = useReveal<HTMLDivElement>();
  return (
    <section className="wm photo-sec ps--haze ps--light" id="weight-management" aria-labelledby="wm-title">
      <div className="container">
        <div className="wm__panel">
          <PhotoBg src="/assets/img/sections/weight-dunes.jpg" position="50% 30%" />
          <PhotoHead eyebrow="Weight Management" id="wm-title" light lines={['A weight plan built', <>around your <em>goals</em></>]}>
            <PanelBtn tone="light" to={areaIntake('weight-management')}>Get started</PanelBtn>
          </PhotoHead>

          <div className="wm__lineup" id="weight-management-lineup">
            <R className="wm__lineup-head"><p className="wm__label">Choose your weight management treatment</p></R>
            <R className="wm__cards wm__cards--2" kind="stagger">
              {treatmentsIn('weight-management').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} />)}
            </R>
            <R><CompoundedNote /></R>
            <R as="p" className="wm__disclaimer wm__disclaimer--tight">{NOT_GUARANTEED}</R>
          </div>

          <div className={`bmi-card${bmiIn ? ' is-in' : ''}`} ref={bmiRef} data-reveal="">
            <div className="bmi-card__copy">
              <h3 className="h-card">
                <span className="line"><span>Know your numbers</span></span>
                <span className="line"><span>before you <em>start</em></span></span>
              </h3>
              <p>BMI is one of the first things a provider looks at. Check yours in seconds; nothing leaves your device.</p>
            </div>
            <div className="bmi-card__stat">
              <p className="bmi-card__range">18.5<span>–</span>24.9</p>
              <p className="bmi-card__caption">Healthy BMI range for adults, per the CDC</p>
            </div>
            <button type="button" className="btn btn--light bmi-card__btn" onClick={openBmi}>Calculate your BMI</button>
            <svg className="gauge gauge--card" viewBox="0 0 400 220" aria-hidden="true">
              <GaugeArcs />
              <g className="gauge__needle" style={{ ['--angle' as string]: '-40deg' }}>
                <line x1="200" y1="200" x2="200" y2="62" />
                <circle cx="200" cy="200" r="12" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ HAIR LOSS: beach sky fading into light aqua ============ */
export function HairLossSection() {
  return (
    <section className="wm photo-sec ps--aqua ps--light" id="hair-loss" aria-labelledby="hair-loss-title">
      <div className="container">
        <div className="wm__panel">
          <PhotoBg src="/assets/img/sections/hair-beach.jpg" position="50% 25%" />
          <PhotoHead eyebrow="Hair Loss" id="hair-loss-title" lines={['Hair loss care,', <>made for <em>you</em></>]}>
            <PanelBtn tone="light" to={areaIntake('hair-loss')}>Start your hair loss intake</PanelBtn>
          </PhotoHead>

          <div className="wm__lineup" id="hair-loss-lineup">
            <R className="wm__lineup-head"><p className="wm__label">Choose your hair loss treatment</p></R>
            <R className="wm__cards wm__cards--2" kind="stagger">
              {treatmentsIn('hair-loss').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} />)}
            </R>
            <R><CompoundedNote names={compoundedIn('hair-loss')} /></R>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ============ PEPTIDES (sea glass) ============ */
export function PeptidesSection() {
  return (
    <section className="wm wm--sage wm--single" id="peptides" aria-labelledby="peptides-title">
      <div className="container">
        <div className="wm__panel">
          <div className="wm__beam" aria-hidden="true" />
          <div className="wm__intro">
            <R as="p" className="wm__eyebrow">Peptides</R>
            <Split className="h-section" id="peptides-title" lines={['Peptide programs, guided', <>by licensed <em>providers</em></>]} />
            <R className="wm__stage" delay={0.2} aria-hidden="true">
              <div className="wm__glow" />
              <div className="orbit-scene">
                <div className="orbit-tilt">
                  <img className="wm__vial wm__vial--a" src="/assets/img/products/nad.webp" alt="" />
                  <Orbit text="Sermorelin ✦ NAD+ ✦ Glutathione ✦ NAD+ Nasal Spray ✦ " />
                </div>
              </div>
              <div className="wm__shadow" />
            </R>
            <R as="p" className="wm__lede" delay={0.3}>
              Wellness programs that include peptides and coenzymes, prepared by a licensed pharmacy. Share your goals,
              and a licensed provider decides what may be appropriate for you.
            </R>
            <R className="wm__cta" delay={0.4}>
              <PanelBtn tone="dark" to={areaIntake('peptides')}>Get started</PanelBtn>
            </R>
          </div>

          <R className="wm__lineup" id="peptides-lineup" kind="plain">
            <Slider title="Choose your peptide program" label="Peptide treatments" barClass="wm__lineup-head wm__lineup-head--slider" labelClass="wm__label" trackClass="wm__cards wm__cards--slider">
              {treatmentsIn('peptides').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} />)}
            </Slider>
            <CompoundedNote names={compoundedIn('peptides')} />
            <p className="wm__disclaimer wm__disclaimer--tight">
              Peptide programs are offered as part of general wellness care, only when a licensed provider determines they are appropriate.
            </p>
          </R>

          <R className="xcard xcard--body">
            <div className="xcard__copy">
              <h3 className="h-card h-card--dark"><span className="line"><span>Your body, <em>explained</em></span></span></h3>
              <p>Tap a point to read about each compound. A licensed provider decides whether any program is appropriate for you.</p>
            </div>
            <SmartLink to={areaIntake('peptides')} className="btn btn--dark xcard__btn">Start your peptide intake</SmartLink>
            <BodyMap />
            <p className="xcard__caption">Educational information only. Not a treatment claim.</p>
          </R>
        </div>
      </div>
    </section>
  );
}

/* ============ SEXUAL HEALTH: sunset couple fading into deep dusk rose ============ */
export function SexualHealthSection() {
  return (
    <section className="wm photo-sec ps--azure" id="sexual-health" aria-labelledby="sexual-health-title">
      <div className="container">
        <div className="wm__panel">
          <PhotoBg src="/assets/img/sections/couple-terrace.jpg" position="50% 28%" />
          <PhotoHead eyebrow="Sexual Health" id="sexual-health-title" light lines={['Discreet, provider-led', <>sexual health <em>care</em></>]}>
            <PanelBtn tone="light" to={areaIntake('sexual-health')}>Get started</PanelBtn>
          </PhotoHead>

          <div className="wm__lineup" id="sexual-health-lineup">
            <R className="wm__lineup-head"><p className="wm__label">Choose your sexual health treatment</p></R>
            <R className="wm__cards wm__cards--3" kind="stagger">
              {treatmentsIn('sexual-health').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} />)}
            </R>
            <R><CompoundedNote names={compoundedIn('sexual-health')} /></R>
          </div>

          <R className="xcard xcard--discreet">
            <div className="xcard__copy">
              <h3 className="h-card"><span className="line"><span>Private by <em>design</em></span></span></h3>
              <p>From a private online visit to a plain, unmarked parcel at your door, every step keeps your care between you and your provider.</p>
            </div>
            <SmartLink to={areaIntake('sexual-health')} className="btn btn--light xcard__btn">Start a private visit</SmartLink>
            <DiscreetRow />
          </R>
        </div>
      </div>
    </section>
  );
}

/* ============ HOW IT WORKS: the 4-step care journey card (lives in the Skincare section) ============ */
function JourneyCard() {
  const { card, idx, steps, phone } = useJourneyPhone();
  const [hiwRef, hiwIn] = useReveal<HTMLDivElement>(0.15);
  const setRefs = (el: HTMLDivElement | null) => {
    (card as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (hiwRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };
  return (
    <>
      <div className={`hiw${hiwIn ? ' is-in' : ''}`} id="how" ref={setRefs} data-reveal="">
        <div className="hiw__copy">
          <h3 className="h-card h-card--dark">
            <span className="line"><span>Your care journey,</span></span>
            <span className="line"><span>step by <em>step</em></span></span>
          </h3>
          <p>From intake to provider review to ongoing care, with a licensed clinician at every step.</p>
        </div>
        <ol className="hiw__steps" aria-label="How it works">
          {steps.map((s, i) => (
            <li key={s} className={i === idx ? 'is-active' : ''}><span>0{i + 1}</span>{s}<i /></li>
          ))}
        </ol>
        <GoalsBtn className="btn btn--rose hiw__btn" icon={false}>Start your visit</GoalsBtn>
        {phone}
        <p className="hiw__caption">Illustration of the care process</p>
      </div>
      <R><RoleNote className="role-note--panel" /></R>
    </>
  );
}

/* ============ SKINCARE: pink sunset fading into soft blush ============
 * The previous portrait version is kept below as SkincareSectionClassic. */
export function SkincareSection() {
  return (
    <section className="wm photo-sec ps--blush ps--light" id="skincare" aria-labelledby="sc-title">
      <div className="container">
        <div className="wm__panel">
          <PhotoBg src="/assets/img/sections/skin-sunset.jpg" position="50% 30%" />
          <PhotoHead eyebrow="Skincare" id="sc-title" lines={['Skincare guided', <>by your <em>provider</em></>]}>
            <PanelBtn tone="rose" to={areaIntake('skincare')}>Start your skincare intake</PanelBtn>
          </PhotoHead>

          <R className="wm__lineup" id="skincare-lineup" kind="plain">
            <Slider title="Choose your skincare treatment" label="Skincare treatments" barClass="wm__lineup-head wm__lineup-head--slider" labelClass="wm__label" trackClass="sc__track">
              {treatmentsIn('skincare').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} variant="sk" />)}
            </Slider>
            <CompoundedNote names={compoundedIn('skincare')} />
          </R>

          <JourneyCard />
        </div>
      </div>
    </section>
  );
}

/* ============ SKINCARE classic (warm sand, portrait cutout) ============ */
export function SkincareSectionClassic() {
  return (
    <section className="sc" id="skincare" aria-labelledby="sc-title">
      <div className="container">
        <div className="sc__panel">
          <div className="sc__head sc__head--center">
            <R as="p" className="sc__tag">Skincare</R>
            <Split className="h-section" id="sc-title" lines={[<>Skincare made <em>personal</em></>]} />
            <R className="sc__hero" delay={0.2} aria-hidden="true">
              <div className="sc__rays" />
              <div className="sc__halo" />
              <img className="sc__woman" src="/assets/img/skincare-woman.webp" alt="" />
            </R>
          </div>

          <R className="sc__lineup" id="skincare-lineup" kind="plain">
            <Slider title="Choose your skincare treatment" label="Skincare treatments" barClass="sc__bar" labelClass="sc__label" trackClass="sc__track">
              {treatmentsIn('skincare').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} variant="sk" />)}
            </Slider>
            <div className="wm__cta wm__cta--center">
              <PanelBtn tone="dark" to={areaIntake('skincare')}>Start your skincare intake</PanelBtn>
            </div>
            <CompoundedNote className="sc__disclaimer" names={compoundedIn('skincare')} />
          </R>
        </div>
      </div>
    </section>
  );
}

/* ============ HRT (ported from ViaRx Health: photo header, teal colour section, labs bento) ============ */
const MARKERS = ['Estradiol', 'Progesterone', 'DHEA-S', 'TSH', 'Free T3', 'Free T4', 'FSH', 'LH', 'SHBG', 'Cortisol', 'Vitamin D'];
const markerRow = (start: number) => {
  const row = [...MARKERS.slice(start), ...MARKERS.slice(0, start)];
  return [...row, ...row]; // doubled so the marquee loops seamlessly
};

export function HrtSection() {
  return (
    <section className="wm photo-sec ps--teal" id="hrt" aria-labelledby="hrt-title">
      <div className="container">
        <div className="wm__panel">
          {/* Header photo fades into the section colour at the bottom */}
          <PhotoBg src="/assets/img/sections/hrt-teal.jpg" position="50% 26%" />

          <div className="photo-sec__head">
            <div>
              <R as="p" className="wm__eyebrow wm__eyebrow--left">Hormone Therapy (HRT)</R>
              <Split className="h-section h-section--light" id="hrt-title" lines={['Hormone care that', <>starts with your <em>labs</em></>]} />
            </div>
            <R delay={0.25}>
              <SmartLink to={areaIntake('hrt')} className="btn btn--light">Start with labs</SmartLink>
            </R>
          </div>

          <R className="wm__lineup" id="hrt-lineup" kind="plain">
            <Slider title="Choose your HRT treatment" label="HRT treatments" barClass="wm__lineup-head wm__lineup-head--slider" labelClass="wm__label" trackClass="wm__cards wm__cards--slider">
              {treatmentsIn('hrt').map((t, i) => <TreatmentCard key={t.slug} t={t} i={i} />)}
            </Slider>
            <p className="wm__disclaimer">{HRT_NOTE}</p>
            <CompoundedNote names={compoundedIn('hrt')} />
          </R>

          <R className="bento">
            <div className="bento__wide">
              <div className="bento__side">
                <h3 className="bento__title">Start with <em>your labs</em></h3>
                <p>Hormone and thyroid labs, where appropriate, give your provider a clear starting point.</p>
              </div>
              <div className="bento__phone" aria-hidden="true">
                <CarePhone />
              </div>
              <div className="bento__side bento__side--end">
                <h3 className="bento__title">A plan built <em>around you</em></h3>
                <p>Your provider reviews your history and labs before recommending any treatment.</p>
                <SmartLink to={areaIntake('hrt')} className="btn btn--light">Start with labs</SmartLink>
              </div>
            </div>

            <div className="bento__card bento__card--photo">
              <h3 className="bento__title">Check in on <em>how you feel</em></h3>
              <div className="bento__img"><img src="/assets/img/sections/hrt-checkin.webp" alt="Hands holding a mug of herbal tea beside an open notebook" loading="lazy" /></div>
              <ul className="bento__chips"><li>Sleep</li><li>Hot flashes</li><li>Mood</li><li>Night sweats</li></ul>
            </div>

            <div className="bento__card bento__card--model">
              <h3 className="bento__title">Hormone &amp; thyroid <em>labs, first</em></h3>
              <div className="bento__markers" aria-hidden="true">
                {[0, 4, 8].map((s) => (
                  <span key={s}>{markerRow(s).map((m, i) => <i key={i}>{m}</i>)}</span>
                ))}
              </div>
              <img className="bento__model" src="/assets/img/sections/hrt-model.webp" alt="" loading="lazy" />
              <SmartLink to={areaIntake('hrt')} className="btn btn--light bento__btn">Start with labs <ArrowRight /></SmartLink>
            </div>
          </R>
          <R as="p" className="wm__disclaimer bento__note">Illustration only. Lab panels are ordered by your provider where appropriate and vary by patient.</R>
        </div>
      </div>
    </section>
  );
}

/* ============ FAQ ============ */
export function FaqItem({ q, a, open }: { q: string; a: React.ReactNode; open?: boolean }) {
  return (
    <details className="faq__item" name="faq" open={open}>
      <summary><span>{q}</span><i aria-hidden="true" /></summary>
      <div className="faq__answer"><p>{a}</p></div>
    </details>
  );
}

export function FaqSection() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__side">
          <R as="p" className="trust__tag">FAQs</R>
          <Split className="h-section" id="faq-title" lines={['Your questions about', <>our care, <em>answered</em></>]} />
          <R as="p" className="faq__lede" delay={0.3}>Still have a question? Our care team is happy to help, every step.</R>
          <R className="faq__links" delay={0.4}>
            <Link to="/contact" className="btn btn--dark">Contact us</Link>
            <Link to="/faq" className="link-arrow">All FAQs <ArrowRight /></Link>
          </R>
        </div>
        <R className="faq__list">
          {FAQS.slice(0, 7).map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} open={i === 0} />)}
        </R>
      </div>
    </section>
  );
}

/* ============ FINAL CTA ============ */
export function FinalCta() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container">
        <R className="cta__panel">
          <LineMark className="cta__mark" />
          <p className="wm__eyebrow">Your care team is ready</p>
          <h2 className="h-section h-section--light" id="cta-title">
            <span className="line"><span>Start your online visit</span></span>
            <span className="line"><span>in just a few <em>minutes</em></span></span>
          </h2>
          <p className="cta__lede">Pick your goal, answer a few questions, and a licensed provider takes it from there.</p>
          <div className="cta__btns">
            <GoalsBtn className="btn btn--light" icon={false}>Choose a treatment</GoalsBtn>
            <Link to="/#how" className="btn btn--outline-light">How it works</Link>
          </div>
        </R>
      </div>
    </section>
  );
}
