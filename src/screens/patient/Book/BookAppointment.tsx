import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { bookAppointment } from '@/services/appointmentService';
import { getPatientByUserId } from '@/services/patientService';
import { listAvailableSlots } from '@/services/slotService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { DoctorSlot } from '@/types/database';
import { formatErrorMessage } from '@/utils/formatError';

const BookAppointment = () => {
    const route = useRoute<RouteProp<{ BookAppointment: { doctorId: string; doctorName: string } }, 'BookAppointment'>>();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<DoctorSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<DoctorSlot | null>(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [patientId, setPatientId] = useState(user?.patient_id ?? user?.patient?.id ?? '');

    const resolvePatientId = useCallback(async () => {
        const synced = await syncAuthFromSupabase();
        const fromSync = synced?.patient_id ?? synced?.patient?.id;
        if (fromSync) {
            setPatientId(fromSync);
            return fromSync;
        }

        if (user?.id) {
            const row = await getPatientByUserId(user.id);
            if (row?.id) {
                setPatientId(row.id);
                return row.id;
            }
        }

        setPatientId('');
        return '';
    }, [user?.id]);

    useEffect(() => {
        void resolvePatientId();
    }, [resolvePatientId]);

    const canBook = Boolean(selectedSlot && patientId);

    const loadSlots = async () => {
        setLoadingSlots(true);
        try {
            const data = await listAvailableSlots(route.params.doctorId, date);
            setSlots(data);
            setSelectedSlot(null);
            if (data.length === 0) {
                Toast.show({ type: 'info', text1: 'No slots available', text2: 'Try another date.' });
            }
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed to load slots', text2: formatErrorMessage(e) });
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot) {
            Toast.show({ type: 'error', text1: 'Select a time slot' });
            return;
        }

        const resolvedPatientId = patientId || (await resolvePatientId());
        if (!resolvedPatientId) {
            Toast.show({
                type: 'error',
                text1: 'Patient profile required',
                text2: 'Complete your profile before booking an appointment.',
            });
            return;
        }

        setLoading(true);
        try {
            await bookAppointment({
                patient_id: resolvedPatientId,
                doctor_id: route.params.doctorId,
                slot_id: selectedSlot.id,
                appointment_date: selectedSlot.appointment_date,
                appointment_time: selectedSlot.start_time,
                notes: notes.trim() || undefined,
            });
            Toast.show({ type: 'success', text1: 'Appointment booked' });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Booking failed', text2: formatErrorMessage(e) });
        } finally {
            setLoading(false);
        }
    };

    const hintText = useMemo(() => {
        if (!patientId) return 'Complete your patient profile to enable booking.';
        if (!selectedSlot) return 'Select a slot, then confirm booking.';
        return '';
    }, [patientId, selectedSlot]);

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Book Visit" subtitle={route.params.doctorName}>
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {!patientId ? (
                    <View style={healthScreenStyles.card}>
                        <TextComp
                            text="Your patient profile is missing. Go back and complete setup first."
                            style={healthScreenStyles.cardMeta}
                        />
                    </View>
                ) : null}
                <TextComp text="Date (YYYY-MM-DD)" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={date} onChangeText={setDate} />
                <Pressable style={healthScreenStyles.secondaryBtn} onPress={loadSlots}>
                    <TextComp text="Load Available Slots" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
                {loadingSlots ? <ActivityIndicator style={{ marginTop: 16 }} /> : null}
                {slots.map((slot) => (
                    <Pressable
                        key={slot.id}
                        style={[
                            healthScreenStyles.card,
                            selectedSlot?.id === slot.id && { borderColor: '#0B7285', borderWidth: 2 },
                        ]}
                        onPress={() => setSelectedSlot(slot)}
                    >
                        <TextComp
                            text={`${slot.start_time.slice(0, 5)} – ${slot.end_time.slice(0, 5)}`}
                            style={healthScreenStyles.cardTitle}
                        />
                    </Pressable>
                ))}
                <TextComp text="Notes (optional)" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={notes} onChangeText={setNotes} multiline />
                {hintText ? <TextComp text={hintText} style={healthScreenStyles.cardMeta} /> : null}
                <Pressable
                    style={[healthScreenStyles.primaryBtn, (!canBook || loading) && { opacity: 0.5 }]}
                    onPress={handleBook}
                    disabled={!canBook || loading}
                >
                    <TextComp text={loading ? 'Booking...' : 'Confirm Booking'} style={healthScreenStyles.primaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default BookAppointment;
