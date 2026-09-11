import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import ScalePressable from '@/components/ui/ScalePressable';
import { listItemEntering } from '@/hooks/animations/listMotion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';
import type { Doctor } from '@/types/database';
import { getDoctorImageSource } from '@/utils/doctorImage';
import { getUserDisplayName } from '@/utils/userDisplay';

type DoctorCardProps = {
    doctor: Doctor;
    index?: number;
    onPress?: () => void;
};

const DoctorCard = ({ doctor, index = 0, onPress }: DoctorCardProps) => {
    const name = getUserDisplayName(doctor.users, 'Doctor');
    const hospital = doctor.hospitals?.name ?? '';
    const dept = doctor.departments?.name ?? '';
    const imageSource = getDoctorImageSource(doctor.id, doctor.users?.profile_image);

    return (
        <ScalePressable onPress={onPress}>
            <Animated.View entering={listItemEntering(index)} style={styles.card}>
                <View style={styles.photoWrap}>
                    <Image source={imageSource} style={styles.photo} />
                </View>
                <View style={styles.info}>
                    <TextComp text={name} style={typography.label} />
                    <TextComp text={doctor.specialization} style={styles.spec} />
                    <TextComp text={`${hospital}${dept ? ` · ${dept}` : ''}`} style={styles.meta} />
                    <View style={styles.footer}>
                        <View style={styles.availabilityPill}>
                            <TextComp text="Available" style={styles.availabilityText} />
                        </View>
                        <TextComp text={`$${doctor.consultation_fee ?? 0}`} style={styles.fee} />
                    </View>
                </View>
            </Animated.View>
        </ScalePressable>
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
        gap: moderateScale(12),
    },
    photoWrap: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(20),
        overflow: 'hidden',
        backgroundColor: theme.palette.lime.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    info: { flex: 1, gap: moderateScale(4) },
    spec: {
        ...typography.bodySmall,
        color: theme.palette.lime.main,
    },
    meta: {
        ...typography.bodySmall,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: moderateScale(6),
    },
    availabilityPill: {
        backgroundColor: theme.palette.olive.deeper,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: theme.radius.pill,
    },
    availabilityText: {
        ...typography.bodySmall,
        color: theme.colors.text.secondary,
        fontWeight: '600',
    },
    fee: {
        ...typography.label,
        color: theme.palette.lime.main,
    },
});

export default DoctorCard;
