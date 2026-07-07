import { plusJakarta, brittiSans } from '@/assets/fonts';

/** App-wide sans (Plus Jakarta Sans). Matches auth / form UI in designs. */
export default {
    regular: plusJakarta.regular,
    bold: plusJakarta.bold,
    light: plusJakarta.regular,
    /** Britti Sans Trial — form labels on dark auth screens */
    label: brittiSans.regular,
    labelSemiBold: brittiSans.semiBold,
};
