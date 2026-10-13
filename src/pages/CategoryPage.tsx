import { Navigate, useParams } from 'react-router-dom';
import { PrimaryBtn } from '../components/Bits';
import { areaIntake } from '../data/intake';
import { categoryBySlug, type CategorySlug } from '../data/treatments';
import { R } from '../hooks/useReveal';
import {
  FinalCta, HairLossSection, HrtSection, PeptidesSection, SexualHealthSection, SkincareSection, WeightSection,
} from '../sections/Sections';
import { PageHero } from './PageHero';
import { usePageMeta } from './usePageMeta';

const SECTION: Record<CategorySlug, () => JSX.Element> = {
  'weight-management': WeightSection,
  'hair-loss': HairLossSection,
  peptides: PeptidesSection,
  'sexual-health': SexualHealthSection,
  skincare: SkincareSection,
  hrt: HrtSection,
};

/** Category page: its own intro, then the same themed section as the home page (all treatments in the category). */
export default function CategoryPage({ slug: fixed }: { slug?: CategorySlug }) {
  const params = useParams();
  const cat = categoryBySlug(fixed ?? params.category);
  usePageMeta(cat ? (cat.name === 'HRT' ? 'Hormone Therapy (HRT)' : cat.name) : 'Treatments', cat?.intro);
  if (!cat) return <Navigate to="/" replace />;
  const Section = SECTION[cat.slug];
  const [first, ...rest] = (cat.name === 'HRT' ? 'Hormone Therapy' : cat.name).split(' ');
  return (
    <div className={`cat-page cat-page--${cat.theme}`}>
      <PageHero
        crumbs={[{ label: cat.name === 'HRT' ? 'Hormone Therapy (HRT)' : cat.name }]}
        line1={rest.length ? <>{first} <em>{rest.join(' ')}</em></> : <em>{first}</em>}
        lede={cat.intro}
      >
        <R className="page-hero__cta" delay={0.3}>
          <PrimaryBtn to={areaIntake(cat.slug)}>Get started</PrimaryBtn>
        </R>
      </PageHero>
      <Section />
      <FinalCta />
    </div>
  );
}
