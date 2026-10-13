import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { StateCoverage } from '../components/Bits';
import { BRAND, PARTNERS } from './site';

export type Faq = { q: string; a: ReactNode };

export const FAQS: Faq[] = [
  // Required by the build brief: answer must stay word-for-word (see StateCoverage).
  { q: 'Which states do you serve?', a: <StateCoverage /> },
  {
    q: 'Is treatment guaranteed?',
    a: 'No. Completing an intake or selecting a program does not guarantee treatment. Prescription medications are provided only when a licensed provider determines they are clinically appropriate.',
  },
  {
    q: 'Do I need to speak with a provider?',
    a: 'Every intake is reviewed by a licensed provider. Depending on your health history, goals, treatment request, and applicable requirements, the provider may request additional information, lab work, or a consultation before making a treatment decision.',
  },
  {
    q: 'Does hormone therapy require lab work?',
    a: 'Hormone therapy requires an evaluation by a licensed provider, and lab testing where appropriate, before any treatment decision is made. Your provider will let you know what is needed for your request.',
  },
  {
    q: 'Are compounded medications FDA-approved?',
    a: 'No. Compounded medications are not FDA-approved. The FDA does not verify the safety, effectiveness, or quality of compounded medications.',
  },
  {
    q: `Can I use ${BRAND} for emergency care?`,
    a: `No. ${BRAND} is not for emergencies. If you are experiencing a medical emergency, call 911 or seek immediate medical attention.`,
  },
  {
    q: 'Who provides the clinical care?',
    a: `Clinical care is provided by licensed medical providers affiliated with ${PARTNERS.clinical.name}, an independent physician group.`,
  },
  {
    q: 'Who handles pharmacy and prescription fulfillment?',
    a: `Pharmacy services and prescription fulfillment are provided by ${PARTNERS.pharmacy.name}, a licensed U.S. pharmacy.`,
  },
  {
    q: `Does ${BRAND} prescribe medications?`,
    a: (
      <>
        No. {BRAND} is a technology platform and does not prescribe, dispense, or compound medications. All clinical and
        treatment decisions are made by independent licensed providers. See <Link to="/terms-of-service">our Terms</Link>.
      </>
    ),
  },
];
