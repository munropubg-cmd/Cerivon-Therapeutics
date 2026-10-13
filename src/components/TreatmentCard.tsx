import { Link } from 'react-router-dom';
import { treatmentPath, type Treatment } from '../data/treatments';
import { ArrowRight } from './Icons';

/** Card used in every treatment lineup. Opens the treatment's own page (which holds "Start treatment"). */
export function TreatmentCard({ t, i, variant = 'tx' }: { t: Treatment; i: number; variant?: 'tx' | 'sk' }) {
  const v = variant;
  return (
    <Link to={treatmentPath(t)} className={v} style={{ ['--i' as string]: i }}>
      <span className={`${v}__tag`}>{t.tag}</span>
      <div className={`${v}__media`}>
        <img src={t.image} alt={`${t.name} product image`} loading="lazy" />
      </div>
      {v === 'tx' ? (
        <div className="tx__info">
          <h3 className="tx__name">{t.name}</h3>
          <p className="tx__meta">{t.meta}</p>
        </div>
      ) : (
        <>
          <h3 className="sk__name">{t.name}</h3>
          <p className="sk__meta">{t.meta}</p>
        </>
      )}
      <span className={`${v}__link`}>
        View treatment <ArrowRight />
      </span>
    </Link>
  );
}
