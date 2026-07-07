import { Platform, StyleSheet } from 'react-native';

import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

export const TAB_ICON_SIZE = moderateScale(24);
export const TAB_INACTIVE_COLOR = palette.neutral.textSecondary;
export const TAB_ACTIVE_COLOR = palette.teal.main;

export const tabBarStyles = StyleSheet.create({
    outer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.tab.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: palette.neutral.gray100,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
            default: {},
        }),
    },
    bar: {
        backgroundColor: theme.colors.tab.background,
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(4),
    },
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(8),
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: moderateScale(4),
        minWidth: moderateScale(56),
        gap: moderateScale(5),
    },
    tabLabel: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.regular,
        textAlign: 'center',
    },
    tabLabelActive: {
        color: TAB_ACTIVE_COLOR,
        fontFamily: plusJakarta.bold,
    },
    tabLabelInactive: {
        color: TAB_INACTIVE_COLOR,
    },
});
