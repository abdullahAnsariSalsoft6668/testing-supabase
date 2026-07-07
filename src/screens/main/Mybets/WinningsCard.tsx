import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type WinningsCardProps = {
    amount: string;
    subtitle: string;
};

const TrendIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 16l6-6 4 4 6-8"
            stroke={Colors.white}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const WinningsCard: React.FC<WinningsCardProps> = ({ amount, subtitle }) => (
    <View style={styles.card}>
        <View style={styles.headerRow}>
            <TrendIcon />
            <TextComp text="YOUR WINNING" style={styles.title} />
        </View>
        <TextComp text={amount} style={styles.amount} />
        <TextComp text={subtitle} style={styles.subtitle} />
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0077FF',
        borderRadius: moderateScale(20),
        padding: spaces.medium,
        marginBottom: spaces.medium,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: moderateScale(8),
    },
    title: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.bold,
        color: Colors.white,
        letterSpacing: moderateScale(0.8),
    },
    amount: {
        fontSize: moderateScale(32),
        fontFamily: fontFamily.bold,
        color: Colors.white,
        marginBottom: moderateScale(6),
    },
    subtitle: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: Colors.whiteOpacity60,
    },
});

export default React.memo(WinningsCard);
