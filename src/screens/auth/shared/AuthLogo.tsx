import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';

import { moderateScale } from '@/styles/scaling';

const LOGO_ASPECT_RATIO = 598 / 162;
const LOGO_SOURCE = require('@/assets/images/logo.png');

type AuthLogoProps = {
    centered?: boolean;
    style?: ViewStyle;
};

const AuthLogo: React.FC<AuthLogoProps> = ({ centered = false, style }) => {
    const { width: screenWidth } = useWindowDimensions();
    const logoWidth = Math.min(screenWidth - moderateScale(80), moderateScale(180));
    const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

    return (
        <View style={[styles.wrap, centered && styles.wrapCentered, style]}>
            <Image
                source={LOGO_SOURCE}
                style={{ width: logoWidth, height: logoHeight }}
                resizeMode="contain"
                accessibilityLabel="Ultimate Grocery"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        alignSelf: 'flex-start',
        marginBottom: moderateScale(12),
    },
    wrapCentered: {
        alignSelf: 'center',
    },
});

export default AuthLogo;
