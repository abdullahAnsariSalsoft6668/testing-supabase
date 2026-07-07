import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { plusJakarta } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';

type StoreAvatarProps = {
    initials: string;
    color: string;
    size?: number;
};

const StoreAvatar: React.FC<StoreAvatarProps> = ({
    initials,
    color,
    size = moderateScale(22),
}) => (
    <View
        style={[
            styles.avatar,
            {
                width: size,
                height: size,
                borderRadius: moderateScale(6),
                backgroundColor: color,
            },
        ]}
    >
        <Text style={[styles.text, { fontSize: moderateScale(size * 0.38) }]}>{initials}</Text>
    </View>
);

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: plusJakarta.bold,
        color: '#FFFFFF',
    },
});

export default StoreAvatar;
