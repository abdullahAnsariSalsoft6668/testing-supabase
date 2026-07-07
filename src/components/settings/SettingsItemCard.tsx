import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENTRANCE_BASE, ENTRANCE_STEP, TOGGLE_ACTIVE } from './constants';
import {
    BellIcon,
    ChevronRightIcon,
    EyeIcon,
    GlobeIcon,
    LockIcon,
    MoonIcon,
} from './SettingsIcons';
import type { SettingsItem } from './types';

type SettingsItemCardProps = {
    item: SettingsItem;
    index: number;
    toggleValue?: boolean;
    onToggle?: (id: string, value: boolean) => void;
    onNavigate?: (screen?: string) => void;
};

const SettingsItemCard: React.FC<SettingsItemCardProps> = ({
    item,
    index,
    toggleValue = false,
    onToggle,
    onNavigate,
}) => {
    const animatedStyle = useEntranceAnimation({
        index,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 16,
    });
    const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();

    const icon = useMemo(() => {
        switch (item.icon) {
            case 'notifications':
                return <BellIcon />;
            case 'darkMode':
                return <MoonIcon />;
            case 'language':
                return <GlobeIcon />;
            case 'password':
                return <LockIcon />;
            case 'privacy':
                return <EyeIcon />;
            default:
                return <BellIcon />;
        }
    }, [item.icon]);

    const handleToggle = useCallback(
        (value: boolean) => {
            onToggle?.(item.id, value);
        },
        [item.id, onToggle],
    );

    const handlePress = useCallback(() => {
        if (item.type === 'navigate') {
            if (item.screen) {
                onNavigate?.(item.screen);
                return;
            }

            Alert.alert(item.title, 'This option will be available soon.');
        }
    }, [item.screen, item.title, item.type, onNavigate]);

    const content = (
        <View style={styles.inner}>
            <View style={styles.iconWrap}>{icon}</View>
            <View style={styles.content}>
                <TextComp text={item.title} style={styles.title} />
                <TextComp text={item.subtitle} style={styles.subtitle} />
            </View>
            {item.type === 'toggle' ? (
                <Switch
                    value={toggleValue}
                    onValueChange={handleToggle}
                    trackColor={{ false: Colors.gray300, true: TOGGLE_ACTIVE }}
                    thumbColor={Colors.white}
                    ios_backgroundColor={Colors.gray300}
                />
            ) : (
                <ChevronRightIcon />
            )}
        </View>
    );

    if (item.type === 'toggle') {
        return (
            <Animated.View style={[styles.card, animatedStyle]}>
                {content}
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Pressable
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                accessibilityRole="button"
                accessibilityLabel={item.title}
            >
                <Animated.View style={pressStyle}>{content}</Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        marginBottom: moderateScale(12),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(16),
        gap: moderateScale(12),
    },
    iconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: '#E8EDF5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(15),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(2),
    },
    subtitle: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
});

export default React.memo(SettingsItemCard);
