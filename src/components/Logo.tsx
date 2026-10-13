import { Link } from 'react-router-dom';

/*
 * Client-supplied vector logos (public/brand/), used as-is, never retyped:
 *   dark  = Full Color (Wordmark Navy + Deep Teal) for light backgrounds, e.g. the header
 *   light = Dark Background (white wordmark + Bright Cyan) for navy backgrounds, e.g. footer, chooser
 */
export function Logo({ tone = 'light', onClick }: { tone?: 'light' | 'dark'; onClick?: () => void }) {
  const src = tone === 'dark' ? '/brand/cerivon-logo.svg' : '/brand/cerivon-logo-reverse.svg';
  return (
    <Link to="/" className={`logo logo--cv logo--${tone}`} aria-label="Cerivon Therapeutics home" onClick={onClick}>
      <img className="logo__img" src={src} alt="Cerivon Therapeutics" width={780} height={340} />
    </Link>
  );
}
