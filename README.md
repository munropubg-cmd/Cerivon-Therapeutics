# Cerivon Therapeutics: website (React + Vite + Framer Motion)

```bash
npm install
npm run dev      # http://localhost:5282
npm run build    # production build → dist/
```

`_template-reference/` is the original static template, kept only for reference. It is not part of the app.

## Where to edit

| What | File |
| --- | --- |
| Treatments, categories, product copy (Karpa-compliant) | `src/data/treatments.ts` |
| Intake form URLs (empty → built-in `/start/<slug>` page) | `src/data/intake.ts` |
| Company contact details, partners, required disclosures | `src/data/site.ts` |
| FAQs (incl. "Which states do you serve?") | `src/data/faqs.tsx` |
| Legal pages | `src/data/legal.ts` |
| Brand colours + section palette | `src/styles/cerivon.css` (top of file) |
| Template layout/animation styles (ported, palette remapped) | `src/styles/base.css` |

## Colour system
Brand colours (navy, cyan, deep teal) are used for the announcement bar, buttons, links, final CTA and footer. The header and hero stay light, as in the template.
Buttons match each section's vibe. They are white pills (navy text) on the photo sections (Weight, Hair Loss, Sexual Health, HRT) and pink on Skincare. Peptides, the hero, the final CTA and the footer keep deep teal. Navy slides in on hover.
Photo sections: each photo fades into a colour sampled from its own rows where it fades. Weight is hazy pale sky, Hair Loss is clear beach sky, Sexual Health goes from sky to Mediterranean sea blue, Skincare is peach blush, and HRT is deep teal. Peptides is untouched. Homepage order (chosen for colour rhythm): Weight, Skincare, Hair Loss, HRT, Peptides, Sexual Health. Photos live in public/assets/img/sections/.
"Find care for your goal" keeps the template's four pastels: mint, sand, blush and sage.

## Before launch
- Swap the placeholder logo in `src/components/Logo.tsx` for the client's SVGs (Full Color + Dark Background).
- Product images: 22 products use the client's teal-capped renders, with labels baked in (Inter Regular). They show the product name, form and "Rx only", and no branding, per the brief. Full-resolution transparent PNGs of every labeled product are in the Product Renders/ folder, ready to reuse. To add or relabel a product, edit PRODUCTS in tools/label-products.cjs and run node tools/label-products.cjs. That updates both the site webp files and the PNG folder. Cap colours per category are set in TINTS. The Estradiol Patch still uses a placeholder until a patch render is supplied.
- Fill `CONTACT` in `src/data/site.ts` and the intake URLs in `src/data/intake.ts`.
- Confirm with Rx Ave Health: Cashmere Cream ingredients, whether the estradiol capsule is compounded, and which peptides, PT-141 and GHK-Cu they can compound today (Karpa heads-up). Items still waiting on confirmation show a "Before launch" note on their treatment page.
- Have counsel review the legal pages.
