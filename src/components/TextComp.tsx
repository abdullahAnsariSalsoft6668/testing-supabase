import React from 'react';
import { Text, TextProps, StyleSheet, I18nManager } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import fontFamily from '@/styles/fontFamily';
import { Colors } from '@/styles/colors';

interface TextCompProps extends TextProps {
    text?: string;
    style?: any;
    children?: React.ReactNode;
}

const TextComp: React.FC<TextCompProps> = ({
    text,
    style,
    children,
    ...props
}) => {
    return (
        <Text style={[styles.text, style]} {...props}>
            {text || children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        color: Colors.text,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
});

export default React.memo(TextComp);
