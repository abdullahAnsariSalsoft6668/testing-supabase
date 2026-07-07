import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import TextComp from './TextComp';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

interface AuthPromptRowProps {
    promptText: string;
    linkText: string;
    onLinkPress: () => void;
    rowStyle?: ViewStyle | ReturnType<typeof Animated.useAnimatedStyle> | any;
    /** Use dark text when rendered on a light surface (e.g. white auth card). */
    lightTheme?: boolean;
}

const AuthPromptRow: React.FC<AuthPromptRowProps> = ({
    promptText,
    linkText,
    onLinkPress,
    rowStyle,
    lightTheme = false,
}) => (
    <Animated.View style={[styles.row, rowStyle]}>
        <TextComp
            text={promptText}
            style={[styles.prompt, lightTheme && styles.promptLight]}
        />
        <Pressable onPress={onLinkPress} hitSlop={8}>
            <TextComp
                text={linkText}
                style={[styles.link, lightTheme && styles.linkLight]}
            />
        </Pressable>
    </Animated.View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: moderateScale(6),
        marginTop: moderateScale(24),
    },
    prompt: {
        color: palette.neutral.white,
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
    },
    link: {
        color: palette.neutral.white,
        fontSize: moderateScale(14),
        fontFamily: fontFamily.bold,
        textDecorationLine: 'underline',
    },
    promptLight: {
        color: Colors.gray500,
    },
    linkLight: {
        color: palette.purple.main,
    },
});

export default React.memo(AuthPromptRow);
