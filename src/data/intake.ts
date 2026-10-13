/*
 * Intake form links. Paste each external intake URL between the quotes.
 *
 * Anything left empty falls back to the built-in "Start your intake" page for that
 * treatment (/start/<slug>), so no button ever goes to a dead link while the forms are set up.
 *
 *   areas    → "Get started" buttons on category sections and the treatment chooser
 *   products → "Start treatment" on each treatment page
 */
export const INTAKE = {
  areas: {
    'weight-management': '',
    skincare: '',
    'hair-loss': '',
    peptides: '',
    'sexual-health': '',
    hrt: '',
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

export const productIntake = (slug: string) => INTAKE.products[slug] || `/start/${slug}`;
export const areaIntake = (slug: string) => INTAKE.areas[slug] || `/start/${slug}`;
