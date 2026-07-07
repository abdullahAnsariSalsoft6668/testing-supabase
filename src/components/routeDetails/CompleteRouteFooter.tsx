import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { COMPLETE_ROUTE_GRADIENT } from './constants';

const CheckIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 12l5 5L19 7"
            stroke={Colors.white}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

type CompleteRouteFooterProps = {
    onPress: () => void;
    disabled?: boolean;
};

const CompleteRouteFooter: React.FC<CompleteRouteFooterProps> = ({ onPress, disabled }) => {
    const insets = useSafeAreaInsets();
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    return (
        <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, moderateScale(12)) }]}>
            <View style={styles.shadow}>
                <Pressable
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    disabled={disabled}
                    style={({ pressed }) => [styles.pressable, pressed && disabled ? null : null]}
                    accessibilityRole="button"
                    accessibilityLabel="Complete Route"
                    accessibilityState={{ disabled: !!disabled }}
                >
                    <LinearGradient
                        colors={
                            disabled
                                ? [Colors.gray300, Colors.gray400]
                                : [...COMPLETE_ROUTE_GRADIENT]
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradient}
                    >
                        <View style={styles.content}>
                            <CheckIcon />
                            <TextComp text="Complete Route" style={styles.label} />
                        </View>
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(10),
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.gray200,
    },
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    pressable: {
        borderRadius: moderateScale(14),
        overflow: 'hidden',
    },
    gradient: {
        minHeight: moderateScale(52),
        borderRadius: moderateScale(14),
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(10),
    },
    label: {
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
});

export default React.memo(CompleteRouteFooter);
