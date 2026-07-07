/**
 * @file ErrorBoundary.tsx
 * @description Error boundary component that catches JavaScript errors in the
 * child component tree and displays a fallback UI instead of crashing the app.
 * Uses only raw React Native components in the fallback so it cannot throw.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  I18nManager,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

import { plusJakarta } from '@/assets/fonts';
import AuthGridOverlay from '@/screens/auth/shared/AuthGridOverlay';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

const GRADIENT_LAYER = {
  position: 'absolute' as const,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const ErrorIcon = () => (
  <View style={iconStyles.wrapper}>
    <View style={iconStyles.iconRing}>
      <Svg width={moderateScale(36)} height={moderateScale(36)} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 8v5M12 16.5h.01"
          stroke={palette.purple.main}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
        <Path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke={palette.purple.main}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  </View>
);

const HelpIcon = ({ size = 18, color = palette.purple.main }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.6} />
    <Path d="M12 10v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="12" cy="7.5" r="1" fill={color} />
  </Svg>
);

type RetryButtonProps = {
  onPress: () => void;
};

const RetryButton = ({ onPress }: RetryButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [buttonStyles.root, pressed && buttonStyles.pressed]}
    accessibilityRole="button"
    accessibilityLabel="Try again"
  >
    <Text style={buttonStyles.label}>Try Again</Text>
    <Text style={buttonStyles.arrow}>{I18nManager.isRTL ? '←' : '→'}</Text>
  </Pressable>
);

const iconStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(4),
  },
  iconRing: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: palette.purple.surface,
    borderWidth: 1,
    borderColor: 'rgba(169, 19, 199, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const buttonStyles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: moderateScale(52),
    borderRadius: moderateScale(14),
    backgroundColor: palette.yellow.main,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    paddingHorizontal: moderateScale(24),
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontFamily: plusJakarta.bold,
    fontSize: moderateScale(15),
    color: palette.neutral.text,
    textAlign: 'center',
  },
  arrow: {
    fontFamily: plusJakarta.bold,
    fontSize: moderateScale(18),
    color: palette.neutral.text,
    lineHeight: moderateScale(20),
    marginTop: -1,
  },
});

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback when an error is caught */
  fallback?: ReactNode;
  /** Optional callback when an error is caught (e.g. for logging/crash reporting) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional support email for "Contact support" link */
  supportEmail?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that catches errors in child components and shows a fallback UI.
 * Provides a "Try again" action to clear the error state and re-render children.
 * Fallback uses only View/Text/Pressable so it never throws (e.g. no context deps).
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidMount(): void {
    this.setupGlobalHandler();
  }

  componentWillUnmount(): void {
    this.restoreGlobalHandler();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private previousGlobalHandler: ((error: unknown, isFatal?: boolean) => void) | null = null;

  private setupGlobalHandler = (): void => {
    const ErrorUtils = (globalThis as any).ErrorUtils;
    if (!ErrorUtils?.setGlobalHandler) return;
    this.previousGlobalHandler = ErrorUtils.getGlobalHandler?.() ?? null;
    ErrorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
      const err = error instanceof Error ? error : new Error(String(error));
      this.setState({ hasError: true, error: err });
      this.props.onError?.(err, { componentStack: '' });
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary (global handler):', err);
      }
    });
  };

  private restoreGlobalHandler = (): void => {
    const ErrorUtils = (globalThis as any).ErrorUtils;
    if (ErrorUtils?.setGlobalHandler && this.previousGlobalHandler) {
      ErrorUtils.setGlobalHandler(this.previousGlobalHandler);
    }
  };

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleContactSupport = (): void => {
    const email = this.props.supportEmail ?? 'support@ultimategrocery.com';
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={[styles.container, styles.aboveSplash]}>
          <StatusBar barStyle="light-content" backgroundColor={palette.purple.main} />
          <LinearGradient
            colors={[...theme.gradients.header]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={GRADIENT_LAYER}
            pointerEvents="none"
          />
          <AuthGridOverlay />

          <View style={styles.contentShell}>
            <Text style={styles.brandLabel}>Ultimate Grocery</Text>

            <View style={styles.card}>
              <ErrorIcon />
              <Text style={styles.title}>Something went wrong</Text>
              <Text style={styles.message}>
                We are having trouble loading your data. Please check your connection or try
                again in a moment.
              </Text>
              <View style={styles.buttonWrap}>
                <RetryButton onPress={this.handleRetry} />
              </View>
              <Pressable
                style={styles.supportLink}
                onPress={this.handleContactSupport}
                accessibilityRole="button"
                accessibilityLabel="Contact support"
              >
                <HelpIcon size={moderateScale(18)} color={palette.purple.main} />
                <Text style={styles.supportLinkText}>Need help? Contact support</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.purple.main,
  },
  aboveSplash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    ...(Platform.OS === 'android' && { elevation: 9999 }),
  },
  contentShell: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(40),
  },
  brandLabel: {
    alignSelf: 'center',
    marginBottom: moderateScale(20),
    fontFamily: plusJakarta.bold,
    fontSize: moderateScale(14),
    letterSpacing: moderateScale(0.6),
    color: 'rgba(255, 255, 255, 0.92)',
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.radius.xl,
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(28),
    paddingBottom: moderateScale(24),
    alignItems: 'center',
    ...theme.shadows.card,
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: plusJakarta.bold,
    color: Colors.text,
    marginBottom: moderateScale(10),
    textAlign: 'center',
  },
  message: {
    fontSize: moderateScale(14),
    fontFamily: plusJakarta.regular,
    color: Colors.textSecondary,
    marginBottom: moderateScale(24),
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  buttonWrap: {
    width: '100%',
  },
  supportLink: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(20),
    gap: moderateScale(8),
  },
  supportLinkText: {
    fontSize: moderateScale(14),
    fontFamily: plusJakarta.bold,
    color: palette.purple.main,
  },
});

export default ErrorBoundary;
