import { STORAGE_KEYS } from "@/utils/secureStorage";

export type ThemeMode = 'light' | 'dark';
export type Language = "en" | "ar" | "fr";
export type StorageKey = keyof typeof STORAGE_KEYS;

declare module '*.svg' {
    import type React from 'react';
    import type { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
} 