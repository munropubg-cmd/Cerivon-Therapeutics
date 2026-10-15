import { TREATMENTS } from './treatments';

/*
 * Intake form links. Paste each external intake URL between the quotes.
 *
 * Anything left empty falls back to the built-in "Start your intake" page for that
 * treatment (/start/<slug>), so no button ever goes to a dead link while the forms are set up.
 *
 *   areas    → "Get started" buttons on category sections and the treatment chooser
 *   products → "Start treatment" on each treatment page (empty = uses its area link)
 */
export const INTAKE = {
  areas: {
    'weight-management': 'https://start.cerivontherapeutics.com/weight-loss/questionnaire',
    skincare: 'https://start.cerivontherapeutics.com/skin-care/questionnaire',
    'hair-loss': 'https://start.cerivontherapeutics.com/hair-loss/questionnaire',
    peptides: 'https://start.cerivontherapeutics.com/peptide-therapy/questionnaire',
    'sexual-health': 'https://start.cerivontherapeutics.com/erectile-dysfunction/questionnaire',
    hrt: 'https://start.cerivontherapeutics.com/hrt/questionnaire',
  } as Record<string, string>,
  products: {
    semaglutide: '',
    tirzepatide: '',
    'tretinoin-cream': '',
    'tretinoin-gel': '',
    'tretinoin-foam': '',
    'cashmere-cream': '',
    'ghk-cu-cream': '',
    finasteride: '',
    minoxidil: '',
    sermorelin: '',
    nad: '',
    glutathione: '',
    'nad-nasal-spray': '',
    'pt-141': '',
    sildenafil: '',
    tadalafil: '',
    biest: '',
    dhea: '',
    estradiol: '',
    'estradiol-patch': '',
    liothyronine: '',
    progesterone: '',
    't3-t4': '',
  } as Record<string, string>,
  /** Open intake forms in a new tab? */
  newTab: false,
};

/** A product without its own form uses its treatment area's form. */
export const productIntake = (slug: string) => {
  const area = TREATMENTS.find((t) => t.slug === slug)?.category;
  return INTAKE.products[slug] || (area && INTAKE.areas[area]) || `/start/${slug}`;
};
export const areaIntake = (slug: string) => INTAKE.areas[slug] || `/start/${slug}`;
