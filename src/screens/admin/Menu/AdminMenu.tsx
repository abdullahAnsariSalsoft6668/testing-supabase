import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

const AdminMenu = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [syncing, setSyncing] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await syncAuthFromSupabase();
            Toast.show({ type: 'success', text1: 'Session refreshed' });
        } catch {
            Toast.show({ type: 'error', text1: 'Refresh failed' });
        } finally {
            setSyncing(false);
        }
    };

    const handleSignOut = async () => {
        setSigningOut(true);
        await clearDataAction();
    };

    const initials = (name: string) =>
        name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

    return (
        <View style={styles.screen}>
            <HealthScreenHeader title="Account" subtitle="Admin settings" />
            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <TextComp text={initials(user.full_name ?? 'A')} style={styles.avatarText} />
                    </View>
                    <TextComp text={user.full_name ?? ''} style={styles.profileName} />
                    <View style={styles.roleBadge}>
                        <TextComp text="ADMIN" style={styles.roleText} />
                    </View>
                </View>

                {/* Info rows */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconWrap}>
                            <MyIcons name="emailIcon" size={16} stroke={theme.palette.teal.main} />
                        </View>
                        <View style={styles.infoContent}>
                            <TextComp text="Email" style={styles.infoLabel} />
                            <TextComp text={user.email ?? ''} style={styles.infoValue} />
                        </View>
                    </View>
                    <View style={styles.rowDivider} />
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconWrap}>
                            <MyIcons name="userIcon" size={16} stroke={theme.palette.teal.main} />
                        </View>
                        <View style={styles.infoContent}>
                            <TextComp text="Role" style={styles.infoLabel} />
                            <TextComp text={user.role ?? 'ADMIN'} style={styles.infoValue} />
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsCard}>
                    <Pressable style={styles.menuItem} onPress={handleSync} disabled={syncing}>
                        <View style={[styles.menuIconWrap, { backgroundColor: theme.palette.sky.main }]}>
                            {syncing ? (
                                <ActivityIndicator size="small" color={theme.palette.sky.accent} />
                            ) : (
                                <MyIcons name="notification" size={18} stroke={theme.palette.sky.accent} />
                            )}
                        </View>
                        <View style={styles.menuItemContent}>
                            <TextComp text="Refresh Session" style={styles.menuItemTitle} />
                            <TextComp text="Sync your account role and profile" style={styles.menuItemSub} />
                        </View>
                        <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.secondary} />
                    </Pressable>
                </View>

                <Pressable
                    style={[styles.signOutBtn, signingOut && styles.signOutBtnDisabled]}
                    onPress={handleSignOut}
                    disabled={signingOut}
                >
                    {signingOut ? (
                        <ActivityIndicator size="small" color={theme.palette.status.error} />
                    ) : (
                        <>
                            <MyIcons name="close" size={16} stroke={theme.palette.status.error} />
                            <TextComp text="Sign Out" style={styles.signOutText} />
                        </>
                    )}
                </Pressable>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(120),
        gap: moderateScale(14),
    },

    /* Profile card */
    profileCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(24),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    avatarWrap: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(36),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.palette.teal.main,
        marginBottom: moderateScale(12),
    },
    avatarText: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: theme.palette.teal.main,
    },
    profileName: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    roleBadge: {
        marginTop: moderateScale(8),
        backgroundColor: theme.palette.teal.surface,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(20),
    },
    roleText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: theme.palette.teal.main,
        letterSpacing: 0.8,
    },

    /* Info card */
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
    rowDivider: { height: 1, backgroundColor: theme.colors.border.default },
    infoIconWrap: {
        width: moderateScale(34),
        height: moderateScale(34),
        borderRadius: moderateScale(9),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
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

    /* Menu item */
    actionsCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        gap: moderateScale(12),
    },
    menuIconWrap: {
        width: moderateScale(38),
        height: moderateScale(38),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemContent: { flex: 1 },
    menuItemTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    menuItemSub: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
    },

    /* Sign out */
    signOutBtn: {
        flexDirection: 'row',
        backgroundColor: '#FFF1F0',
        borderWidth: 1,
        borderColor: '#FFCCC7',
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(14),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    signOutBtnDisabled: { opacity: 0.6 },
    signOutText: {
        color: theme.palette.status.error,
        fontWeight: '700',
        fontSize: moderateScale(15),
    },
});

export default AdminMenu;
