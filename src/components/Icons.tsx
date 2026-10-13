/* Stroke icons shared across the site (24px grid, currentColor). */
type P = { className?: string };

export const ArrowRight = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const ArrowUpRight = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
);
export const ChevronDown = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
);
export const Close = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Shield = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
);
export const Truck = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></svg>
);
export const Stethoscope = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v6a4 4 0 008 0V3" /><path d="M10 13v2a5 5 0 0010 0v-1" /><circle cx="20" cy="12" r="2" /></svg>
);
export const Help = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.25" /><path d="M9.6 9.3a2.5 2.5 0 014.8.9c0 1.7-2.4 2.2-2.4 3.6" /><circle cx="12" cy="17.1" r=".6" className="fill" /></svg>
);
export const Sparkle = ({ className = 'sparkle' }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z" />
    <path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" />
  </svg>
);
export const Phone = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" /></svg>
);
export const Mail = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
export const Pin = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const Flask = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3" /><path d="M7.5 15h9" /></svg>
);
export const Chat = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
);
export const Clipboard = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" /></svg>
);

/** Arrow inside the round icon well used by primary buttons */
export const BtnIcon = () => (
  <span className="btn__icon"><ArrowRight /></span>
);
