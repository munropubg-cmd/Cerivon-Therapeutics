import { GoalsBtn, SmartLink } from '../components/Bits';
import { ArrowRight, ArrowUpRight } from '../components/Icons';
import { areaIntake } from '../data/intake';
import type { CategorySlug } from '../data/treatments';
import { R, Split } from '../hooks/useReveal';

/* Same light hero as the reference template: headline left, CTA right, three photo cards, then the goal cards. */
const CATS: { slug: CategorySlug; title: string; desc: string; img: string; alt: string }[] = [
  { slug: 'weight-management', title: 'Weight Management', desc: 'GLP-1 programs, provider-guided', img: '/assets/img/hero/weight-semaglutide.webp', alt: 'Semaglutide vial on pale stone with leaves' },
  { slug: 'peptides', title: 'Peptides', desc: 'Wellness programs like NAD+', img: '/assets/img/hero/peptides-nad.webp', alt: 'NAD+ vial on granite by water' },
  { slug: 'sexual-health', title: 'Sexual Health', desc: 'Private, provider-led care', img: '/assets/img/hero/sexual-tadalafil.webp', alt: 'Tadalafil bottle on dark granite' },
];

const MINIS: { slug: CategorySlug; title: string; img: string; tone: string }[] = [
  { slug: 'hair-loss', title: 'Hair Loss', img: '/assets/img/products/minoxidil.webp', tone: 'mint' },
  { slug: 'skincare', title: 'Skincare', img: '/assets/img/products/tretinoin-gel.webp', tone: 'sand' },
  { slug: 'hrt', title: 'Hormone Therapy', img: '/assets/img/products/estradiol.webp', tone: 'blush' },
  { slug: 'sexual-health', title: 'Erectile Dysfunction', img: '/assets/img/products/tadalafil.webp', tone: 'sage' },
];

/** Second section of the home page (it was the hero before the lifestyle hero arrived). */
export function Hero() {
  return (
    <section className="hero hero--goals" id="care" aria-label="Choose your care">
      <div className="container">
        <div className="hero__head">
          <div className="hero__copy">
            <R as="p" className="eyebrow"><span className="pulse" />Choose your care</R>
            <Split as="h2" className="h-display" lines={['Specialized care,', <>made <em>personal</em></>]} />
            <R as="p" className="hero__lede" delay={0.35}>
              Start with the area you'd like help with. Every program begins with a private online intake and a
              licensed provider's review of your health history.
            </R>
          </div>

          <R className="hero__cta" delay={0.5}>
            <div className="hero__btns">
              <GoalsBtn>Start your visit</GoalsBtn>
            </div>
          </R>
        </div>

        <R className="cats" kind="stagger">
          {CATS.map((c, i) => (
            <SmartLink key={c.slug} to={areaIntake(c.slug)} className={`cat cat--${c.slug}`} style={{ ['--i' as string]: i }}>
              <div className="cat__media"><img src={c.img} alt={c.alt} /></div>
              <div className="cat__body">
                <div className="cat__text">
                  <h2 className="cat__title">{c.title}</h2>
                  <p className="cat__desc">{c.desc}</p>
                </div>
                <span className="arrow-btn" aria-hidden="true"><ArrowUpRight /></span>
              </div>
            </SmartLink>
          ))}
        </R>

        <div className="more">
          <R className="more__head">
            <p className="more__label">Find care for your goal</p>
            <GoalsBtn className="link-arrow" icon={false}>View all treatments <ArrowRight /></GoalsBtn>
          </R>
          <R className="minis" kind="stagger">
            {MINIS.map((m, i) => (
              <SmartLink key={m.title} to={areaIntake(m.slug)} className={`mini mini--${m.tone}`} style={{ ['--i' as string]: i }}>
                <h3 className="mini__title">{m.title}</h3>
                <img className="mini__vial" src={m.img} alt="" />
              </SmartLink>
            ))}
          </R>
        </div>
      </div>
    </section>
  );
}
