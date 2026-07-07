import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { I18nManager, Platform, StyleSheet, View } from 'react-native';

import AppShimmerBox from './AppShimmerBox';

/** Skeleton row matching [`ChildProfileRow`](src/screens/auth/ChildProfiles/ChildProfileRow.tsx) + list card styles. */
const ChildProfileRowShimmer: React.FC = () => (
    <View style={styles.profileCard}>
        <AppShimmerBox palette="onWhite" style={styles.avatar} />
        <View style={styles.textCol}>
            <AppShimmerBox palette="onWhite" style={styles.nameLine} />
            <AppShimmerBox palette="onWhite" style={styles.ageLine} />
        </View>
        <AppShimmerBox palette="onWhite" style={styles.chevron} />
    </View>
);

const cardShadow = Platform.select({
    ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    android: {
        elevation: 3,
    },
});

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(22),
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(16),
        marginBottom: moderateScale(14),
        ...cardShadow,
    },
    avatar: {
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: moderateScale(28),
    },
    textCol: {
        flex: 1,
        marginHorizontal: moderateScale(14),
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    nameLine: {
        height: moderateScale(18),
        borderRadius: moderateScale(8),
        width: '62%',
    },
    ageLine: {
        height: moderateScale(13),
        borderRadius: moderateScale(6),
        width: '38%',
    },
    chevron: {
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(4),
    },
});

export default ChildProfileRowShimmer;
