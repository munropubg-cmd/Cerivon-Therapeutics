import { Link } from 'react-router-dom';
import { BRAND, COMPOUNDED_DISCLOSURE, CONTACT, EMERGENCY, ROLE_DISCLOSURE } from '../data/site';
import { CATEGORIES, categoryPath } from '../data/treatments';
import { GoalsBtn, StateCoverage } from './Bits';
import { LineMark } from './LineMark';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="footer">
      <LineMark className="footer__mark" />
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo tone="light" />
            <p className="footer__about">
              Private telehealth access to licensed providers for weight management, skincare, hair loss, peptides,
              sexual health and hormone therapy, with prescriptions filled by a licensed U.S. pharmacy.
            </p>
            <GoalsBtn className="btn btn--primary footer__cta">Start your visit</GoalsBtn>
          </div>

          <nav className="footer__cols" aria-label="Footer">
            <div className="footer__col">
              <p className="footer__head">Treatments</p>
              {CATEGORIES.map((c) => <Link key={c.slug} to={categoryPath(c.slug)}>{c.name === 'HRT' ? 'Hormone Therapy (HRT)' : c.name}</Link>)}
            </div>
            <div className="footer__col">
              <p className="footer__head">Company</p>
              <Link to="/#how">How it works</Link>
              <Link to="/faq">FAQs</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer__col">
              <p className="footer__head">Legal</p>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/telehealth-consent">Telehealth Consent</Link>
              <Link to="/cancellation-policy">Subscription &amp; Cancellation</Link>
              <Link to="/hipaa-notice">HIPAA Notice</Link>
            </div>
            <div className="footer__col">
              <p className="footer__head">Contact</p>
              {/* TODO before launch: the client's real phone, email and business address */}
              {CONTACT.phone ? <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a> : <span className="footer__todo">[Phone number]</span>}
              {CONTACT.email ? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> : <span className="footer__todo">[Support email]</span>}
              {CONTACT.address ? <span>{CONTACT.address}</span> : <span className="footer__todo">[Business address]</span>}
            </div>
          </nav>
        </div>

        <div className="footer__notice">
          <p className="footer__states"><b>Where we serve.</b> <StateCoverage /></p>
          <p>{ROLE_DISCLOSURE}</p>
          <p>{COMPOUNDED_DISCLOSURE} Completing an intake does not guarantee a prescription.</p>
          <p><b>Not for emergencies.</b> {EMERGENCY}</p>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
          <div className="footer__legal">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-of-service">Terms</Link>
            <Link to="/hipaa-notice">HIPAA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
