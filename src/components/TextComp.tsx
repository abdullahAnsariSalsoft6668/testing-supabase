import React from 'react';
import { Text, TextProps, StyleSheet, I18nManager } from 'react-native';

import { typography, type TypographyVariant } from '@/styles/typography';

interface TextCompProps extends TextProps {
    text?: string;
    variant?: TypographyVariant;
    style?: TextProps['style'];
    children?: React.ReactNode;
}

const TextComp: React.FC<TextCompProps> = ({
    text,
    variant,
    style,
    children,
    ...props
}) => {
    const variantStyle = variant ? typography[variant] : undefined;

    return (
        <Text style={[styles.base, variantStyle, style]} {...props}>
            {text ?? children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
});

export default React.memo(TextComp);
