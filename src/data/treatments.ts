/*
 * Treatment catalog. Descriptions follow the Karpa Health claim guidance (Oct 8, 2026):
 * say what a product is, the area it is used in, and that a licensed provider decides if it is appropriate.
 * No outcome, safety, speed or comparison claims. Never "weight loss" (always "weight management").
 */

export type CategorySlug = 'weight-management' | 'skincare' | 'hair-loss' | 'peptides' | 'sexual-health' | 'hrt';

export type Treatment = {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Short line under the name on cards: drug class · form */
  meta: string;
  form: string;
  /** Small pill on the card */
  tag: string;
  image: string;
  /** Shows the compounded-medication disclosure when true */
  compounded: boolean;
  description: string;
  /** How it is typically used, as prescribed (administration only, no outcomes) */
  usage: string;
  /** Item still waiting on a partner confirmation before launch */
  pending?: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Mega menu / card subline */
  blurb: string;
  intro: string;
  /** Section theme used on category + treatment pages */
  theme: 'ocean' | 'sky' | 'sage' | 'dusk' | 'sand' | 'teal';
  hero: string;
};

const IMG = '/assets/img/products';

export const CATEGORIES: Category[] = [
  {
    slug: 'weight-management',
    name: 'Weight Management',
    blurb: 'GLP-1 programs with provider support',
    intro: 'Provider-supervised weight management programs, built around your health history and goals, alongside nutrition and activity changes.',
    theme: 'ocean',
    hero: '/assets/img/weight-woman.webp',
  },
  {
    slug: 'skincare',
    name: 'Skincare',
    blurb: 'Prescription topicals, provider-guided',
    intro: 'Prescription skincare formulas, chosen with a licensed provider after reviewing your skin goals and history.',
    theme: 'sand',
    hero: '/assets/img/skincare-woman.webp',
  },
  {
    slug: 'hair-loss',
    name: 'Hair Loss',
    blurb: 'Topical options, reviewed by a provider',
    intro: 'Topical hair loss care, prescribed when a licensed provider determines it is appropriate for you.',
    theme: 'sky',
    hero: '/assets/img/hairloss-man.webp',
  },
  {
    slug: 'peptides',
    name: 'Peptides',
    blurb: 'Wellness programs like NAD+',
    intro: 'Wellness programs that include peptides and coenzymes, offered only when a licensed provider determines they are appropriate.',
    theme: 'sage',
    hero: '/assets/img/card-peptides.webp',
  },
  {
    slug: 'sexual-health',
    name: 'Sexual Health',
    blurb: 'Private, provider-led care',
    intro: 'Discreet, provider-led sexual health care, from a private online visit to plain, unmarked delivery.',
    theme: 'dusk',
    hero: '/assets/img/sexual-couple.webp',
  },
  {
    slug: 'hrt',
    name: 'HRT',
    blurb: 'Hormone therapy with lab-guided review',
    intro: 'Hormone replacement and thyroid hormone therapy, with a provider evaluation and lab testing where appropriate before any treatment decision.',
    theme: 'teal',
    hero: '/assets/img/sections/hrt-model.webp',
  },
];

export const TREATMENTS: Treatment[] = [
  // ---------- Weight Management ----------
  {
    slug: 'semaglutide', name: 'Compounded Semaglutide', category: 'weight-management',
    meta: 'GLP-1 receptor agonist · Vial', form: 'Vial', tag: 'Once weekly', image: `${IMG}/semaglutide.webp`, compounded: true,
    description: 'A compounded formulation of semaglutide, a GLP-1 receptor agonist, prescribed for weight management when a licensed provider determines it is clinically appropriate.',
    usage: 'Given as a once-weekly injection under the skin, as prescribed, as part of a provider-supervised weight management program alongside nutrition and activity changes.',
  },
  {
    slug: 'tirzepatide', name: 'Compounded Tirzepatide', category: 'weight-management',
    meta: 'Dual GIP & GLP-1 receptor agonist · Vial', form: 'Vial', tag: 'Once weekly', image: `${IMG}/tirzepatide.webp`, compounded: true,
    description: 'A compounded formulation of tirzepatide, a dual GIP/GLP-1 receptor agonist, prescribed for weight management when a licensed provider determines it is clinically appropriate.',
    usage: 'Given as a once-weekly injection under the skin, as prescribed, as part of a provider-supervised weight management program.',
  },

  // ---------- Skincare ----------
  {
    slug: 'tretinoin-cream', name: 'Tretinoin Cream', category: 'skincare',
    meta: 'Prescription retinoid · Cream', form: 'Cream', tag: 'Applied nightly', image: `${IMG}/tretinoin-cream.webp`, compounded: true,
    description: 'A compounded topical cream containing tretinoin, a retinoid used in skincare, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Applied to the skin, usually at night, as directed by your provider.',
  },
  {
    slug: 'tretinoin-gel', name: 'Tretinoin Gel', category: 'skincare',
    meta: 'Prescription retinoid · Gel', form: 'Gel', tag: 'Applied nightly', image: `${IMG}/tretinoin-gel.webp`, compounded: true,
    description: 'A compounded topical gel containing tretinoin, a retinoid used in skincare, prescribed when a licensed provider determines it is appropriate.',
    usage: 'The same active ingredient as the cream in a lighter gel base, applied as directed by your provider.',
  },
  {
    slug: 'tretinoin-foam', name: 'Tretinoin Foam', category: 'skincare',
    meta: 'Prescription retinoid · Foam', form: 'Foam', tag: 'Applied nightly', image: `${IMG}/tretinoin-foam.webp`, compounded: true,
    description: 'A compounded topical foam containing tretinoin, a retinoid used in skincare, prescribed when a licensed provider determines it is appropriate.',
    usage: 'The same active ingredient as the cream in a foam base, applied as directed by your provider.',
  },
  {
    slug: 'cashmere-cream', name: 'Cashmere Cream', category: 'skincare',
    meta: 'Compounded topical · Cream', form: 'Cream', tag: 'Compounded', image: `${IMG}/cashmere-cream.webp`, compounded: true,
    description: 'A compounded topical skincare formulation, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Applied to the skin as directed by your provider.',
    pending: 'Active ingredients to be confirmed with Rx Ave Health, then this description will be made specific.',
  },
  {
    slug: 'ghk-cu-cream', name: 'GHK-Cu Cream', category: 'skincare',
    meta: 'Copper peptide · Topical cream', form: 'Cream', tag: 'Topical only', image: `${IMG}/ghk-cu-cream.webp`, compounded: true,
    description: 'A compounded topical cream containing GHK-Cu, a copper peptide, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Applied to the skin as directed by your provider. Offered in topical form only.',
  },

  // ---------- Hair Loss (topical only, per brief) ----------
  {
    slug: 'finasteride', name: 'Finasteride (Topical)', category: 'hair-loss',
    meta: '5-alpha reductase inhibitor · Topical', form: 'Topical', tag: 'Topical', image: `${IMG}/finasteride.webp`, compounded: true,
    description: 'A compounded topical formulation of finasteride, used in hair loss care, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Applied to the scalp as directed by your provider.',
  },
  {
    slug: 'minoxidil', name: 'Minoxidil (Topical)', category: 'hair-loss',
    meta: 'Vasodilator · Topical', form: 'Topical', tag: 'Topical', image: `${IMG}/minoxidil.webp`, compounded: false,
    description: 'A topical formulation of minoxidil, used in hair loss care, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Applied to the scalp as directed by your provider.',
  },

  // ---------- Peptides (see Karpa compliance heads-up before launch) ----------
  {
    slug: 'sermorelin', name: 'Sermorelin', category: 'peptides',
    meta: 'GHRH analog · Vial', form: 'Vial', tag: 'Provider-guided', image: `${IMG}/sermorelin.webp`, compounded: true,
    description: 'A compounded formulation of sermorelin, a growth hormone-releasing hormone (GHRH) analog, prescribed only when a licensed provider determines it is appropriate for a legitimate medical indication.',
    usage: 'Given as an injection under the skin, as prescribed, as part of a provider-supervised wellness program.',
    pending: 'Confirm with Rx Ave Health that this can be compounded and dispensed today before launch.',
  },
  {
    slug: 'nad', name: 'NAD+', category: 'peptides',
    meta: 'Coenzyme · Vial', form: 'Vial', tag: 'Wellness program', image: `${IMG}/nad.webp`, compounded: true,
    description: 'A compounded formulation of nicotinamide adenine dinucleotide (NAD+), prescribed only when a licensed provider determines it is appropriate.',
    usage: 'Given as an injection under the skin as part of a wellness program, as prescribed.',
    pending: 'Confirm with Rx Ave Health that this can be compounded and dispensed today before launch.',
  },
  {
    slug: 'glutathione', name: 'Glutathione', category: 'peptides',
    meta: 'Antioxidant · Vial', form: 'Vial', tag: 'Wellness program', image: `${IMG}/glutathione.webp`, compounded: true,
    description: 'A compounded formulation of glutathione, prescribed only when a licensed provider determines it is appropriate.',
    usage: 'Given as an injection as part of a wellness program, as prescribed.',
    pending: 'Confirm with Rx Ave Health that this can be compounded and dispensed today before launch.',
  },
  {
    slug: 'nad-nasal-spray', name: 'NAD+ Nasal Spray', category: 'peptides',
    meta: 'Coenzyme · Nasal spray', form: 'Spray', tag: 'Needle-free', image: `${IMG}/nad-nasal-spray.webp`, compounded: true,
    description: 'A compounded intranasal formulation of NAD+, prescribed only when a licensed provider determines it is appropriate.',
    usage: 'A nasal spray option for patients who prefer not to inject, used as prescribed.',
    pending: 'Confirm with Rx Ave Health that this can be compounded and dispensed today before launch.',
  },

  // ---------- Sexual Health ----------
  {
    slug: 'pt-141', name: 'PT-141', category: 'sexual-health',
    meta: 'Bremelanotide · Vial', form: 'Vial', tag: 'Compounded', image: `${IMG}/pt-141.webp`, compounded: true,
    description: 'A compounded formulation of bremelanotide (PT-141), prescribed when a licensed provider determines it is appropriate.',
    usage: 'Given as an injection under the skin before activity, as prescribed.',
    pending: 'Confirm with Rx Ave Health that this can be compounded and dispensed today before launch.',
  },
  {
    slug: 'sildenafil', name: 'Sildenafil', category: 'sexual-health',
    meta: 'PDE5 inhibitor · Capsule', form: 'Capsule', tag: 'Taken as needed', image: `${IMG}/sildenafil.webp`, compounded: false,
    description: 'An oral formulation of sildenafil, a PDE5 inhibitor used for erectile dysfunction, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth before activity, as prescribed.',
  },
  {
    slug: 'tadalafil', name: 'Tadalafil', category: 'sexual-health',
    meta: 'PDE5 inhibitor · Capsule', form: 'Capsule', tag: 'As needed or daily', image: `${IMG}/tadalafil.webp`, compounded: false,
    description: 'An oral formulation of tadalafil, a PDE5 inhibitor used for erectile dysfunction, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth as needed or daily, as prescribed.',
  },

  // ---------- HRT ----------
  {
    slug: 'biest', name: 'BIEST', category: 'hrt',
    meta: 'Bi-estrogen · Capsule', form: 'Capsule', tag: 'Compounded', image: `${IMG}/biest.webp`, compounded: true,
    description: 'A compounded oral capsule containing bi-estrogen (estradiol and estriol), used in hormone replacement therapy, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth as prescribed, following a provider evaluation and lab testing where appropriate.',
  },
  {
    slug: 'dhea', name: 'DHEA Cream', category: 'hrt',
    meta: 'Hormone precursor · Cream', form: 'Cream', tag: 'Topical', image: `${IMG}/dhea.webp`, compounded: true,
    description: 'A compounded topical cream containing DHEA, used in hormone support, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Applied to the skin as prescribed, following a provider evaluation and lab testing where appropriate.',
  },
  {
    slug: 'estradiol', name: 'Estradiol', category: 'hrt',
    meta: 'Estrogen · Capsule', form: 'Capsule', tag: 'Oral', image: `${IMG}/estradiol.webp`, compounded: true,
    description: 'An oral capsule containing estradiol, used in hormone replacement therapy, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth as prescribed, following a provider evaluation and lab testing where appropriate.',
    pending: 'Confirm with Rx Ave Health whether the capsule is compounded (the disclosure shows until confirmed).',
  },
  {
    slug: 'estradiol-patch', name: 'Estradiol Patch', category: 'hrt',
    meta: 'Estrogen · Transdermal patch', form: 'Patch', tag: 'Transdermal', image: `${IMG}/estradiol-patch.webp`, compounded: false,
    description: 'A transdermal patch delivering estradiol, used in hormone replacement therapy, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Worn on the skin and changed on a set schedule, as prescribed.',
  },
  {
    slug: 'liothyronine', name: 'Liothyronine', category: 'hrt',
    meta: 'Thyroid hormone (T3) · Capsule', form: 'Capsule', tag: 'Thyroid', image: `${IMG}/liothyronine.webp`, compounded: true,
    description: 'A compounded oral capsule containing liothyronine (T3), used in thyroid hormone therapy, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth as prescribed, following a provider evaluation and lab testing where appropriate.',
  },
  {
    slug: 'progesterone', name: 'Progesterone IR', category: 'hrt',
    meta: 'Immediate-release progesterone · Capsule', form: 'Capsule', tag: 'Compounded', image: `${IMG}/progesterone-ir.webp`, compounded: true,
    description: 'A compounded immediate-release oral capsule containing progesterone, used in hormone replacement therapy, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth as prescribed, often alongside estrogen therapy, following a provider evaluation and lab testing where appropriate.',
  },
  {
    slug: 't3-t4', name: 'T3/T4', category: 'hrt',
    meta: 'Thyroid hormone (T3 + T4) · Capsule', form: 'Capsule', tag: 'Thyroid', image: `${IMG}/t3-t4.webp`, compounded: true,
    description: 'A compounded oral capsule containing liothyronine (T3) and levothyroxine (T4), used in thyroid hormone therapy, prescribed when a licensed provider determines it is appropriate.',
    usage: 'Taken by mouth as prescribed, following a provider evaluation and lab testing where appropriate.',
  },
];

export const categoryBySlug = (slug?: string) => CATEGORIES.find((c) => c.slug === slug);
export const treatmentBySlug = (slug?: string) => TREATMENTS.find((t) => t.slug === slug);
export const treatmentsIn = (cat: CategorySlug) => TREATMENTS.filter((t) => t.category === cat);
export const treatmentPath = (t: Treatment) => `/${t.category}/${t.slug}`;
export const categoryPath = (c: CategorySlug) => `/${c}`;

/** Names of compounded treatments in a category, for section disclaimers. */
export const compoundedIn = (cat: CategorySlug) => treatmentsIn(cat).filter((t) => t.compounded).map((t) => t.name);
