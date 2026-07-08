import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { getDoctorByUserId } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Doctor } from '@/types/database';
import { formatErrorMessage } from '@/utils/formatError';
import { getUserDisplayName } from '@/utils/userDisplay';

const DoctorPendingApproval = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [doctor, setDoctor] = useState<Doctor | null>(user?.doctor ?? null);
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const synced = await syncAuthFromSupabase();
            const userId = synced?.id ?? user?.id;
            if (!userId) return synced;

            const row = synced?.doctor ?? (await getDoctorByUserId(userId));
            setDoctor(row);

            if (row?.status === 'APPROVED') {
                Toast.show({ type: 'success', text1: 'Approved!', text2: 'You now have full doctor access.' });
            }

            return synced;
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Could not refresh status', text2: formatErrorMessage(e) });
            return null;
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            void refresh();
        }, [refresh]),
    );

    const handleCheckStatus = async () => {
        setChecking(true);
        await refresh();
        setChecking(false);
    };

    const status = doctor?.status ?? user?.doctor_status ?? 'PENDING';

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Awaiting Approval" subtitle="Your profile is under review" />
            <View style={[healthScreenStyles.body, { flex: 1 }]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <>
                        <View style={healthScreenStyles.card}>
                            <TextComp text={getUserDisplayName(user, 'Doctor')} style={healthScreenStyles.cardTitle} />
                            <TextComp text={user?.email ?? ''} style={healthScreenStyles.cardMeta} />
                            {doctor ? (
                                <>
                                    <TextComp
                                        text={`Specialization: ${doctor.specialization}`}
                                        style={healthScreenStyles.cardMeta}
                                    />
                                    {doctor.qualification ? (
                                        <TextComp text={doctor.qualification} style={healthScreenStyles.cardMeta} />
                                    ) : null}
                                    {doctor.license_number ? (
                                        <TextComp
                                            text={`License: ${doctor.license_number}`}
                                            style={healthScreenStyles.cardMeta}
                                        />
                                    ) : null}
                                    <View style={{ marginTop: 8 }}>
                                        <StatusBadge status={status} type="doctor" />
                                    </View>
                                </>
                            ) : (
                                <TextComp
                                    text="Doctor profile not loaded yet. Tap Check Status to sync."
                                    style={healthScreenStyles.cardMeta}
                                />
                            )}
                        </View>
                        <View style={healthScreenStyles.card}>
                            <TextComp
                                text="An administrator will review your credentials shortly. You'll gain access once approved."
                                style={healthScreenStyles.cardMeta}
                            />
                        </View>
                    </>
                )}
                <Pressable
                    style={healthScreenStyles.primaryBtn}
                    onPress={handleCheckStatus}
                    disabled={checking || loading}
                >
                    <TextComp
                        text={checking ? 'Checking...' : 'Check Status'}
                        style={healthScreenStyles.primaryBtnText}
                    />
                </Pressable>
                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => clearDataAction()}>
                    <TextComp text="Sign Out" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
            </View>
        </View>
    );
};

export default DoctorPendingApproval;
