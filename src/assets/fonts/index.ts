/** Weights available for each bundled family (matches .ttf filenames after linking). */
export type FontWeights = {
  regular: string;
  bold: string;
  extraBold: string;
};

/** Plus Jakarta Sans — default UI / body */
export const plusJakarta: FontWeights = {
  regular: 'PlusJakartaSans-Regular',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
} as const;


/** Britti Sans Trial — two weights bundled (Regular + Semibold) */
export const brittiSans = {
  regular: 'BrittiSansTrial-Regular',
  semiBold: 'BrittiSansTrial-Semibold',
} as const;

/** Nasalization — single weight, display / headings */
export const nasalization = {
  regular: 'Nasalization-Regular',
} as const;

/** Shape kept for existing `family` imports; `light` maps to regular (no light .ttf). */
export type FontFamily = {
  regular: string;
  bold: string;
  light: string;
};

/**
 * Default sans stack for existing imports (`family.regular` / `family.bold`).
 * No light weight in assets — `light` falls back to regular.
 */
export const family: FontFamily = {
  regular: plusJakarta.regular,
  bold: plusJakarta.bold,
  light: plusJakarta.regular,
} as const;

/** Legacy display font — maps to Plus Jakarta until Life Savers assets are restored. */
export const lifeSavers: FontFamily = {
  regular: plusJakarta.regular,
  bold: plusJakarta.bold,
  light: plusJakarta.regular,
} as const;
