import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { I18nManager, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressScale } from '@/hooks/animations/usePressScale';
import MyIcons, { IconName } from './MyIcons';

export interface PaymentMethodOptionProps {
    title: string;
    subtitle?: string;
    icon?: IconName;
    isSelected: boolean;
    onPress: () => void;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
    title,
    subtitle,
    icon,
    isSelected,
    onPress,
}) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    const handlePress = useCallback(() => {
        onPress();
    }, [onPress]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={1}
        >
            <Animated.View
                style={[styles.card, isSelected && styles.cardSelected, animatedStyle]}
            >
                <View style={styles.leftRow}>
                    {icon ? (
                        <View style={styles.iconSlot}>
                            <MyIcons name={icon} size={moderateScale(26)} />
                        </View>
                    ) : null}
                    <View style={styles.textBlock}>
                        <TextComp text={title} style={isSelected ? {color: Colors.white}: styles.title} />
                        {subtitle != null && (
                            <TextComp text={subtitle} style={styles.subtitle} />
                        )}
                    </View>
                </View>
                <View
                    style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                    ]}
                >
                    {isSelected && (
                        <TextComp text="✓" style={styles.checkmark} />
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const ACCENT = '#B38646';

const styles = StyleSheet.create({
    card: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(20),
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(16),
        marginBottom: moderateScale(12),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'transparent',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardSelected: {
        borderWidth: 2,
        borderColor: ACCENT,
        backgroundColor: Colors.primary,
    },
    iconSlot: {
        width: moderateScale(44),
        height: moderateScale(32),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    leftRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        flex: 1,
        gap: moderateScale(12),
    },
    iconWrap: {
        marginEnd: moderateScale(12),
    },
    iconPlaceholder: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(8),
        backgroundColor: Colors.gray100,
        marginEnd: moderateScale(12),
    },
    textBlock: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
    subtitle: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: Colors.textSecondary,
        marginTop: moderateScale(2),
    },
    checkbox: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(6),
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: moderateScale(12),
    },
    checkboxSelected: {
        backgroundColor: ACCENT,
        borderColor: Colors.white,
    },
    checkmark: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
});

export default React.memo(PaymentMethodOption);
