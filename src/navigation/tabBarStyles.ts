import { Platform, StyleSheet } from 'react-native';

import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { typography } from '@/styles/typography';

export const TAB_ICON_SIZE = moderateScale(22);
export const TAB_INACTIVE_COLOR = `${palette.olive.muted}A3`;
export const TAB_ACTIVE_COLOR = palette.lime.main;

export const tabBarStyles = StyleSheet.create({
    outer: {
        position: 'absolute',
        left: theme.components.tabBar.inset,
        right: theme.components.tabBar.inset,
        bottom: moderateScale(8),
    },
    bar: {
        backgroundColor: theme.components.tabBar.backgroundColor,
        borderRadius: theme.components.tabBar.radius,
        borderWidth: 1,
        borderColor: theme.components.tabBar.borderColor,
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(8),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#1A1D26',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
            },
            android: { elevation: 3 },
            default: {},
        }),
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
    underlineTrack: {
        position: 'absolute',
        bottom: moderateScale(6),
        left: moderateScale(8),
        right: moderateScale(8),
        height: moderateScale(3),
    },
    underline: {
        width: moderateScale(22),
        height: moderateScale(3),
        borderRadius: moderateScale(2),
        backgroundColor: TAB_ACTIVE_COLOR,
    },
    tabLabel: typography.tab,
    tabLabelActive: {
        color: TAB_ACTIVE_COLOR,
        fontWeight: '700',
    },
    tabLabelInactive: {
        color: TAB_INACTIVE_COLOR,
    },
});
