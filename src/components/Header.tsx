import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ANNOUNCEMENTS } from '../data/site';
import { CATEGORIES, categoryPath, treatmentPath, treatmentsIn } from '../data/treatments';
import { ArrowLeft, ArrowRight, BtnIcon, ChevronDown, Help, Sparkle } from './Icons';
import { Logo } from './Logo';
import { useUi } from './UiContext';

function Announce() {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0); // restarts the timer after a manual click
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ANNOUNCEMENTS.length), 4200);
    return () => clearInterval(id);
  }, [tick]);
  const go = (d: number) => { setI((n) => (n + d + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length); setTick((t) => t + 1); };
  return (
    <div className="announce" role="region" aria-label="Announcements">
      <button className="announce__nav" onClick={() => go(-1)} aria-label="Previous announcement"><ArrowLeft /></button>
      <div className="announce__track" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.p
            key={i}
            className="announce__msg is-active"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="dot" />
            {ANNOUNCEMENTS[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button className="announce__nav" onClick={() => go(1)} aria-label="Next announcement"><ArrowRight /></button>
    </div>
  );
}

type Menu = 'treatments' | 'about' | null;

export function Header() {
  const { openGoals } = useUi();
  const loc = useLocation();
  const topRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<Menu>(null);
  const [mobile, setMobile] = useState(false);
  const [state, setState] = useState({ scrolled: false, hidden: false, collapsed: false });
  const closeTimer = useRef<number>();

  // Header height → CSS var (mobile menu offset, sticky offsets)
  useLayoutEffect(() => {
    const set = () => topRef.current && document.documentElement.style.setProperty('--top-h', `${topRef.current.offsetHeight}px`);
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // Sticky header: collapse the announcement, hide on scroll down, show on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setState((s) => {
          if (menu || mobile) return { ...s, scrolled: y > 8 };
          let hidden = s.hidden;
          if (y > 240 && y > lastY) hidden = true;
          else if (y < lastY - 4 || y <= 240) hidden = false;
          return { scrolled: y > 8, hidden, collapsed: y > 40 && !hidden };
        });
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menu, mobile]);

  // Close menus on navigation
  useEffect(() => { setMenu(null); setMobile(false); }, [loc.pathname, loc.hash]);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(null); setMobile(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobile]);

  const open = (m: Menu) => { clearTimeout(closeTimer.current); setMenu(m); };
  const scheduleClose = () => { clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setMenu(null), 160); };
  const hover = { onMouseEnter: () => clearTimeout(closeTimer.current), onMouseLeave: scheduleClose };
  const trigger = (m: Exclude<Menu, null>) => ({
    'aria-expanded': menu === m,
    'aria-controls': `mega-${m}`,
    onMouseEnter: () => open(m),
    onMouseLeave: scheduleClose,
    onClick: () => (menu === m ? setMenu(null) : open(m)),
  });

  const cls = ['site-top', state.scrolled && 'is-scrolled', state.hidden && 'is-hidden', state.collapsed && 'is-collapsed'].filter(Boolean).join(' ');

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className={cls} ref={topRef}>
        <Announce />
        <header className="header">
          <div className="header__inner container">
            <Logo tone="dark" />

            <nav className="nav" aria-label="Primary">
              <ul className="nav__list">
                <li className="nav__item has-menu">
                  <button className="nav__link" {...trigger('treatments')}>Treatments <ChevronDown className="chev" /></button>
                </li>
                <li className="nav__item has-menu">
                  <button className="nav__link" {...trigger('about')}>About <ChevronDown className="chev" /></button>
                </li>
                <li className="nav__item"><Link className="nav__link" to="/faq" onMouseEnter={() => setMenu(null)}>FAQs</Link></li>
                <li className="nav__item"><Link className="nav__link nav__link--promo" to="/#how" onMouseEnter={() => setMenu(null)}>How it works</Link></li>
              </ul>
            </nav>

            <div className="header__actions">
              <button type="button" className="quiz-pill" onClick={openGoals} aria-label="Which treatment is right for you?">
                <Sparkle />
                <span>Which treatment is right for you?</span>
              </button>
              <Link to="/faq" className="icon-btn" aria-label="Help and FAQs"><Help /></Link>
              <button
                className="icon-btn burger"
                aria-label={mobile ? 'Close menu' : 'Open menu'}
                aria-expanded={mobile}
                aria-controls="mobileMenu"
                onClick={() => setMobile((m) => !m)}
              >
                <span /><span />
              </button>
            </div>
          </div>

          {/* Mega menu: Treatments (category → treatment pages) */}
          <div className={`mega${menu === 'treatments' ? ' is-open' : ''}`} id="mega-treatments" role="region" aria-label="Treatments" {...hover}>
            <div className="mega__inner container">
              <div className="mega__cols">
                {CATEGORIES.map((c) => (
                  <div className="mega__col" key={c.slug}>
                    <Link className="mega__title" to={categoryPath(c.slug)}>{c.name}</Link>
                    {treatmentsIn(c.slug).map((t) => (
                      <Link key={t.slug} to={treatmentPath(t)}>{t.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
              <button type="button" className="mega__feature" onClick={openGoals}>
                <img src="/assets/img/hero/peptides-nad.webp" alt="" loading="lazy" />
                <span className="mega__feature-text">
                  <span className="mega__feature-kicker">Not sure where to start?</span>
                  <span className="mega__feature-title">Choose a treatment area</span>
                </span>
              </button>
            </div>
          </div>

          {/* Mega menu: About */}
          <div className={`mega mega--small${menu === 'about' ? ' is-open' : ''}`} id="mega-about" role="region" aria-label="About" {...hover}>
            <div className="mega__inner container">
              <div className="mega__cols">
                <div className="mega__col">
                  <p className="mega__title">Company</p>
                  <Link to="/#how">How it works</Link>
                  <Link to="/faq">Providers &amp; pharmacy</Link>
                  <Link to="/contact">Contact us</Link>
                </div>
                <div className="mega__col">
                  <p className="mega__title">Policies</p>
                  <Link to="/telehealth-consent">Telehealth Consent</Link>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                  <Link to="/hipaa-notice">HIPAA Notice</Link>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobile ? ' is-open' : ''}`} id="mobileMenu" aria-hidden={!mobile}>
        <div className="mobile-menu__body">
          <button type="button" className="quiz-pill quiz-pill--block" onClick={() => { setMobile(false); openGoals(); }}>
            <Sparkle />
            <span>Which treatment is right for you?</span>
          </button>
          <ul className="m-nav">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link to={categoryPath(c.slug)}>{c.name === 'HRT' ? 'Hormone Therapy (HRT)' : c.name}</Link></li>
            ))}
          </ul>
          <ul className="m-nav m-nav--small">
            <li><Link to="/#how">How it works</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <button type="button" className="btn btn--primary btn--block" onClick={() => { setMobile(false); openGoals(); }}>
            Start your visit <BtnIcon />
          </button>
        </div>
      </div>

      <div className={`scrim${menu ? ' is-on' : ''}`} onClick={() => setMenu(null)} />
    </>
  );
}
