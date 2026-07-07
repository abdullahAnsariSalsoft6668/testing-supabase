/**
 * AUTO ICON GENERATOR By Abdullah Ansari
 * Scans src/assets/icons/*.svg
 * Regenerates src/components/MyIcons/index.tsx
 */

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';

/* ----------------------------------
   CONFIG
----------------------------------- */

const ICONS_DIR = path.resolve(__dirname, '../assets/icons');
const OUTPUT_FILE = path.resolve(
  __dirname,
  '../components/MyIcons.tsx'
);

const isWatchMode = process.argv.includes('--watch');

/* ----------------------------------
   HELPERS
----------------------------------- */

const toCamelCase = (name: string): string =>
  name
    .replace(/[-_](.)/g, (_, g1) => g1.toUpperCase())
    .replace(/^(.)/, (m) => m.toLowerCase());

const toPascalCase = (name: string): string =>
  name
    .replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase());

/* ----------------------------------
   GENERATOR
----------------------------------- */

function generateIcons(): void {
  if (!fs.existsSync(ICONS_DIR)) {
    console.error('❌ Icons directory not found:', ICONS_DIR);
    return;
  }

  const files = fs
    .readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith('.svg'));

  const imports: string[] = [];
  const mapEntries: string[] = [];
  const iconNames: string[] = [];

  files.forEach((file) => {
    const baseName = file.replace('.svg', '');
    const iconName = toCamelCase(baseName);
    const componentName = toPascalCase(baseName);

    imports.push(
      `import ${componentName} from '@/assets/icons/${file}';`
    );

    mapEntries.push(`  ${iconName}: ${componentName},`);
    iconNames.push(`  | '${iconName}'`);
  });

  const content = `/**
 * ⚠️ AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY By Abdullah Ansari
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

${imports.join('\n')}

export type IconName =
${iconNames.join('\n')};

type IconComponent = React.FC<SvgProps>;

const iconMap: Record<IconName, IconComponent> = {
${mapEntries.join('\n')}
};

export interface MyIconsProps {
  name: IconName;
  size?: number;
  stroke?: string;
  fill?: string;
  style?: ViewStyle;
}

const MyIcons: React.FC<MyIconsProps> = ({
  name,
  size = 20,
  stroke,
  fill = 'none',
  style,
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(\`[MyIcons] Icon "\${name}" not found\`);
    return null;
  }

  return (
    <View style={style}>
      <IconComponent
        width={size}
        height={size}
        stroke={stroke || undefined}
        fill={fill}
      />
    </View>
  );
};

export { iconMap };
export default MyIcons;
`;

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`✅ MyIcons generated (${files.length} icons)`);
}

/* ----------------------------------
   RUN
----------------------------------- */

generateIcons();

/* ----------------------------------
   WATCH MODE
----------------------------------- */

if (isWatchMode) {
  console.log('👀 Watching icons folder...');
  chokidar
    .watch(ICONS_DIR, { ignoreInitial: true })
    .on('add', generateIcons)
    .on('unlink', generateIcons)
    .on('change', generateIcons);
}
