import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    I18nManager,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import MyIcons from './MyIcons';

export interface ProfileHeroCardProps {
    avatarSource: ImageSourcePropType;
    name: string;
    role: string;
    locationLabel: string;
    onEditProfilePress: () => void;
    onChangePhotoPress?: () => void;
}

const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
    avatarSource,
    name,
    role,
    locationLabel,
    onEditProfilePress,
    onChangePhotoPress,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.inner}>
                <View style={styles.avatarBlock}>
                    <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
                    <Pressable
                        style={styles.cameraBadge}
                        onPress={onChangePhotoPress}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel="Change profile photo"
                    >
                        <MyIcons name="camera" size={moderateScale(14)} stroke={Colors.primary} />
                    </Pressable>
                </View>
                <View style={styles.info}>
                    <TextComp text={name} style={styles.name} numberOfLines={1} />
                    <View style={styles.locationRow}>
                        <TextComp text={role} style={styles.role} numberOfLines={1} />

                        <MyIcons name="locationFilled" size={moderateScale(14)} stroke={Colors.primary} style={{marginLeft: moderateScale(4)}}/>
                        <TextComp text={locationLabel} style={styles.location} numberOfLines={1} />
                    </View>
                    <Pressable onPress={onEditProfilePress} hitSlop={8}>
                        <TextComp text="Edit Profile" style={styles.editLink} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.onboardingNavy,
        borderRadius: moderateScale(18),
        padding: spaces.medium,
        marginBottom: spaces.medium,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    inner: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
    },
    avatarBlock: {
        position: 'relative',
    },
    avatar: {
        width: moderateScale(88),
        height: moderateScale(88),
        borderRadius: moderateScale(44),
        backgroundColor: Colors.onboardingNavyLight,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    cameraBadge: {
        position: 'absolute',
        right: I18nManager.isRTL ? undefined : -moderateScale(2),
        left: I18nManager.isRTL ? -moderateScale(2) : undefined,
        bottom: moderateScale(2),
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.onboardingNavy,
    },
    cameraEmoji: {
        fontSize: moderateScale(12),
        marginTop: moderateScale(-1),
    },
    info: {
        flex: 1,
        marginLeft: I18nManager.isRTL ? 0 : spaces.medium,
        marginRight: I18nManager.isRTL ? spaces.medium : 0,
        minWidth: 0,
    },
    name: {
        color: Colors.white,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(18),
        marginBottom: moderateScale(2),
    },
    role: {
        color: 'rgba(255,255,255,0.88)',
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        // marginBottom: moderateScale(6),
    },
    locationRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        marginBottom: moderateScale(10),
    },
    location: {
        color: Colors.white,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(13),
        flex: 1,
    },
    editLink: {
        color: Colors.primary,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(14),
    },
});

export default ProfileHeroCard;
