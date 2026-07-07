import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { bookAppointment } from '@/services/appointmentService';
import { listAvailableSlots } from '@/services/slotService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { DoctorSlot } from '@/types/database';

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

    const loadSlots = async () => {
        setLoadingSlots(true);
        try {
            const data = await listAvailableSlots(route.params.doctorId, date);
            setSlots(data);
            setSelectedSlot(null);
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed to load slots', text2: String(e) });
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot || !user.patient_id) return;
        setLoading(true);
        try {
            await bookAppointment({
                patient_id: user.patient_id,
                doctor_id: route.params.doctorId,
                slot_id: selectedSlot.id,
                appointment_date: selectedSlot.appointment_date,
                appointment_time: selectedSlot.start_time,
                notes: notes.trim() || undefined,
            });
            Toast.show({ type: 'success', text1: 'Appointment booked' });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Booking failed', text2: String(e) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Book Visit" subtitle={route.params.doctorName}>
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
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
                <Pressable
                    style={[healthScreenStyles.primaryBtn, (!selectedSlot || loading) && { opacity: 0.5 }]}
                    onPress={handleBook}
                    disabled={!selectedSlot || loading}
                >
                    <TextComp text={loading ? 'Booking...' : 'Confirm Booking'} style={healthScreenStyles.primaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default BookAppointment;
