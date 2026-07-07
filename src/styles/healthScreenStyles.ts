import { StyleSheet } from 'react-native';

import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

export const healthScreenStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
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
    cardTitle: { fontSize: moderateScale(16), fontWeight: '700', color: theme.colors.text.primary },
    cardMeta: { fontSize: moderateScale(13), color: theme.colors.text.secondary, marginTop: moderateScale(4) },
    backBtn: {
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(4),
        marginBottom: moderateScale(8),
    },
    backText: { color: theme.colors.text.inverse, fontSize: moderateScale(14), fontWeight: '600' },
    primaryBtn: {
        backgroundColor: theme.colors.button.primaryBackground,
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(14),
        alignItems: 'center',
        marginTop: moderateScale(16),
    },
    primaryBtnText: { color: theme.colors.button.primaryText, fontWeight: '700', fontSize: moderateScale(15) },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: theme.palette.teal.main,
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(12),
        alignItems: 'center',
        marginTop: moderateScale(10),
    },
    secondaryBtnText: { color: theme.palette.teal.main, fontWeight: '600', fontSize: moderateScale(14) },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.radius.md,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        marginTop: moderateScale(8),
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary,
    },
    label: { fontSize: moderateScale(13), fontWeight: '600', color: theme.colors.text.primary, marginTop: moderateScale(12) },
    error: { color: theme.colors.status.error, fontSize: moderateScale(12), marginTop: moderateScale(8) },
});
