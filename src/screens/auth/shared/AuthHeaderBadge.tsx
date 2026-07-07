import React from 'react';
import { StyleSheet, View } from 'react-native';

import { plusJakarta } from '@/assets/fonts';
import TextComp from '@/components/TextComp';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';

type AuthHeaderBadgeProps = {
    text: string;
    variant?: 'header' | 'form';
};

const AuthHeaderBadge: React.FC<AuthHeaderBadgeProps> = ({ text, variant = 'header' }) => (
    <View style={[styles.wrap, variant === 'form' && styles.wrapForm]}>
        <View style={[styles.dot, variant === 'form' && styles.dotForm]} />
        <TextComp text={text} style={[styles.text, variant === 'form' && styles.textForm]} />
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        borderRadius: moderateScale(20),
        paddingVertical: moderateScale(6),
        paddingHorizontal: moderateScale(12),
        marginBottom: moderateScale(14),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
    },
    wrapForm: {
        backgroundColor: palette.purple.surface,
        borderColor: 'rgba(169, 19, 199, 0.12)',
        marginBottom: moderateScale(4),
    },
    dot: {
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: palette.yellow.main,
    },
    text: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
        color: palette.neutral.white,
    },
    textForm: {
        color: palette.purple.main,
    },
    dotForm: {
        backgroundColor: palette.purple.main,
    },
});

export default AuthHeaderBadge;
