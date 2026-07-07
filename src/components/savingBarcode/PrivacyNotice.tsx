import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { PRIVACY_NOTICE } from './constants';

const PrivacyNotice: React.FC = () => (
    <View style={styles.wrap}>
        <Text style={styles.lock}>🔒</Text>
        <TextComp text={PRIVACY_NOTICE} style={styles.text} />
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: spaces.medium,
    },
    lock: {
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        marginRight: moderateScale(6),
    },
    text: {
        flex: 1,
        maxWidth: moderateScale(300),
        fontSize: moderateScale(11),
        lineHeight: moderateScale(17),
        color: theme.colors.text.muted,
        textAlign: 'center',
    },
});

export default PrivacyNotice;
