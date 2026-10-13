/*
 * Site-wide facts and required wording.
 * The state coverage statement and disclosures are compliance copy: keep the wording exactly as written.
 */

export const BRAND = 'Cerivon Therapeutics';
export const DOMAIN = 'www.cerivontherapeutics.com';

export const PARTNERS = {
  clinical: { name: 'Elite Care Health', email: 'mayur@elite-care.health', phone: '(810) 348-3003', tel: '+18103483003' },
  pharmacy: { name: 'Rx Ave Health', email: 'info@rxave.health', phone: '(833) 360-4276', tel: '+18333604276' },
};

// TODO before launch: the client's own support phone, email and business address (not supplied yet).
export const CONTACT = {
  phone: '',
  email: '',
  address: '',
};

/** Role disclosure (Karpa guidance #1): every page, How it works, and treatment pages. */
export const ROLE_DISCLOSURE =
  `${BRAND} is a technology platform and does not prescribe, dispense, or compound medications. ` +
  'All clinical and treatment decisions are made by independent licensed providers, and all prescriptions are filled and shipped by licensed pharmacies.';

/** Compounded-medication disclosure (Karpa guidance #2): only near products that are actually compounded. */
export const COMPOUNDED_DISCLOSURE =
  'Compounded medications are not FDA-approved. The FDA does not verify the safety, effectiveness, or quality of compounded medications. ' +
  'All treatment decisions are made by a licensed medical provider based on an individual evaluation.';

/** HRT requirement from the build brief. */
export const HRT_NOTE =
  'Hormone therapy requires an evaluation by a licensed provider and lab testing where appropriate before any treatment decision is made.';

export const NOT_GUARANTEED =
  'Completing an intake does not guarantee a prescription. Treatment is prescribed only when a licensed provider determines it is clinically appropriate.';

export const EMERGENCY = 'If you are experiencing a medical emergency, call 911 or go to the nearest emergency room.';

/** Announcement bar messages (rotate). */
export const ANNOUNCEMENTS = [
  'Every intake is reviewed by a licensed provider',
  'Private online visit, no waiting rooms',
  'Discreet delivery from a licensed U.S. pharmacy',
  'Ongoing check-ins with your care team',
];
