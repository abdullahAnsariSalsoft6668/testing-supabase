import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type HelpContactFooterProps = {
    onContactPress?: () => void;
};

const ChatIcon = () => (
    <Svg width={moderateScale(28)} height={moderateScale(28)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="#FFFFFF"
            strokeWidth={1.8}
            strokeLinejoin="round"
        />
    </Svg>
);

const ArrowIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 12h14M13 6l6 6-6 6"
            stroke={palette.neutral.text}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const HelpContactFooter: React.FC<HelpContactFooterProps> = ({ onContactPress }) => (
    <View style={styles.card}>
        <ChatIcon />
        <TextComp text="Still have questions?" style={styles.title} />
        <TextComp
            text="Our support team typically replies within 2 hours"
            style={styles.subtitle}
        />
        <Pressable
            onPress={onContactPress}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            accessibilityRole="button"
        >
            <TextComp text="Contact Support" style={styles.buttonText} />
            <ArrowIcon />
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background.footer,
        borderRadius: theme.radius.xl,
        padding: spaces.large,
        alignItems: 'center',
        marginBottom: spaces.medium,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(17),
        color: theme.colors.text.inverse,
        textAlign: 'center',
        marginTop: spaces.small,
        marginBottom: moderateScale(4),
    },
    subtitle: {
        fontSize: moderateScale(13),
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: spaces.medium,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.yellow.main,
        borderRadius: theme.radius.lg,
        paddingVertical: moderateScale(14),
        paddingHorizontal: spaces.large,
        gap: moderateScale(8),
        width: '100%',
    },
    buttonPressed: {
        opacity: 0.88,
    },
    buttonText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.text.primary,
    },
});

export default HelpContactFooter;
