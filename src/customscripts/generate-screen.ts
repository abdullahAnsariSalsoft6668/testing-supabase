/**
 * AUTO SCREEN GENERATOR By Abdullah Ansari
 */

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';

type ScreenType = 'auth' | 'main' | 'tab';

interface ScreenInfo {
    screenName: string;
    screenType: ScreenType;
}

const isWatchMode = process.argv.includes('--watch');

// Helper functions
const toPascalCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[-_\s]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
const toCamelCase = (str: string) => { const p = toPascalCase(str); return p.charAt(0).toLowerCase() + p.slice(1); };
const getRouteKey = (name: string) => toCamelCase(name);

// Generate screen component content
function generateScreenComponent(screenName: string): string {
    const componentName = toPascalCase(screenName);
    return `import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const ${componentName}: React.FC = () => {
    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="${componentName}" />
            <View style={styles.content}>
                <TextComp text="Welcome to ${componentName}" />
            </View>
        </WrapperContainer>
    );
};

export default ${componentName};
`;
}

// Generate screen styles content
function generateStylesContent(): string {
    return `import { Colors } from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;
`;
}

// Update screens/index.ts
function updateScreensIndex(screenName: string, screenType: ScreenType): void {
    const projectRoot = path.join(__dirname, '..', '..');
    const indexPath = path.join(projectRoot, 'src', 'screens', 'index.ts');
    let content = fs.readFileSync(indexPath, 'utf8');
    const componentName = toPascalCase(screenName);
    const subDir = screenType === 'auth' ? 'auth' : 'main';

    // Always use PascalCase for folder and file
    const folderPath = screenType === 'tab' ? `main/TabScreens/${componentName}` : `${subDir}/${componentName}`;
    const importPath = `./${folderPath}/${componentName}`;

    if (!content.includes(`export { default as ${componentName} }`)) {
        content = content.trim() + `\nexport { default as ${componentName} } from '${importPath}';\n`;
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log(`✓ Updated screens/index.ts`);
    }
}

// Update src/constants/routes.ts
function updateRoutesFile(screenName: string, screenType: ScreenType): void {
    const projectRoot = path.join(__dirname, '..', '..');
    const routesPath = path.join(projectRoot, 'src', 'constants', 'routes.ts');
    let content = fs.readFileSync(routesPath, 'utf8');
    const routeKey = getRouteKey(screenName);
    const componentName = toPascalCase(screenName);
    const section = screenType === 'auth' ? 'auth' : screenType === 'tab' ? 'tab' : 'main';

    // 1. Add to routes object
    const objRegex = new RegExp(`(${section}:\\s*{)([^}]*)(})`, 's');
    content = content.replace(objRegex, (m, p1, p2, p3) => {
        if (p2.includes(`${routeKey}:`)) return m;
        const indent = '    ';
        const trimmed = p2.trim();
        const separator = trimmed && !trimmed.endsWith(',') ? ',\n' : trimmed ? '\n' : '\n';
        return `${p1}\n${indent}${trimmed}${separator}${indent}${routeKey}: '${componentName}',\n${p3}`;
    });

    // 2. Add to mapping object
    const mappingName = screenType === 'auth' ? 'authRoutes' : screenType === 'tab' ? 'tabRoutes' : 'mainRoutes';
    const mapRegex = new RegExp(`(export const ${mappingName} = \\{)([^}]*)(\\})`, 's');
    content = content.replace(mapRegex, (m, p1, p2, p3) => {
        const routeProp = `[routes.${section}.${routeKey}]`;
        if (p2.includes(routeProp)) return m;
        const indent = '  ';
        const trimmed = p2.trim();
        const separator = trimmed && !trimmed.endsWith(',') ? ',\n' : trimmed ? '\n' : '\n';
        return `${p1}\n${indent}${trimmed}${separator}${indent}${routeProp}: Screens.${componentName},\n${p3}`;
    });

    fs.writeFileSync(routesPath, content.replace(/\n\s*\n/g, '\n'), 'utf8');
    console.log(`✓ Updated constants/routes.ts`);
}

// Update navigation file
function updateNavigationFile(screenName: string, screenType: ScreenType): void {
    const routeKey = getRouteKey(screenName);
    const projectRoot = path.join(__dirname, '..', '..');
    let navPath = '', mapping = '', prop = '';

    if (screenType === 'auth') {
        navPath = path.join(projectRoot, 'src', 'navigation', 'AuthStack.tsx');
        mapping = 'authRoutes';
        prop = `routes.auth.${routeKey}`;
    } else {
        navPath = path.join(projectRoot, 'src', 'navigation', screenType === 'tab' ? 'TabStack.tsx' : 'MainStack.tsx');
        mapping = screenType === 'tab' ? 'tabRoutes' : 'mainRoutes';
        prop = `routes.main.${routeKey}`;
    }

    if (!fs.existsSync(navPath)) return;
    let content = fs.readFileSync(navPath, 'utf8');
    if (content.includes(`name={${prop}}`)) return;

    const navType = screenType === 'tab' ? 'Tab.Navigator' : 'Stack.Navigator';
    const tag = screenType === 'tab' ? 'Tab.Screen' : 'Stack.Screen';
    const closing = `</${navType}>`;
    const idx = content.indexOf(closing);

    if (idx !== -1) {
        const lineStart = content.lastIndexOf('\n', idx - 1) + 1;
        const closingIndent = content.slice(lineStart, idx).match(/^\s*/)?.[0] ?? '';
        const screenIndent = `${closingIndent}  `;
        const needsLeadingNewline = idx > 0 && content[idx - 1] !== '\n';
        const newScreen = `${needsLeadingNewline ? '\n' : ''}${screenIndent}<${tag} name={${prop}} component={${mapping}[${prop}]} />\n`;
        content = content.slice(0, idx) + newScreen + content.slice(idx);
        fs.writeFileSync(navPath, content, 'utf8');
        console.log(`✓ Updated ${path.basename(navPath)}`);
    }
}

// Update src/navigation/types.ts
function updateNavigationTypes(screenName: string, screenType: ScreenType): void {
    const projectRoot = path.join(__dirname, '..', '..');
    const typesPath = path.join(projectRoot, 'src', 'navigation', 'types.ts');
    if (!fs.existsSync(typesPath)) return;

    let content = fs.readFileSync(typesPath, 'utf8');
    const componentName = toPascalCase(screenName);
    const listName = screenType === 'auth' ? 'AuthStackParamList' : 'MainStackParamList';

    const listRegex = new RegExp(`(export type ${listName} = \\{)(.*?)(\\n};)`, 's');
    content = content.replace(listRegex, (m, p1, p2, p3) => {
        if (p2.includes(`${componentName}:`)) return m;
        const indent = '  ';
        let trimmed = p2.trimRight();
        if (!trimmed.endsWith('\n') && trimmed.length > 0) trimmed += '\n';
        return `${p1}${trimmed}${indent}${componentName}: undefined;${p3}`;
    });

    fs.writeFileSync(typesPath, content, 'utf8');
    console.log(`✓ Updated navigation/types.ts`);
}

function generateScreen(screenName: string, screenType: ScreenType): void {
    if (!screenName) return;
    console.log(`\n🚀 Generating ${screenType} screen: ${screenName}\n`);
    const projectRoot = path.join(__dirname, '..', '..');
    const componentName = toPascalCase(screenName);
    const subDir = screenType === 'auth' ? 'auth' : 'main';

    let folder = '';
    if (screenType === 'tab') folder = path.join(projectRoot, 'src', 'screens', 'main', 'TabScreens', componentName);
    else folder = path.join(projectRoot, 'src', 'screens', subDir, componentName);

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const indexPath = path.join(folder, `${componentName}.tsx`);
    if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, generateScreenComponent(screenName), 'utf8');

    const stylesPath = path.join(folder, 'styles.ts');
    if (!fs.existsSync(stylesPath)) fs.writeFileSync(stylesPath, generateStylesContent(), 'utf8');

    updateScreensIndex(screenName, screenType);
    updateRoutesFile(screenName, screenType);
    updateNavigationFile(screenName, screenType);
    updateNavigationTypes(screenName, screenType);
    console.log(`\n✅ Screen "${screenName}" generated!`);
}

const args = process.argv.slice(2).filter((a) => a !== '--watch');
if (args[0]) args[0].split(',').forEach(n => generateScreen(n.trim(), (args[1] || 'main') as ScreenType));

if (isWatchMode) {
    const projectRoot = path.join(__dirname, '..', '..');
    const authDir = path.join(projectRoot, 'src', 'screens', 'auth');
    const mainDir = path.join(projectRoot, 'src', 'screens', 'main');
    const tabDir = path.join(projectRoot, 'src', 'screens', 'main', 'TabScreens');
    chokidar.watch([authDir, mainDir, tabDir], { ignoreInitial: true, depth: 1 }).on('addDir', (p) => {
        const res = path.resolve(p), parent = path.dirname(res), name = path.basename(res);
        if (parent === authDir) generateScreen(toCamelCase(name), 'auth');
        else if (parent === tabDir) generateScreen(toCamelCase(name), 'tab');
        else if (parent === mainDir && name !== 'TabScreens') generateScreen(toCamelCase(name), 'main');
    });
}
