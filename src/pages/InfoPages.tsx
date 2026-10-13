import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { StateCoverage } from '../components/Bits';
import { Mail, Phone, Pin } from '../components/Icons';
import { FAQS } from '../data/faqs';
import { LEGAL } from '../data/legal';
import { BRAND, CONTACT, EMERGENCY } from '../data/site';
import { R } from '../hooks/useReveal';
import { FaqItem, FinalCta } from '../sections/Sections';
import { PageHero } from './PageHero';
import { usePageMeta } from './usePageMeta';

/** Splits "personal <em>information</em>" style meta strings into JSX. */
const em = (s: string) => {
  const m = s.match(/^(.*?)<em>(.*?)<\/em>(.*)$/);
  return m ? <>{m[1]}<em>{m[2]}</em>{m[3]}</> : s;
};

export function LegalPage({ slug }: { slug: keyof typeof LEGAL }) {
  const page = LEGAL[slug];
  usePageMeta(page.title, page.description);
  const prose = useRef<HTMLElement>(null);
  const [active, setActive] = useState('');
  const toc = [...page.html.matchAll(/<h2 id="([^"]+)">(?:\d+\.\s*)?([^<]+)<\/h2>/g)].map(([, id, text]) => ({ id, text }));

  // Highlight the current section in the table of contents
  useEffect(() => {
    const heads = prose.current?.querySelectorAll('h2[id]');
    if (!heads) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [slug]);

  return (
    <>
      <PageHero crumbs={[{ label: page.title }]} line1={em(page.line1)} line2={em(page.line2)} meta={`${page.title} · Last updated ${page.updated}`} />
      <section className="legal">
        <div className="container legal__grid">
          <aside className="toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {toc.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className={active === h.id ? 'is-active' : ''}>{h.text}</a></li>
              ))}
            </ol>
          </aside>
          <R as="article" className="prose">
            <div ref={prose as never} dangerouslySetInnerHTML={{ __html: page.html }} />
          </R>
        </div>
      </section>
    </>
  );
}

export function FaqPage() {
  usePageMeta('FAQs', `Answers to common questions about ${BRAND} telehealth care.`);
  return (
    <>
      <PageHero crumbs={[{ label: 'FAQs' }]} line1="Your questions about" line2={<>our care, <em>answered</em></>} lede={<>Still have a question? <Link to="/contact">Contact our team</Link>.</>} />
      <section className="legal">
        <div className="container">
          <R className="faq__list faq__list--page">
            {FAQS.map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} open={i === 0} />)}
          </R>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

export function ContactPage() {
  usePageMeta('Contact', `Contact the ${BRAND} support team.`);
  const todo = (s: string) => <span className="footer__todo">{s}</span>;
  return (
    <>
      <PageHero crumbs={[{ label: 'Contact' }]} line1="We're here to help" line2={<>with your <em>questions</em></>} lede="Questions about a program, an order, billing or your privacy? Reach our team using the details below." />
      <section className="legal">
        <div className="container">
          <R className="contact-grid" kind="stagger">
            <article className="contact-card" style={{ ['--i' as string]: 0 }}>
              <span className="trust-card__icon"><Phone /></span>
              <h2>Call us</h2>
              <p>Support for programs, orders and billing.</p>
              {CONTACT.phone ? <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a> : todo('[Phone number]')}
            </article>
            <article className="contact-card" style={{ ['--i' as string]: 1 }}>
              <span className="trust-card__icon"><Mail /></span>
              <h2>Email us</h2>
              <p>Cancellations, refunds and privacy requests.</p>
              {CONTACT.email ? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> : todo('[Support email]')}
            </article>
            <article className="contact-card" style={{ ['--i' as string]: 2 }}>
              <span className="trust-card__icon"><Pin /></span>
              <h2>Mailing address</h2>
              <p>{BRAND} business address.</p>
              {CONTACT.address || todo('[Business address]')}
            </article>
          </R>
          <R className="contact-partners">
            <h2>Clinical care &amp; pharmacy</h2>
            <p><StateCoverage /></p>
          </R>
          <div className="alert" role="note">
            <span aria-hidden="true">⚠</span>
            <p><b>Not for emergencies.</b> {EMERGENCY} Please don't use our contact channels to request emergency care.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  usePageMeta('Page not found');
  return (
    <PageHero crumbs={[{ label: 'Not found' }]} line1="We couldn't find" line2={<>that <em>page</em></>} lede={<>Head back to the <Link to="/">home page</Link> to choose a treatment.</>} />
  );
}
