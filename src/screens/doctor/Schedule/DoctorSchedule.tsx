import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { EmptyState, HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { createSlot, deleteSlot, listSlots } from '@/services/slotService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { DoctorSlot } from '@/types/database';
import { formatErrorMessage } from '@/utils/formatError';

const DoctorSchedule = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('09:30');
    const [slots, setSlots] = useState<DoctorSlot[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        if (!user.doctor_id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        listSlots(user.doctor_id, date)
            .then(setSlots)
            .catch((e) => {
                Toast.show({ type: 'error', text1: 'Failed to load slots', text2: formatErrorMessage(e) });
            })
            .finally(() => setLoading(false));
    };

    useFocusEffect(
        useCallback(() => {
            void syncAuthFromSupabase().finally(load);
        }, [user.doctor_id, date]),
    );

    const handleAdd = async () => {
        if (!user.doctor_id) {
            Toast.show({
                type: 'error',
                text1: 'Doctor profile missing',
                text2: 'Complete your doctor profile and get admin approval first.',
            });
            return;
        }
        if (!date.trim() || !startTime.trim() || !endTime.trim()) {
            Toast.show({ type: 'error', text1: 'Date and times are required' });
            return;
        }
        try {
            await createSlot({
                doctor_id: user.doctor_id,
                appointment_date: date.trim(),
                start_time: startTime.trim(),
                end_time: endTime.trim(),
            });
            Toast.show({ type: 'success', text1: 'Slot created' });
            load();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed to add slot', text2: formatErrorMessage(e) });
        }
    };

    const handleDelete = async (slotId: string) => {
        try {
            await deleteSlot(slotId);
            Toast.show({ type: 'success', text1: 'Slot removed' });
            load();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Delete failed', text2: formatErrorMessage(e) });
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Schedule" subtitle="Manage your availability" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {!user.doctor_id ? (
                    <View style={healthScreenStyles.card}>
                        <TextComp
                            text="Complete your doctor profile and wait for admin approval before adding slots."
                            style={healthScreenStyles.cardMeta}
                        />
                    </View>
                ) : null}
                <TextComp text="Date (YYYY-MM-DD)" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={date} onChangeText={setDate} />
                <TextComp text="Start Time (HH:MM)" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={startTime} onChangeText={setStartTime} />
                <TextComp text="End Time (HH:MM)" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={endTime} onChangeText={setEndTime} />
                <Pressable style={healthScreenStyles.primaryBtn} onPress={handleAdd}>
                    <TextComp text="Add Slot" style={healthScreenStyles.primaryBtnText} />
                </Pressable>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : slots.length === 0 ? (
                    <EmptyState title="No slots for this date" />
                ) : (
                    slots.map((s) => (
                        <View key={s.id} style={healthScreenStyles.card}>
                            <TextComp
                                text={`${s.start_time.slice(0, 5)} – ${s.end_time.slice(0, 5)}`}
                                style={healthScreenStyles.cardTitle}
                            />
                            <StatusBadge status={s.status} type="slot" />
                            {s.status === 'AVAILABLE' ? (
                                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => handleDelete(s.id)}>
                                    <TextComp text="Remove" style={healthScreenStyles.secondaryBtnText} />
                                </Pressable>
                            ) : null}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default DoctorSchedule;
