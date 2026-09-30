import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import { formatErrorMessage } from '@/utils/formatError';

const HospitalPendingApproval = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(true);
    const status = user?.hospital_status ?? 'PENDING';

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const synced = await syncAuthFromSupabase();
            if (synced?.hospital_status === 'APPROVED') {
                Toast.show({ type: 'success', text1: 'Approved!', text2: 'You can manage your hospital now.' });
            }
            return synced;
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Could not refresh status', text2: formatErrorMessage(e) });
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void refresh();
        }, [refresh]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Awaiting Approval" subtitle="Your hospital is under review" />
            <View style={[healthScreenStyles.body, { flex: 1 }]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <>
                        <View style={healthScreenStyles.card}>
                            <TextComp
                                text={user?.hospital?.name ?? getUserDisplayName(user, 'Hospital')}
                                style={healthScreenStyles.cardTitle}
                            />
                            <TextComp text={user?.email ?? ''} style={healthScreenStyles.cardMeta} />
                            <View style={{ marginTop: 12 }}>
                                <StatusBadge status={status} type="doctor" />
                            </View>
                            <TextComp
                                text={
                                    status === 'REJECTED'
                                        ? 'CareHub did not approve this hospital. Contact support if this is a mistake.'
                                        : status === 'SUSPENDED'
                                          ? 'This clinic is suspended. Patients cannot book until it is restored.'
                                          : 'CareHub is reviewing your hospital. You can add doctors after approval.'
                                }
                                style={[healthScreenStyles.cardMeta, { marginTop: 12 }]}
                            />
                        </View>
                        <Pressable
                            style={healthScreenStyles.primaryBtn}
                            onPress={async () => {
                                setChecking(true);
                                await refresh();
                                setChecking(false);
                            }}
                            disabled={checking}
                        >
                            {checking ? (
                                <ActivityIndicator />
                            ) : (
                                <TextComp text="Check status" style={healthScreenStyles.primaryBtnText} />
                            )}
                        </Pressable>
                        <Pressable style={{ marginTop: 16, alignItems: 'center' }} onPress={() => void clearDataAction()}>
                            <TextComp text="Sign out" style={healthScreenStyles.cardMeta} />
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
};

export default HospitalPendingApproval;
