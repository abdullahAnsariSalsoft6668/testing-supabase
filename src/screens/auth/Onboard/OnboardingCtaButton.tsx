import React from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';

import styles from './styles';

const CtaChevronIcon = ({ size }: { size: number }) => (
    <Svg width={size * 0.45} height={size} viewBox="0 0 7 12" fill="none">
        <Path
            d="M0.833252 10.8315L5.83243 5.83237L0.833252 0.833191"
            stroke={Colors.text}
            strokeWidth={1.67}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

type OnboardingCtaButtonProps = {
    onPress: () => void;
    height?: number;
    iconPanelWidth?: number;
    label?: string;
};

const OnboardingCtaButton: React.FC<OnboardingCtaButtonProps> = ({
    onPress,
    height = moderateScale(56),
    iconPanelWidth = moderateScale(56),
    label = "Let's Go",
}) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();
    const buttonRadius = moderateScale(14);
    const iconRadius = moderateScale(10);
    const iconInset = moderateScale(4);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                accessibilityRole="button"
                accessibilityLabel="Let's Go"
            >
                <LinearGradient
                    colors={[palette.yellow.main, palette.yellow.dark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.ctaButton, { height, borderRadius: buttonRadius }]}
                >
                    <View
                        style={[
                            styles.ctaIconPanel,
                            {
                                width: iconPanelWidth,
                                height: height - iconInset * 2,
                                borderTopLeftRadius: I18nManager.isRTL ? iconRadius : buttonRadius - iconInset,
                                borderBottomLeftRadius: I18nManager.isRTL ? iconRadius : buttonRadius - iconInset,
                                borderTopRightRadius: I18nManager.isRTL ? buttonRadius - iconInset : iconRadius,
                                borderBottomRightRadius: I18nManager.isRTL ? buttonRadius - iconInset : iconRadius,
                                marginVertical: iconInset,
                                marginStart: iconInset,
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            },
                        ]}
                    >
                        <View style={I18nManager.isRTL ? styles.ctaIconRtl : undefined}>
                            <CtaChevronIcon size={moderateScale(18)} />
                        </View>
                    </View>
                    <View style={styles.ctaLabelWrap} pointerEvents="none">
                        <TextComp text={label} style={styles.ctaLabel} />
                    </View>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
};

export default OnboardingCtaButton;
