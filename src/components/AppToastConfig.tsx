import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

/** Optional `props` passed through `Toast.show({ props })` or `meta.toastProps` (API layer). */
export type AppToastCustomProps = {
  leadingIcon?: 'auto' | 'none' | 'success' | 'error' | 'info';
  /** Merged into outer card (e.g. margin tweaks) */
  containerStyle?: StyleProp<ViewStyle>;
  /** e.g. `'api'` when shown from `showGlobalApiToasts` */
  source?: string;
};

type Kind = 'success' | 'error' | 'info';

function resolveKind(
  type: string | undefined,
  leading: AppToastCustomProps['leadingIcon'],
): Kind {
  if (leading && leading !== 'auto' && leading !== 'none') {
    return leading;
  }
  if (type === 'error') {
    return 'error';
  }
  if (type === 'info') {
    return 'info';
  }
  return 'success';
}

const ACCENT: Record<Kind, string> = {
  success: Colors.success,
  error: Colors.error,
  info: Colors.info,
};

function LeadingIcon({ kind, hide }: { kind: Kind; hide: boolean }) {
  if (hide) {
    return null;
  }
  const label = kind === 'success' ? '✓' : kind === 'error' ? '!' : 'i';
  return (
    <View style={[styles.leadingWrap, { borderColor: ACCENT[kind] }]}>
      <View style={[styles.leadingInner, { backgroundColor: ACCENT[kind] }]}>
        <Text style={styles.leadingGlyph}>{label}</Text>
      </View>
    </View>
  );
}

function renderToastRow(
  params: ToastConfigParams<AppToastCustomProps>,
  fallbackKind: Kind,
) {
  const { text1, text2, onPress, props } = params;
  const p = props ?? {};
  const kind =
    p.leadingIcon === 'none'
      ? fallbackKind
      : resolveKind(params.type, p.leadingIcon ?? 'auto');
  const hideIcon = p.leadingIcon === 'none';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, p.containerStyle]}
      accessibilityRole="alert"
    >
      <LeadingIcon kind={kind} hide={hideIcon} />
      <View style={styles.textBlock}>
        {text1 ? (
          <Text style={styles.text1} numberOfLines={3}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={styles.text2} numberOfLines={4}>
            {text2}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export const appToastConfig: ToastConfig = {
  success: (params) => renderToastRow(params, 'success'),
  error: (params) => renderToastRow(params, 'error'),
  info: (params) => renderToastRow(params, 'info'),
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(14),
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  leadingWrap: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    borderWidth: moderateScale(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(8),
  },
  leadingInner: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingGlyph: {
    color: Colors.white,
    fontSize: moderateScale(11),
    fontFamily: fontFamily.bold,
    marginTop: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  text1: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(15),
    color: Colors.black,
    letterSpacing: 0.15,
  },
  text2: {
    marginTop: moderateScale(4),
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(13),
    color: Colors.gray500,
    lineHeight: moderateScale(18),
  },
});
