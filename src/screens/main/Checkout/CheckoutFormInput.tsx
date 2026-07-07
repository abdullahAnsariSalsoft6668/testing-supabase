import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { borders, spaces } from '@/styles/sizes';
import React, { ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type CheckoutFormInputProps = TextInputProps & {
    label: string;
    icon: ReactNode;
};

const CheckoutFormInput: React.FC<CheckoutFormInputProps> = ({
    label,
    icon,
    style,
    placeholderTextColor = Colors.inputPlaceholder,
    ...props
}) => (
    <View style={styles.field}>
        <TextComp text={label} style={styles.label} />
        <View style={styles.container}>
            <View style={styles.iconWrap}>{icon}</View>
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={placeholderTextColor}
                {...props}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    field: {
        marginBottom: spaces.medium,
    },
    label: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: Colors.white,
        marginBottom: moderateScale(8),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: borders.input,
        paddingHorizontal: spaces.medium,
        minHeight: moderateScale(52),
        gap: moderateScale(12),
    },
    iconWrap: {
        width: moderateScale(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        color: Colors.black,
        paddingVertical: moderateScale(14),
    },
});

export default React.memo(CheckoutFormInput);
