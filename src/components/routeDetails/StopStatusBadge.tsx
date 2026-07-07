import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const StopStatusBadge: React.FC = () => (
    <View style={styles.badge}>
        <TextComp text="Current" style={styles.label} />
    </View>
);

const styles = StyleSheet.create({
    badge: {
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        backgroundColor: '#D9E8FF',
    },
    label: {
        fontSize: moderateScale(10),
        fontFamily: plusJakarta.bold,
        color: '#2F6FED',
    },
});

export default React.memo(StopStatusBadge);
