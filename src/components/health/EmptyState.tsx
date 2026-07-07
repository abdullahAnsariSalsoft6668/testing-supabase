import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

type EmptyStateProps = {
    title: string;
    message?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
    <View style={styles.wrap}>
        <View style={styles.icon}>
            <TextComp text="+" style={styles.iconText} />
        </View>
        <TextComp text={title} style={styles.title} />
        {message ? <TextComp text={message} style={styles.message} /> : null}
    </View>
);

const styles = StyleSheet.create({
    wrap: { alignItems: 'center', paddingVertical: moderateScale(40), paddingHorizontal: moderateScale(24) },
    icon: {
        width: moderateScale(64),
        height: moderateScale(64),
        borderRadius: moderateScale(32),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(16),
    },
    iconText: { fontSize: moderateScale(28), color: theme.palette.teal.main, fontWeight: '300' },
    title: { fontSize: moderateScale(16), fontWeight: '600', color: theme.colors.text.primary, textAlign: 'center' },
    message: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginTop: moderateScale(8),
        lineHeight: moderateScale(20),
    },
});

export default EmptyState;
