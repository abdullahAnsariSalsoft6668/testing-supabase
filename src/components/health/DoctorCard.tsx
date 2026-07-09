import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { getDoctorImageSource } from '@/utils/doctorImage';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor } from '@/types/database';

type DoctorCardProps = {
    doctor: Doctor;
    onPress?: () => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
    const name = getUserDisplayName(doctor.users, 'Doctor');
    const hospital = doctor.hospitals?.name ?? 'Hospital';
    const dept = doctor.departments?.name ?? '';

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image
                source={getDoctorImageSource(doctor.id, doctor.users?.profile_image)}
                style={styles.avatar}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <TextComp text={name} style={styles.name} />
                <TextComp text={doctor.specialization} style={styles.spec} />
                <TextComp text={`${hospital}${dept ? ` · ${dept}` : ''}`} style={styles.meta} />
                {doctor.consultation_fee != null ? (
                    <TextComp text={`$${doctor.consultation_fee}`} style={styles.fee} />
                ) : null}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    avatar: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(26),
        backgroundColor: theme.palette.teal.surface,
        marginRight: moderateScale(12),
        borderWidth: 2,
        borderColor: theme.palette.teal.main + '33',
    },
    info: { flex: 1 },
    name: { fontSize: moderateScale(15), fontWeight: '700', color: theme.colors.text.primary },
    spec: { fontSize: moderateScale(13), color: theme.palette.teal.main, marginTop: 2 },
    meta: { fontSize: moderateScale(12), color: theme.colors.text.secondary, marginTop: 4 },
    fee: { fontSize: moderateScale(13), fontWeight: '600', color: theme.colors.text.primary, marginTop: 6 },
});

export default DoctorCard;
