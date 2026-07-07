import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
    PROFILE_CARD_BG,
    PROFILE_CARD_BORDER,
    PROFILE_RATING_GREEN,
} from './constants';
import type { ProfileData } from './types';

type ProfileSummaryCardProps = {
    profile: ProfileData;
    avatarSource: ImageSourcePropType;
};

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ profile, avatarSource }) => {
    const navigation = useNavigation();
    const cardStyle = useEntranceAnimation({ baseDelay: 60 });
    const { animatedStyle: editScale, onPressIn, onPressOut } = usePressScale();

    const openEditProfile = useCallback(() => {
        navigation.navigate(routes.main.editProfile as never);
    }, [navigation]);

    return (
        <Animated.View style={[styles.card, cardStyle]}>
            <Animated.View style={[styles.editButtonWrap, editScale]}>
                <Pressable
                    onPress={openEditProfile}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={styles.editButton}
                    accessibilityRole="button"
                    accessibilityLabel="Edit profile"
                >
                    <MyIcons name="editIcon" size={moderateScale(16)} />
                </Pressable>
            </Animated.View>

            <View style={styles.avatarWrap}>
                <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
            </View>

            <TextComp text={profile.fullName} style={styles.name} />
            <TextComp text={`Driver ID: ${profile.driverId}`} style={styles.driverId} />

            <View style={styles.statsRow}>
                <View style={styles.statBlock}>
                    <TextComp text={profile.totalRoutes} style={styles.statValue} />
                    <TextComp text="Total Routes" style={styles.statLabel} />
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBlock}>
                    <TextComp text={profile.rating} style={styles.ratingValue} />
                    <TextComp text="Rating" style={styles.statLabel} />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: PROFILE_CARD_BG,
        borderRadius: moderateScale(18),
        borderWidth: 1,
        borderColor: PROFILE_CARD_BORDER,
        paddingHorizontal: moderateScale(20),
        paddingTop: moderateScale(28),
        paddingBottom: moderateScale(22),
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    editButtonWrap: {
        position: 'absolute',
        top: moderateScale(14),
        right: moderateScale(14),
        zIndex: 1,
    },
    editButton: {
        width: moderateScale(34),
        height: moderateScale(34),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarWrap: {
        width: moderateScale(96),
        height: moderateScale(96),
        borderRadius: moderateScale(48),
        borderWidth: 3,
        borderColor: 'rgba(120, 210, 255, 0.75)',
        padding: moderateScale(3),
        marginBottom: moderateScale(14),
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(45),
        backgroundColor: Colors.gray600,
    },
    name: {
        fontSize: moderateScale(22),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginBottom: moderateScale(6),
        textAlign: 'center',
    },
    driverId: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.72)',
        marginBottom: moderateScale(18),
        textAlign: 'center',
    },
    statsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.12)',
        paddingTop: moderateScale(16),
    },
    statBlock: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: moderateScale(42),
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
    },
    statValue: {
        fontSize: moderateScale(24),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginBottom: moderateScale(4),
    },
    ratingValue: {
        fontSize: moderateScale(24),
        fontFamily: plusJakarta.bold,
        color: PROFILE_RATING_GREEN,
        marginBottom: moderateScale(4),
    },
    statLabel: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.72)',
        textAlign: 'center',
    },
});

export default React.memo(ProfileSummaryCard);
