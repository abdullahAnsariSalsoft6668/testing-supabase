import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

export const adminScreenStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(120),
        gap: moderateScale(14),
    },
    bodyList: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(120),
    },
    bodyForm: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(60),
        gap: moderateScale(16),
    },

    /* Header actions */
    headerAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(7),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    headerAddBtnText: {
        color: theme.colors.text.inverse,
        fontSize: moderateScale(13),
        fontWeight: '600',
    },

    /* Stats */
    statsBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: theme.colors.brand.primary,
    },
    statLabel: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    /* Cards */
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: moderateScale(16),
        gap: moderateScale(12),
    },
    cardInfo: { flex: 1 },
    cardTitle: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    cardMeta: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        flex: 1,
    },
    cardDesc: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(6),
        lineHeight: moderateScale(18),
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(4),
        gap: moderateScale(5),
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.default,
        marginHorizontal: moderateScale(16),
    },
    iconBadge: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(14),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
    },
    avatarCircle: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    avatarText: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: theme.palette.teal.main,
    },

    /* Actions */
    actions: {
        flexDirection: 'row',
        padding: moderateScale(12),
        gap: moderateScale(10),
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(6),
    },
    editBtn: { backgroundColor: theme.palette.teal.surface },
    editBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.palette.teal.main,
    },
    deleteBtn: {
        backgroundColor: theme.palette.status.error + '12',
        borderWidth: 1,
        borderColor: theme.palette.status.error + '33',
    },
    deleteBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.palette.status.error,
    },
    approveBtn: { backgroundColor: theme.palette.teal.main },
    approveBtnText: {
        color: theme.colors.text.inverse,
        fontWeight: '700',
        fontSize: moderateScale(13),
    },
    rejectBtn: {
        backgroundColor: theme.palette.status.error + '12',
        borderWidth: 1,
        borderColor: theme.palette.status.error + '33',
    },
    rejectBtnText: {
        color: theme.palette.status.error,
        fontWeight: '600',
        fontSize: moderateScale(13),
    },

    /* Filter tabs */
    filterRow: { flexDirection: 'row', gap: moderateScale(8) },
    filterTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(5),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(10),
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    filterTabActive: {
        backgroundColor: theme.colors.background.primary,
        borderColor: theme.colors.background.primary,
    },
    filterTabText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    filterTabTextActive: { color: theme.palette.teal.main },

    /* Info card rows */
    infoCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        gap: moderateScale(12),
    },
    infoIconWrap: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(10),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
    },
    infoContent: { flex: 1 },
    infoLabel: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    infoValue: {
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        fontWeight: '500',
        marginTop: moderateScale(2),
    },
    rowDivider: { height: 1, backgroundColor: theme.colors.border.default },

    /* Forms */
    formCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    fieldDivider: {
        height: 1,
        backgroundColor: theme.colors.border.default,
        marginHorizontal: moderateScale(16),
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        gap: moderateScale(12),
    },
    fieldLabel: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: moderateScale(6),
    },
    input: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.radius.md,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
    },
    multilineInput: { minHeight: moderateScale(72), paddingTop: moderateScale(10) },
    saveBtn: {
        flexDirection: 'row',
        backgroundColor: theme.colors.brand.primary,
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    saveBtnDisabled: { opacity: 0.7 },
    saveBtnText: {
        color: theme.colors.text.inverse,
        fontWeight: '700',
        fontSize: moderateScale(15),
    },

    /* Badges */
    hospitalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
        backgroundColor: theme.palette.sky.main,
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(3),
        borderRadius: moderateScale(20),
        marginTop: moderateScale(6),
    },
    hospitalBadgeText: {
        fontSize: moderateScale(11),
        color: theme.palette.sky.accent,
        fontWeight: '600',
    },
    roleBadge: {
        backgroundColor: theme.palette.teal.surface,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(3),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    roleText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: theme.palette.teal.main,
        letterSpacing: 0.5,
    },
});
