import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { EmptyState, HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { DoctorStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { createSlot, deleteSlot, listSlots } from '@/services/slotService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { DoctorSlot } from '@/types/database';

const DoctorSchedule = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DoctorStackParamList>>();
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
            .finally(() => setLoading(false));
    };

    useFocusEffect(useCallback(() => { load(); }, [user.doctor_id, date]));

    const handleAdd = async () => {
        if (!user.doctor_id) return;
        try {
            await createSlot({
                doctor_id: user.doctor_id,
                appointment_date: date,
                start_time: startTime,
                end_time: endTime,
            });
            Toast.show({ type: 'success', text1: 'Slot created' });
            load();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed', text2: String(e) });
        }
    };

    const handleDelete = async (slotId: string) => {
        try {
            await deleteSlot(slotId);
            load();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Delete failed', text2: String(e) });
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Schedule" subtitle="Manage your availability" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <TextComp text="Date" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={date} onChangeText={setDate} />
                <TextComp text="Start Time" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={startTime} onChangeText={setStartTime} />
                <TextComp text="End Time" style={healthScreenStyles.label} />
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
