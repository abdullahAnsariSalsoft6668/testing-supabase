import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { PatientStackParamList } from '@/navigation/types';
import { getDoctorById } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor } from '@/types/database';

const DoctorDetail = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const route = useRoute<RouteProp<PatientStackParamList, 'DoctorDetail'>>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDoctorById(route.params.doctorId)
            .then(setDoctor)
            .finally(() => setLoading(false));
    }, [route.params.doctorId]);

    const name = getUserDisplayName(doctor?.users, 'Doctor');

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title={name} subtitle={doctor?.specialization ?? ''}>
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading || !doctor ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <View style={healthScreenStyles.card}>
                        <TextComp text={doctor.hospitals?.name ?? ''} style={healthScreenStyles.cardMeta} />
                        <TextComp text={doctor.departments?.name ?? ''} style={healthScreenStyles.cardMeta} />
                        {doctor.qualification ? (
                            <TextComp text={doctor.qualification} style={healthScreenStyles.cardMeta} />
                        ) : null}
                        {doctor.bio ? <TextComp text={doctor.bio} style={healthScreenStyles.cardMeta} /> : null}
                        {doctor.consultation_fee != null ? (
                            <TextComp text={`Fee: $${doctor.consultation_fee}`} style={healthScreenStyles.cardTitle} />
                        ) : null}
                        <Pressable
                            style={healthScreenStyles.primaryBtn}
                            onPress={() =>
                                navigation.navigate(routes.patient.bookAppointment, {
                                    doctorId: doctor.id,
                                    doctorName: name,
                                })
                            }
                        >
                            <TextComp text="Book Appointment" style={healthScreenStyles.primaryBtnText} />
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default DoctorDetail;
