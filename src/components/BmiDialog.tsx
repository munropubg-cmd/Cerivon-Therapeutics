import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BtnIcon, Close } from './Icons';
import { useUi } from './UiContext';

export const GaugeArcs = () => (
  <>
    <path className="gauge__track" d="M30 200 A170 170 0 0 1 370 200" />
    <path className="gauge__seg gauge__seg--under" pathLength={100} d="M30 200 A170 170 0 0 1 370 200" strokeDasharray="13 100" strokeDashoffset="0" />
    <path className="gauge__seg gauge__seg--healthy" pathLength={100} d="M30 200 A170 170 0 0 1 370 200" strokeDasharray="25 100" strokeDashoffset="-14.5" />
    <path className="gauge__seg gauge__seg--over" pathLength={100} d="M30 200 A170 170 0 0 1 370 200" strokeDasharray="19 100" strokeDashoffset="-40.5" />
    <path className="gauge__seg gauge__seg--obese" pathLength={100} d="M30 200 A170 170 0 0 1 370 200" strokeDasharray="39.5 100" strokeDashoffset="-60.5" />
  </>
);

// CDC adult categories; gauge spans BMI 15–40 across 180°
const category = (bmi: number) =>
  bmi < 18.5 ? ['under', 'Underweight range'] : bmi < 25 ? ['healthy', 'Healthy weight range'] : bmi < 30 ? ['over', 'Overweight range'] : ['obese', 'Obesity range'];

export function BmiDialog() {
  const { bmiOpen, closeBmi } = useUi();
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [v, setV] = useState({ ft: '', in: '', lb: '', cm: '', kg: '' });

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (bmiOpen && !d.open) { d.showModal(); document.body.style.overflow = 'hidden'; }
  }, [bmiOpen]);

  const close = () => {
    const d = ref.current;
    if (!d?.open || closing) return;
    setClosing(true);
    setTimeout(() => { setClosing(false); d.close(); }, 280);
  };

  const n = (s: string) => parseFloat(s);
  let bmi = NaN;
  if (units === 'metric') {
    const m = n(v.cm) / 100, kg = n(v.kg);
    if (m > 0.9 && kg > 20) bmi = kg / (m * m);
  } else {
    const inches = (n(v.ft) || 0) * 12 + (n(v.in) || 0), lb = n(v.lb);
    if (inches > 36 && lb > 50) bmi = (703 * lb) / (inches * inches);
  }
  const valid = isFinite(bmi) && bmi >= 10 && bmi <= 80;
  const [key, label] = valid ? category(bmi) : [undefined, 'Enter your height and weight'];
  const angle = valid ? -90 + Math.min(Math.max((bmi - 15) / 25, 0), 1) * 180 : -90;
  const field = (name: keyof typeof v, unit: string, ph: string, min: number, max: number, mode: 'numeric' | 'decimal' = 'decimal') => (
    <label className="field">
      <input type="number" inputMode={mode} min={min} max={max} name={name} placeholder={ph} value={v[name]} onChange={(e) => setV({ ...v, [name]: e.target.value })} />
      <span>{unit}</span>
    </label>
  );

  return (
    <dialog
      ref={ref}
      className={`bmi-modal${closing ? ' is-closing' : ''}`}
      aria-labelledby="bmiTitle"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClose={() => { document.body.style.overflow = ''; closeBmi(); }}
      onClick={(e) => { if (e.target === ref.current) close(); }}
    >
      <form className="bmi" method="dialog" noValidate onSubmit={(e) => e.preventDefault()}>
        <button className="bmi__close" aria-label="Close BMI calculator" onClick={(e) => { e.preventDefault(); close(); }}><Close /></button>
        <p className="bmi__eyebrow">Educational tool</p>
        <h2 className="bmi__title" id="bmiTitle">BMI <em>calculator</em></h2>

        <div className="seg" role="radiogroup" aria-label="Units">
          <label><input type="radio" name="units" value="imperial" checked={units === 'imperial'} onChange={() => setUnits('imperial')} /><span>Imperial</span></label>
          <label><input type="radio" name="units" value="metric" checked={units === 'metric'} onChange={() => setUnits('metric')} /><span>Metric</span></label>
          <i className="seg__thumb" aria-hidden="true" />
        </div>

        {units === 'imperial' ? (
          <div className="bmi__fields" data-units="imperial">
            <div className="field-group">
              <span className="field-group__label">Height</span>
              <div className="field-row">{field('ft', 'ft', '5', 3, 8, 'numeric')}{field('in', 'in', '9', 0, 11, 'numeric')}</div>
            </div>
            <div className="field-group"><span className="field-group__label">Weight</span>{field('lb', 'lb', '170', 50, 900)}</div>
          </div>
        ) : (
          <div className="bmi__fields" data-units="metric">
            <div className="field-group"><span className="field-group__label">Height</span>{field('cm', 'cm', '175', 90, 250)}</div>
            <div className="field-group"><span className="field-group__label">Weight</span>{field('kg', 'kg', '77', 20, 400)}</div>
          </div>
        )}

        <div className="bmi__result" aria-live="polite">
          <svg className="gauge gauge--modal" viewBox="0 0 400 220" aria-hidden="true">
            <GaugeArcs />
            <g className="gauge__needle" style={{ ['--angle' as string]: `${angle}deg` }}>
              <line x1="200" y1="200" x2="200" y2="62" />
              <circle cx="200" cy="200" r="12" />
            </g>
          </svg>
          <div className="bmi__readout">
            <p className="bmi__value">{valid ? bmi.toFixed(1) : '—'}</p>
            <p className="bmi__cat" data-cat={key}>{label}</p>
          </div>
          <ul className="bmi__legend" aria-hidden="true">
            <li><i className="c-under" />Under 18.5</li>
            <li><i className="c-healthy" />18.5–24.9</li>
            <li><i className="c-over" />25–29.9</li>
            <li><i className="c-obese" />30+</li>
          </ul>
        </div>

        <p className="bmi__note">
          BMI is a screening measure, not a diagnosis, and doesn't account for muscle, bone or body composition. Only a licensed
          provider can determine whether any treatment is appropriate for you, and treatment is not guaranteed. Categories per the
          CDC adult BMI ranges.
        </p>
        <div className="bmi__actions">
          <Link to="/weight-management" className="btn btn--primary" onClick={close}>Explore weight management <BtnIcon /></Link>
        </div>
      </form>
    </dialog>
  );
}
