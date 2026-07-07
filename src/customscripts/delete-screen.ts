/**
 * AUTO SCREEN DELETER By Abdullah Ansari
 */

import * as fs from 'fs';
import * as path from 'path';

type ScreenType = 'auth' | 'main' | 'tab';

// Helper functions
const toPascalCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[-_\s]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
const toCamelCase = (str: string) => { const p = toPascalCase(str); return p.charAt(0).toLowerCase() + p.slice(1); };
const getRouteKey = (name: string) => toCamelCase(name);

function deleteScreen(screenName: string, screenType: ScreenType): void {
    const projectRoot = path.join(__dirname, '..', '..');
    const routeKey = getRouteKey(screenName);
    const componentName = toPascalCase(screenName);
    const section = screenType === 'auth' ? 'auth' : screenType === 'tab' ? 'tab' : 'main';

    console.log(`\n🗑️ Deleting ${screenType} screen: ${screenName}\n`);

    // 1. Delete Folder
    const subDir = screenType === 'auth' ? 'auth' : 'main';
    let folder = '';
    if (screenType === 'tab') folder = path.join(projectRoot, 'src', 'screens', 'main', 'TabScreens', componentName);
    else folder = path.join(projectRoot, 'src', 'screens', subDir, componentName);

    if (fs.existsSync(folder)) {
        fs.rmSync(folder, { recursive: true, force: true });
        console.log(`✓ Deleted folder: ${path.relative(projectRoot, folder)}`);
    }

    // 2. Update screens/index.ts
    const indexFile = path.join(projectRoot, 'src', 'screens', 'index.ts');
    if (fs.existsSync(indexFile)) {
        let content = fs.readFileSync(indexFile, 'utf8');
        content = content.replace(new RegExp(`export { default as ${componentName} } from [^;]+;\\n?`, 'g'), '');
        fs.writeFileSync(indexFile, content, 'utf8');
        console.log(`✓ Updated screens/index.ts`);
    }

    // 3. Update constants/routes.ts
    const routesFile = path.join(projectRoot, 'src', 'constants', 'routes.ts');
    if (fs.existsSync(routesFile)) {
        let content = fs.readFileSync(routesFile, 'utf8');

        // Remove from routes object
        const objRegex = new RegExp(`(${section}:\\s*{)([^}]*)(})`, 's');
        content = content.replace(objRegex, (m, p1, p2, p3) => {
            const entryRegex = new RegExp(`\\s+${routeKey}:\\s*'[^']+',?\\n?`, 'g');
            return `${p1}${p2.replace(entryRegex, '')}${p3}`;
        });

        // Remove from mapping object
        const mappingName = screenType === 'auth' ? 'authRoutes' : screenType === 'tab' ? 'tabRoutes' : 'mainRoutes';
        const mapRegex = new RegExp(`(export const ${mappingName} = \\{)([^}]*)(\\})`, 's');
        content = content.replace(mapRegex, (m, p1, p2, p3) => {
            const propRegex = new RegExp(`\\s+\\[routes\\.${section}\\.${routeKey}\\]:[^,]+,?\\n?`, 'g');
            return `${p1}${p2.replace(propRegex, '')}${p3}`;
        });

        fs.writeFileSync(routesFile, content.replace(/\n\s*\n/g, '\n'), 'utf8');
        console.log(`✓ Updated constants/routes.ts`);
    }

    // 4. Update Navigation
    let navPath = '', prop = '';
    if (screenType === 'auth') {
        navPath = path.join(projectRoot, 'src', 'navigation', 'AuthStack.tsx');
        prop = `routes.auth.${routeKey}`;
    } else {
        navPath = path.join(projectRoot, 'src', 'navigation', screenType === 'tab' ? 'TabStack.tsx' : 'MainStack.tsx');
        prop = `routes.main.${routeKey}`;
    }

    if (fs.existsSync(navPath)) {
        let content = fs.readFileSync(navPath, 'utf8');
        content = content.replace(new RegExp(`\\s+<[^>]+Screen\\s+name=\\{${prop.replace(/\./g, '\\.')}\\}\\s+component=\\{[^}]+\\}\\s*/>\\n?`, 'g'), '');
        fs.writeFileSync(navPath, content, 'utf8');
        console.log(`✓ Updated ${path.basename(navPath)}`);
    }

    // 5. Update navigation/types.ts
    const typesFile = path.join(projectRoot, 'src', 'navigation', 'types.ts');
    if (fs.existsSync(typesFile)) {
        let content = fs.readFileSync(typesFile, 'utf8');
        const listName = screenType === 'auth' ? 'AuthStackParamList' : 'MainStackParamList';
        const listRegex = new RegExp(`(export type ${listName} = \\{)(.*?)(\\n};)`, 's');
        content = content.replace(listRegex, (m, p1, p2, p3) => {
            const entryRegex = new RegExp(`^\\s+${componentName}:\\s*undefined;?\\n?`, 'gm');
            let updatedP2 = p2.replace(entryRegex, '');
            if (updatedP2.trim() === '') updatedP2 = '\n';
            else if (!updatedP2.endsWith('\n')) updatedP2 += '\n';
            return `${p1}${updatedP2}${p3}`;
        });
        fs.writeFileSync(typesFile, content, 'utf8');
        console.log(`✓ Updated navigation/types.ts`);
    }

    console.log(`\n✅ Screen "${screenName}" deleted!`);
}

const args = process.argv.slice(2);
if (args[0]) args[0].split(',').forEach(n => deleteScreen(n.trim(), (args[1] || 'main') as ScreenType));
else console.log('Usage: ts-node delete-screen.ts <screenName> [type]');
