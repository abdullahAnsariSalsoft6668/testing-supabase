import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { PRIVACY_PROMISE_TEXT } from './constants';

const ShieldOutline = () => (
    <Svg width={moderateScale(28)} height={moderateScale(28)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"
            stroke="#FFFFFF"
            strokeWidth={1.8}
            strokeLinejoin="round"
        />
    </Svg>
);

const PrivacyPromiseCard: React.FC = () => (
    <View style={styles.card}>
        <ShieldOutline />
        <TextComp text="Our Privacy Promise" style={styles.title} />
        <TextComp text={PRIVACY_PROMISE_TEXT} style={styles.body} />
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background.footer,
        borderRadius: theme.radius.xl,
        padding: spaces.large,
        alignItems: 'center',
        marginBottom: spaces.medium,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(17),
        color: theme.colors.text.inverse,
        textAlign: 'center',
        marginTop: spaces.small,
        marginBottom: spaces.small,
    },
    body: {
        fontSize: moderateScale(13),
        lineHeight: moderateScale(21),
        color: 'rgba(255, 255, 255, 0.92)',
        textAlign: 'center',
    },
});

export default PrivacyPromiseCard;
