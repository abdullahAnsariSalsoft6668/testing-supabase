import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';
import { ChatIcon, ChevronRightIcon, DocsIcon } from './HelpSupportIcons';
import type { QuickActionItem } from './types';

type QuickActionCardProps = {
    action: QuickActionItem;
    index: number;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action, index }) => {
    const animatedStyle = useEntranceAnimation({
        index: index + 2,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 18,
    });
    const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();

    const icon = action.type === 'chat' ? <ChatIcon /> : <DocsIcon />;

    const handlePress = useCallback(() => {
        Alert.alert(
            action.title,
            action.type === 'chat'
                ? 'Live chat will be available soon.'
                : 'Documentation will be available soon.',
        );
    }, [action.title, action.type]);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.card}
                accessibilityRole="button"
                accessibilityLabel={action.title}
            >
                <Animated.View style={[styles.inner, pressStyle]}>
                    <View style={styles.iconWrap}>{icon}</View>
                    <View style={styles.content}>
                        <TextComp text={action.title} style={styles.title} />
                        <TextComp text={action.subtitle} style={styles.subtitle} />
                    </View>
                    <ChevronRightIcon />
                </Animated.View>
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
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        backgroundColor: Colors.gray100,
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

export default React.memo(QuickActionCard);
