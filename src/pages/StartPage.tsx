import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from '../components/Icons';
import { HRT_NOTE, NOT_GUARANTEED } from '../data/site';
import { categoryBySlug, categoryPath, treatmentBySlug, treatmentPath } from '../data/treatments';
import { R } from '../hooks/useReveal';
import { PageHero } from './PageHero';
import { usePageMeta } from './usePageMeta';

/*
 * Fallback for "Start treatment" / "Get started" while the external intake forms are being set up.
 * Once a URL is pasted into src/data/intake.ts, buttons go straight to the form and this page is skipped.
 */
export default function StartPage() {
  const { slug } = useParams();
  const t = treatmentBySlug(slug);
  const cat = categoryBySlug(t?.category ?? slug);
  const name = t?.name ?? (cat ? (cat.name === 'HRT' ? 'Hormone Therapy' : cat.name) : 'your visit');
  const back = t ? treatmentPath(t) : cat ? categoryPath(cat.slug) : '/';
  usePageMeta(`Start: ${name}`);
  const isHrt = (t?.category ?? cat?.slug) === 'hrt';

  return (
    <>
      <PageHero
        crumbs={[...(cat ? [{ to: categoryPath(cat.slug), label: cat.name }] : []), { label: 'Start your intake' }]}
        line1="Start your intake for"
        line2={<em>{name}</em>}
        lede="Your intake takes a few minutes. A licensed provider reviews it and lets you know the next step."
      />
      <section className="legal">
        <div className="container">
          <R className="start-card">
            <ol className="start-steps">
              <li><b>Tell us about you</b>Health history, current medications, allergies and your goals.</li>
              <li><b>Provider review</b>A licensed provider reviews your intake{isHrt ? ' and orders lab testing where appropriate' : ''}.</li>
              <li><b>Your plan</b>If treatment is appropriate, a licensed U.S. pharmacy fills and ships it.</li>
            </ol>
            {isHrt && <p className="start-note">{HRT_NOTE}</p>}
            <p className="start-note">{NOT_GUARANTEED}</p>
            <div className="start-actions">
              <span className="btn btn--primary is-disabled" aria-disabled="true">Intake form opens here</span>
              <Link to={back} className="link-arrow link-arrow--back"><ArrowLeft /> Back</Link>
            </div>
            <p className="start-dev">Mockup note: the secure intake form link for this treatment will be connected here (src/data/intake.ts).</p>
          </R>
        </div>
      </section>
    </>
  );
}
