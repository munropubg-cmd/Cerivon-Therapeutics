import { HelixDivider } from '../components/Helix';
import { Hero } from '../sections/Hero';
import { CareExplorer, CareTeam, Experience, HowItWorks, LifeCta, LifeHero } from '../sections/HomeSections';
import { FaqSection } from '../sections/Sections';
import { usePageMeta } from './usePageMeta';

/*
 * One connected journey (client feedback, Oct 2026):
 *   1 who Cerivon is (lifestyle hero)        2 choose your care (the original hero)
 *   3 explore the treatment areas            4 how the online visit works
 *   5 providers, pharmacy and support        6 what the Cerivon experience looks like
 *   7 questions                              8 take the next step
 * Each treatment area's full section (products, BMI, labs) lives on its own page.
 */
export default function Home() {
  usePageMeta('Care designed around you', 'Personalized, prescription-based care through online medical evaluations with licensed providers. Weight management, skincare, hair loss, hormone therapy, sexual health and peptides.');
  return (
    <>
      <LifeHero />
      <Hero />
      <HelixDivider />
      <CareExplorer />
      <HelixDivider />
      <HowItWorks />
      <CareTeam />
      <HelixDivider />
      <Experience />
      <FaqSection />
      <LifeCta />
    </>
  );
}
