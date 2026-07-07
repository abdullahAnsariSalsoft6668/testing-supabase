import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type NotificationListItemProps = {
    message: string;
    time: string;
};

const NotificationListItem: React.FC<NotificationListItemProps> = ({ message, time }) => (
    <View style={styles.card}>
        <TextComp text={message} style={styles.message} />
        <TextComp text={time} style={styles.time} />
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: spaces.medium,
        marginBottom: spaces.medium,
    },
    message: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.white,
        lineHeight: moderateScale(22),
        marginBottom: moderateScale(12),
    },
    time: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: '#12B3C9',
    },
});

export default React.memo(NotificationListItem);
