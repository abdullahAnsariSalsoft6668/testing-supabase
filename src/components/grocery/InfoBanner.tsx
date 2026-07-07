import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

const INFO_BG = '#E8F4FD';
const INFO_TEXT = '#2563EB';

type InfoBannerProps = {
    message: string;
};

const InfoBanner: React.FC<InfoBannerProps> = ({ message }) => (
    <View style={styles.banner}>
        <View style={styles.icon}>
            <TextComp text="i" style={styles.iconText} />
        </View>
        <TextComp text={message} style={styles.message} />
    </View>
);

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: INFO_BG,
        borderRadius: moderateScale(12),
        paddingVertical: moderateScale(12),
        paddingHorizontal: spaces.medium,
        marginBottom: spaces.medium,
        gap: moderateScale(10),
    },
    icon: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(10),
        backgroundColor: INFO_TEXT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
        color: '#FFFFFF',
        lineHeight: moderateScale(14),
    },
    message: {
        flex: 1,
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: INFO_TEXT,
    },
});

export default InfoBanner;
