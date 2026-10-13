import { Hero } from '../sections/Hero';
import {
  FaqSection, FinalCta, HairLossSection, HrtSection, PeptidesSection, SexualHealthSection, SkincareSection, WeightSection,
} from '../sections/Sections';
import { usePageMeta } from './usePageMeta';

/*
 * Section order is chosen for colour rhythm, so no two similar tones touch:
 *   Weight (pale sky) → Skincare (peach blush + How it works journey card) → Hair Loss (beach sky)
 *   → HRT (deep teal, the mid-page dark anchor) → Peptides (sea-glass mint)
 *   → Sexual Health (sky → deep sea blue) → FAQ (light) → final CTA (navy)
 */
export default function Home() {
  usePageMeta('Private telehealth care', 'Private telehealth care for weight management, skincare, hair loss, peptides, sexual health and hormone therapy. Every intake is reviewed by a licensed provider.');
  return (
    <>
      <Hero />
      <WeightSection />
      <SkincareSection />
      <HairLossSection />
      <HrtSection />
      <PeptidesSection />
      <SexualHealthSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
