import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

import { ROLE_COLORS, type OnboardingRole } from './onboardingRoleColors';

type OnboardingIllustrationProps = {
    role: OnboardingRole;
};

const CHIP_CONFIG: Record<
    OnboardingRole,
    { left: { icon: 'healthTabHospital' | 'healthTabCalendar' | 'healthTabDepartments'; label: string }; right: { icon: 'healthTabCalendar' | 'healthTabDoctors' | 'checkVerified'; label: string } }
> = {
    patient: {
        left: { icon: 'healthTabHospital', label: 'Hospitals' },
        right: { icon: 'healthTabCalendar', label: 'Book Visit' },
    },
    doctor: {
        left: { icon: 'healthTabCalendar', label: 'Schedule' },
        right: { icon: 'checkVerified', label: 'Confirm' },
    },
    admin: {
        left: { icon: 'healthTabDepartments', label: 'Departments' },
        right: { icon: 'healthTabDoctors', label: 'Doctors' },
    },
};

const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({ role }) => {
    const colors = ROLE_COLORS[role];
    const chips = CHIP_CONFIG[role];
    const heroSize = moderateScale(128);
    const ringSize = heroSize + moderateScale(28);

    return (
        <LinearGradient
            colors={[colors.illustrationBg, colors.illustrationBgEnd]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.fill}
        >
            <View style={styles.scene}>
                <View style={[styles.dot, styles.dotA, { backgroundColor: colors.accentLight }]} />
                <View style={[styles.dot, styles.dotB, { backgroundColor: colors.accent }]} />
                <View style={[styles.dot, styles.dotC, { backgroundColor: colors.ring }]} />

                <View style={[styles.chip, styles.chipLeft, { backgroundColor: colors.chipBg, borderColor: colors.accent + '18' }]}>
                    <View style={[styles.chipIcon, { backgroundColor: colors.accent + '12' }]}>
                        <MyIcons name={chips.left.icon} size={18} stroke={colors.accent} />
                    </View>
                    <TextComp text={chips.left.label} style={[styles.chipLabel, { color: colors.chipText }]} />
                </View>

                <View style={[styles.chip, styles.chipRight, { backgroundColor: colors.chipBg, borderColor: colors.accent + '18' }]}>
                    <View style={[styles.chipIcon, { backgroundColor: colors.accent + '12' }]}>
                        <MyIcons name={chips.right.icon} size={18} stroke={colors.accent} />
                    </View>
                    <TextComp text={chips.right.label} style={[styles.chipLabel, { color: colors.chipText }]} />
                </View>

                <View
                    style={[
                        styles.heroRing,
                        {
                            width: ringSize,
                            height: ringSize,
                            borderRadius: ringSize / 2,
                            borderColor: colors.ring,
                        },
                    ]}
                />

                <LinearGradient
                    colors={[colors.accent, colors.accentLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.heroOrb,
                        {
                            width: heroSize,
                            height: heroSize,
                            borderRadius: heroSize / 2,
                        },
                    ]}
                >
                    <MyIcons name={colors.heroIcon} size={52} stroke={palette.neutral.white} />
                </LinearGradient>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    fill: { flex: 1, width: '100%' },
    scene: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.35,
    },
    dotA: {
        width: moderateScale(14),
        height: moderateScale(14),
        top: '18%',
        left: '22%',
    },
    dotB: {
        width: moderateScale(10),
        height: moderateScale(10),
        top: '28%',
        right: '20%',
        opacity: 0.25,
    },
    dotC: {
        width: moderateScale(18),
        height: moderateScale(18),
        bottom: '20%',
        left: '18%',
        opacity: 0.5,
    },
    heroRing: {
        position: 'absolute',
        borderWidth: moderateScale(2),
        backgroundColor: 'transparent',
    },
    heroOrb: {
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.card,
    },
    chip: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(14),
        borderWidth: 1,
        ...theme.shadows.card,
    },
    chipLeft: {
        top: '24%',
        left: '8%',
    },
    chipRight: {
        bottom: '22%',
        right: '8%',
    },
    chipIcon: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipLabel: {
        fontSize: moderateScale(12),
        fontWeight: '700',
    },
});

export default OnboardingIllustration;
