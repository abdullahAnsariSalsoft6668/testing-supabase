import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import { MARK_COMPLETE_GRADIENT } from './constants';

const CheckIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 12l5 5L19 7"
            stroke={Colors.white}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

type MarkCompleteButtonProps = {
    onPress: () => void;
    label?: string;
    style?: ViewStyle;
};

const MarkCompleteButton: React.FC<MarkCompleteButtonProps> = ({
    onPress,
    label = 'Mark as Completed',
    style,
}) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    return (
        <View>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.pressable, style]}
                accessibilityRole="button"
                accessibilityLabel={label}
            >
                <LinearGradient
                    colors={[...MARK_COMPLETE_GRADIENT]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <CheckIcon />
                        <TextComp text={label} style={styles.label} />
                    </View>
                </LinearGradient>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    pressable: {
        marginTop: moderateScale(12),
    },
    gradient: {
        minHeight: moderateScale(46),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        paddingHorizontal: moderateScale(16),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
});

export default React.memo(MarkCompleteButton);
