# Custom Scripts Documentation

This document explains how to use the custom TypeScript scripts for automated screen and icon generation in this React Native boilerplate.

## 📋 Table of Contents

- [Screen Generator](#screen-generator)
- [Screen Deleter](#screen-deleter)
- [Icon Generator](#icon-generator)
- [Examples](#examples)

---

## 🚀 Screen Generator

Automatically generates screen components with proper navigation setup and routing configuration.

### Usage

```bash
# Generate a single screen
yarn generate:screen <screenName> [type]

# Generate multiple screens (comma-separated)
yarn generate:screen screen1,screen2,screen3 [type]

# Watch mode - auto-generate when new folders are created
yarn generate:screen:watch
```

### Parameters

- **screenName**: Name of the screen (e.g., "userProfile", "settings")
  - Can be comma-separated for multiple screens
  - Supports camelCase, PascalCase, or kebab-case
- **type**: Screen type (optional, default: "main")
  - `auth` - Authentication screens (Login, Signup, etc.)
  - `main` - Main app screens
  - `tab` - Tab navigation screens

### What it does

1. ✅ Creates screen folder with proper naming convention
2. ✅ Generates `index.tsx` with TypeScript component
3. ✅ Updates `src/navigation/Routes.ts` with new route
4. ✅ Adds screen to appropriate navigation stack
5. ✅ Uses boilerplate components (WrapperContainer, TextComp, HeaderComp)

### Examples

```bash
# Generate a main screen
yarn generate:screen userProfile main

# Generate multiple auth screens
yarn generate:screen login,signup,forgotPassword auth

# Generate tab screens
yarn generate:screen home,profile,settings tab

# Watch mode
yarn generate:screen:watch
```

### Generated Structure

**Auth Screen:**
```
src/screens/Auth/
  └── UserProfile/
      └── index.tsx
```

**Main Screen:**
```
src/screens/Main/
  └── user-profile/
      └── index.tsx
```

**Tab Screen:**
```
src/screens/Main/TabScreens/
  └── home/
      └── index.tsx
```

---

## 🗑️ Screen Deleter

Removes screens and cleans up all references from the codebase.

### Usage

```bash
# Delete a single screen
yarn delete:screen <screenName> <type>

# Delete multiple screens (comma-separated)
yarn delete:screen screen1,screen2,screen3 <type>
```

### Parameters

- **screenName**: Name of the screen to delete
- **type**: Screen type (required)
  - `auth`, `main`, or `tab`

### What it does

1. ✅ Deletes screen folder
2. ✅ Removes route from `Routes.ts`
3. ✅ Removes screen from navigation stack
4. ✅ Cleans up all imports

### Examples

```bash
# Delete a main screen
yarn delete:screen userProfile main

# Delete multiple auth screens
yarn delete:screen login,signup auth

# Delete tab screen
yarn delete:screen home tab
```

⚠️ **WARNING**: This permanently deletes files. Make sure to commit your changes before deleting screens.

---

## 🎨 Icon Generator

Automatically generates a typed icon component from SVG files.

### Usage

```bash
# Generate icons once
yarn generate:icons

# Watch mode - auto-regenerate when icons change
yarn generate:icons:watch
```

### How it works

1. Scans `src/assets/icons/*.svg`
2. Generates `src/components/MyIcons/index.tsx`
3. Creates TypeScript types for all icon names
4. Provides type-safe icon component

### Adding New Icons

1. Add your SVG file to `src/assets/icons/`
2. Run `yarn generate:icons`
3. Use the icon in your code:

```tsx
import MyIcons from '@/components/MyIcons';

<MyIcons 
  name="arrowLeft"  // ✅ Type-safe! Auto-complete works
  size={24}
  stroke="#000"
/>
```

### Generated Types

The generator creates a union type of all available icons:

```typescript
export type IconName =
  | 'arrowLeft'
  | 'arrowRight'
  | 'home'
  | 'profile'
  // ... all your icons
```

---

## 📝 Examples

### Complete Workflow Example

```bash
# 1. Start watch mode for icons
yarn generate:icons:watch

# 2. In another terminal, start screen watch mode
yarn generate:screen:watch

# 3. Add SVG icons to src/assets/icons/
# Icons are automatically generated!

# 4. Create a new folder in src/screens/Main/
# Screen is automatically generated!

# 5. Customize your generated screen
# Edit the generated index.tsx file

# 6. If you need to delete a screen
yarn delete:screen oldScreen main
```

### Multi-Screen Generation

```bash
# Generate entire auth flow at once
yarn generate:screen login,signup,forgotPassword,resetPassword auth

# Generate main app screens
yarn generate:screen home,profile,settings,notifications main

# Generate bottom tab screens
yarn generate:screen home,explore,favorites,profile tab
```

---

## 🛠️ Technical Details

### File Naming Conventions

- **Auth screens**: PascalCase folders (e.g., `Login`, `Signup`)
- **Main screens**: kebab-case folders (e.g., `user-profile`, `settings`)
- **Tab screens**: kebab-case folders (e.g., `home`, `profile`)
- **All screen files**: `index.tsx`

### Component Structure

Generated screens use the boilerplate's component structure:

```tsx
import { Colors } from '@/styles/colors';
import { useTheme } from '@/context/ThemeContext';
import WrapperContainer from '@/components/WrapperContainer';
import TextComp from '@/components/TextComp';
import HeaderComp from '@/components/HeaderComp';

const ScreenName: React.FC = () => {
  const { theme } = useTheme();
  const colors = Colors[theme ?? 'light'];

  return (
    <WrapperContainer>
      <HeaderComp title="ScreenName" />
      {/* Your content here */}
    </WrapperContainer>
  );
};
```

### TypeScript Support

All scripts are written in TypeScript with full type safety:

- ✅ Type-safe screen generation
- ✅ Type-safe icon names
- ✅ Proper error handling
- ✅ IntelliSense support

---

## 🐛 Troubleshooting

### Script not found

Make sure you've installed dependencies:
```bash
yarn install
```

### TypeScript errors

Ensure `@types/node` and `ts-node` are installed:
```bash
yarn add -D @types/node ts-node
```

### Watch mode not working

Check that `chokidar` is installed:
```bash
yarn add -D chokidar
```

---

## 📚 Additional Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)

---

**Created by Abdullah Ansari**
