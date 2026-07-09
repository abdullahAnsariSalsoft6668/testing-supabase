import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { AdminInfoRow } from '@/components/admin/AdminUI';
import { HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

const AdminMenu = () => {
    const user = useSelector((st) => st.auth.userData) as AuthUserProfile;
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
        <View style={s.screen}>
            <HealthScreenHeader title="Account" subtitle="Admin settings & session" />
            <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
                <View style={[s.card, { marginBottom: 0, alignItems: 'center', padding: moderateScale(24) }]}>
                    <View style={{
                        width: moderateScale(72),
                        height: moderateScale(72),
                        borderRadius: moderateScale(36),
                        backgroundColor: theme.palette.teal.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: theme.palette.teal.main,
                        marginBottom: moderateScale(12),
                    }}>
                        <TextComp text={initials(user.full_name ?? 'A')} style={{ fontSize: moderateScale(24), fontWeight: '700', color: theme.palette.teal.main }} />
                    </View>
                    <TextComp text={user.full_name ?? ''} style={{ fontSize: moderateScale(18), fontWeight: '700', color: theme.colors.text.primary }} />
                    <View style={[s.roleBadge, { marginTop: moderateScale(8) }]}>
                        <TextComp text="ADMIN" style={s.roleText} />
                    </View>
                </View>

                <View style={s.infoCard}>
                    <AdminInfoRow icon="emailIcon" label="Email" value={user.email} />
                    <View style={s.rowDivider} />
                    <AdminInfoRow icon="userIcon" label="Role" value={user.role ?? 'ADMIN'} />
                </View>

                <View style={s.infoCard}>
                    <Pressable style={s.infoRow} onPress={handleSync} disabled={syncing}>
                        <View style={[s.infoIconWrap, { backgroundColor: theme.palette.sky.main }]}>
                            {syncing ? (
                                <ActivityIndicator size="small" color={theme.palette.sky.accent} />
                            ) : (
                                <MyIcons name="notification" size={18} stroke={theme.palette.sky.accent} />
                            )}
                        </View>
                        <View style={s.infoContent}>
                            <TextComp text="Refresh Session" style={{ fontSize: moderateScale(14), fontWeight: '600', color: theme.colors.text.primary }} />
                            <TextComp text="Sync your account role and profile" style={{ fontSize: moderateScale(12), color: theme.colors.text.secondary, marginTop: 2 }} />
                        </View>
                        <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.secondary} />
                    </Pressable>
                </View>

                <Pressable
                    style={[s.actionBtn, s.deleteBtn, { marginTop: moderateScale(4) }, signingOut && { opacity: 0.6 }]}
                    onPress={handleSignOut}
                    disabled={signingOut}
                >
                    {signingOut ? (
                        <ActivityIndicator size="small" color={theme.palette.status.error} />
                    ) : (
                        <>
                            <MyIcons name="healthTabClose" size={16} stroke={theme.palette.status.error} />
                            <TextComp text="Sign Out" style={s.deleteBtnText} />
                        </>
                    )}
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default AdminMenu;
