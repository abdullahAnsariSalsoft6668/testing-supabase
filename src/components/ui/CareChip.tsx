import React, { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import TextComp from '@/components/TextComp';
import ScalePressable from '@/components/ui/ScalePressable';
import { hapticSelection } from '@/utils/haptics';
import {
    MOTION_DURATION,
    MOTION_SPRING,
    PRESS_SCALE_CHIP,
    SELECT_POP_SCALE,
} from '@/styles/motion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

type CareChipProps = {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

const CareChip = ({ label, selected = false, onPress, style }: CareChipProps) => {
    const pop = useSharedValue(1);

    useEffect(() => {
        if (selected) {
            pop.value = withSequence(
                withTiming(SELECT_POP_SCALE, { duration: MOTION_DURATION.instant }),
                withSpring(1, MOTION_SPRING.gentle),
            );
        }
    }, [pop, selected]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pop.value }],
    }));

    const handlePress = () => {
        hapticSelection();
        onPress?.();
    };

    return (
        <ScalePressable
            pressedScale={PRESS_SCALE_CHIP}
            onPress={handlePress}
            style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            <Animated.View style={animatedStyle}>
                <TextComp
                    text={label}
                    style={[
                        typography.label,
                        {
                            color: selected ? theme.colors.text.inverse : theme.colors.text.primary,
                            textTransform: 'none',
                        },
                    ]}
                />
            </Animated.View>
        </ScalePressable>
    );
};

const styles = StyleSheet.create({
    chip: {
        minHeight: theme.components.chip.minHeight,
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(10),
        borderRadius: theme.radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipUnselected: {
        backgroundColor: theme.components.chip.unselectedBackground,
    },
    chipSelected: {
        backgroundColor: theme.components.chip.selectedBackground,
    },
});

export default CareChip;
