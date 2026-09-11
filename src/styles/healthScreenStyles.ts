import { StyleSheet } from 'react-native';

import fontFamily from '@/styles/fontFamily';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { typography } from '@/styles/typography';

export const healthScreenStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.primary },
    body: { flex: 1, paddingHorizontal: spaces.medium, paddingTop: moderateScale(16) },
    scrollContent: { paddingBottom: moderateScale(120) },
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    cardTitle: { ...typography.label, fontSize: moderateScale(16) },
    cardMeta: { ...typography.bodySmall, marginTop: moderateScale(4) },
    backBtn: {
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(4),
        marginBottom: moderateScale(8),
    },
    backText: { ...typography.label, color: theme.palette.lime.main },
    primaryBtn: {
        borderRadius: theme.radius.button,
        marginTop: moderateScale(16),
        overflow: 'hidden',
    },
    primaryBtnText: typography.button,
    secondaryBtn: {
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(12),
        alignItems: 'center',
        marginTop: moderateScale(10),
        backgroundColor: theme.colors.button.secondaryBackground,
    },
    secondaryBtnText: {
        ...typography.label,
        color: theme.colors.text.primary,
        textTransform: 'none',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.radius.input,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        marginTop: moderateScale(8),
        backgroundColor: theme.components.input.backgroundColor,
        color: theme.colors.text.primary,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        minHeight: theme.components.input.height,
    },
    label: { ...typography.label, marginTop: moderateScale(12), textTransform: 'none' },
    error: { color: theme.colors.status.error, fontSize: moderateScale(12), marginTop: moderateScale(8) },
});
