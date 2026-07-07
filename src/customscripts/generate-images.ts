/**
 * AUTO IMAGE GENERATOR By Abdullah Ansari
 * Scans src/assets/images/*.{png,jpg,jpeg,gif,webp}
 * Regenerates src/assets/images/index.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';

/* ----------------------------------
   CONFIG
----------------------------------- */

const IMAGES_DIR = path.resolve(__dirname, '../assets/images');
const OUTPUT_FILE = path.resolve(__dirname, '../assets/images/index.ts');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

const isWatchMode = process.argv.includes('--watch');

/* ----------------------------------
   HELPERS
----------------------------------- */

const toCamelCase = (name: string): string =>
  name
    .replace(/[-_](.)/g, (_, g1) => g1.toUpperCase())
    .replace(/^(.)/, (m) => m.toLowerCase());

const isImageFile = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
};

/* ----------------------------------
   GENERATOR
----------------------------------- */

function generateImages(): void {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Images directory not found:', IMAGES_DIR);
    return;
  }

  const files = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => isImageFile(f) && f !== 'index.ts');

  const typeEntries: string[] = [];
  const mapEntries: string[] = [];

  files.forEach((file) => {
    const baseName = path.basename(file, path.extname(file));
    const key = toCamelCase(baseName);

    typeEntries.push(`    ${key}: ImageSourcePropType;`);
    mapEntries.push(`    ${key}: require('./${file}'),`);
  });

  const content = `/**
 * ⚠️ AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY By Abdullah Ansari
 */

import { ImageSourcePropType } from 'react-native';

export type LocalImages = {
${typeEntries.join('\n')}
};

export const localImages: LocalImages = {
${mapEntries.join('\n')}
} as const;
`;

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`✅ Images index generated (${files.length} images)`);
}

/* ----------------------------------
   RUN
----------------------------------- */

generateImages();

/* ----------------------------------
   WATCH MODE
----------------------------------- */

if (isWatchMode) {
  console.log('👀 Watching images folder...');
  chokidar
    .watch(IMAGES_DIR, { ignoreInitial: true })
    .on('add', generateImages)
    .on('unlink', generateImages)
    .on('change', generateImages);
}
