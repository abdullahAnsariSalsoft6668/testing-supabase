import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DrawerScreenBackButton from '@/components/drawer/DrawerScreenBackButton';
import TextComp from '@/components/TextComp';
import AuthGridOverlay from '@/screens/auth/shared/AuthGridOverlay';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { PRIVACY_FIRST_SUBTITLE, PRIVACY_FIRST_TITLE } from './constants';

const ShieldIcon = () => (
    <View style={styles.shieldWrap}>
        <Svg width={moderateScale(36)} height={moderateScale(36)} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"
                fill={palette.green.main}
                stroke={palette.green.dark}
                strokeWidth={1}
            />
            <Path
                d="M10 11a2 2 0 114 0v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1z"
                fill="#FFFFFF"
            />
            <Path
                d="M12 14v2"
                stroke="#FFFFFF"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
        </Svg>
    </View>
);

const PrivacyFirstHero: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[tabScreenStyles.hero, styles.hero, { paddingTop: insets.top + moderateScale(12) }]}>
            <View style={tabScreenStyles.heroGrid} pointerEvents="none">
                <AuthGridOverlay />
            </View>
            <View style={styles.backRow}>
                <DrawerScreenBackButton />
            </View>
            <View style={styles.content}>
                <ShieldIcon />
                <TextComp text={PRIVACY_FIRST_TITLE} style={styles.title} />
                <TextComp text={PRIVACY_FIRST_SUBTITLE} style={styles.subtitle} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    hero: {
        paddingBottom: moderateScale(36),
    },
    backRow: {
        position: 'relative',
        zIndex: 2,
        marginBottom: moderateScale(8),
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: spaces.large,
        position: 'relative',
        zIndex: 2,
    },
    shieldWrap: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(36),
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spaces.medium,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(22),
        lineHeight: moderateScale(28),
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: moderateScale(10),
    },
    subtitle: {
        fontSize: moderateScale(13),
        lineHeight: moderateScale(20),
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
});

export default PrivacyFirstHero;
