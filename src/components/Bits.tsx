import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { INTAKE } from '../data/intake';
import { COMPOUNDED_DISCLOSURE, PARTNERS, ROLE_DISCLOSURE } from '../data/site';
import { BtnIcon } from './Icons';
import { useUi } from './UiContext';

/** Internal routes go through the router; external intake URLs open as plain links. */
export function SmartLink({ to, className, children, style, onClick, ...rest }: {
  to: string; className?: string; children: ReactNode; style?: CSSProperties; onClick?: (e: MouseEvent) => void; [k: string]: unknown;
}) {
  if (/^https?:/.test(to)) {
    const tab = INTAKE.newTab ? { target: '_blank', rel: 'noopener' } : {};
    return <a href={to} className={className} style={style} onClick={onClick} {...tab} {...rest}>{children}</a>;
  }
  return <Link to={to} className={className} style={style} onClick={onClick} {...rest}>{children}</Link>;
}

/** Primary pill with the round arrow well. */
export function PrimaryBtn({ to, children, className = '', onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <SmartLink to={to} className={`btn btn--primary ${className}`} onClick={onClick}>
      {children}
      <BtnIcon />
    </SmartLink>
  );
}

/** Opens the full-screen treatment chooser (used by every general "Start your visit" CTA). */
export function GoalsBtn({ children, className = 'btn btn--primary', icon = true }: { children: ReactNode; className?: string; icon?: boolean }) {
  const { openGoals } = useUi();
  return (
    <button type="button" className={className} onClick={openGoals}>
      {children}
      {icon && <BtnIcon />}
    </button>
  );
}

/** Required wording from the build brief — keep exactly as written. */
export function StateCoverage() {
  const { clinical: c, pharmacy: p } = PARTNERS;
  return (
    <>
      Telehealth services may be available in all 50 states where clinically appropriate and permitted by applicable law.
      Eligibility for treatment is determined by a licensed provider. Clinical care is provided by {c.name} (
      <a href={`mailto:${c.email}`}>{c.email}</a>, <a href={`tel:${c.tel}`}>{c.phone}</a>). Pharmacy services and
      prescription fulfillment are provided by {p.name} (<a href={`mailto:${p.email}`}>{p.email}</a>,{' '}
      <a href={`tel:${p.tel}`}>{p.phone}</a>).
    </>
  );
}

export function CompoundedNote({ names, className = 'wm__disclaimer' }: { names?: string[]; className?: string }) {
  return (
    <p className={className}>
      {names && names.length > 0 && <>Applies to {listJoin(names)}. </>}
      {COMPOUNDED_DISCLOSURE}
    </p>
  );
}

export function RoleNote({ className = '' }: { className?: string }) {
  return <p className={`role-note ${className}`}>{ROLE_DISCLOSURE}</p>;
}

export const listJoin = (xs: string[]) =>
  xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

/**
 * Button for use inside coloured section panels: a plain pill, no circle icon.
 * light = ivory pill on dark panels (like "Calculate your BMI"); dark = navy pill on light panels (like "Start your visit").
 */
export function PanelBtn({ to, tone, children, className = '' }: { to: string; tone: 'light' | 'dark' | 'rose'; children: ReactNode; className?: string }) {
  return <SmartLink to={to} className={`btn btn--${tone} ${className}`}>{children}</SmartLink>;
}
