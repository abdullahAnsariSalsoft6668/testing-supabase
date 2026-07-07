import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENTRANCE_BASE, ENTRANCE_STEP, PROFILE_ICON_BG, PROFILE_ICON_COLOR } from './constants';
import type { ProfileInfoItem } from './types';

type ProfileInfoCardProps = {
    item: ProfileInfoItem;
    index: number;
};

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ item, index }) => {
    const animatedStyle = useEntranceAnimation({
        index,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 16,
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <View style={styles.inner}>
                <View style={styles.iconWrap}>
                    <MyIcons name={item.icon} size={moderateScale(20)} />
                </View>
                <View style={styles.content}>
                    <TextComp text={item.label} style={styles.label} />
                    <TextComp text={item.value} style={styles.value} />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        marginBottom: moderateScale(12),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(16),
        gap: moderateScale(12),
    },
    iconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: PROFILE_ICON_BG,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        marginBottom: moderateScale(4),
    },
    value: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: PROFILE_ICON_COLOR,
        lineHeight: moderateScale(20),
    },
});

export default React.memo(ProfileInfoCard);
