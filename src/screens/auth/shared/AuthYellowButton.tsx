import React from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

import { plusJakarta } from '@/assets/fonts';
import TextComp from '@/components/TextComp';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';

type AuthYellowButtonProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    helperText?: string;
};

const AuthYellowButton: React.FC<AuthYellowButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
    helperText,
}) => (
    <View style={styles.wrap}>
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.button, (disabled || loading) && styles.buttonDisabled, style]}
            accessibilityRole="button"
        >
            <TextComp text={title} style={[styles.label, textStyle]} />
            {loading ? (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator color={palette.neutral.white} />
                </View>
            ) : null}
        </Pressable>
        {helperText ? <TextComp text={helperText} style={styles.helperText} /> : null}
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
    },
    button: {
        minHeight: moderateScale(52),
        borderRadius: moderateScale(14),
        backgroundColor: palette.teal.main,
        justifyContent: 'center',
        overflow: 'hidden',
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(20),
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
            default: {},
        }),
    },
    buttonDisabled: {
        opacity: 0.65,
    },
    label: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: palette.neutral.white,
        textAlign: 'center',
    },
    helperText: {
        marginTop: moderateScale(10),
        textAlign: 'center',
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
        color: palette.neutral.textSecondary,
        lineHeight: moderateScale(18),
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(11, 114, 133, 0.88)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AuthYellowButton;
