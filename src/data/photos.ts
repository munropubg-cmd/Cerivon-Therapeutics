/*
 * Lifestyle photography. Strings are the client-approved photos in public/assets/img/people;
 * numbers are Pexels photos (free for commercial use) served from the Pexels CDN.
 * `pic(p, w, h)` gives one URL, `picSet(p, w, h)` a 1x/2x srcSet (Pexels only).
 */
type Photo = string | number;

export const px = (id: number, w: number, h?: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}&fit=crop` : ''}`;
export const pic = (p: Photo, w: number, h?: number) => (typeof p === 'string' ? p : px(p, w, h));
export const picSet = (p: Photo, w: number, h?: number) =>
  typeof p === 'string' ? undefined : `${px(p, w, h)} 1x, ${px(p, w * 2, h ? h * 2 : undefined)} 2x`;

const L = '/assets/img/people';
export const PHOTOS = {
  hero: `${L}/hero.webp`,         // woman in her forties, face to the sun under a blue sky
  weight: `${L}/weight.webp`,     // woman, 40s, running by the sea
  skincare: `${L}/skincare.webp`, // woman, 40s, natural skin, smiling
  hair: `${L}/hair.webp`,         // man, mid-40s, hand in his hair, face to the evening sun
  hrt: `${L}/hrt.webp`,           // woman, 40s, eyes closed at home
  sexual: `${L}/sexual.webp`,     // couple, embrace
  peptides: `${L}/peptides.webp`, // woman stretching, warm studio
  careTeam: 6787970,              // couple, 60s, on a laptop together (Pexels)
  experienceHome: 5591272,        // woman, 50s, laptop on the sofa (Pexels)
  experienceLife: `${L}/calm.webp`, // woman in her forties, a calm moment at home
  cta: `${L}/together.webp`,      // three women, 40s to 60s, laughing under a blue sky
} as const;
