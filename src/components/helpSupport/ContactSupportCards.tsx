import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import { CONTACT_CARD_GRADIENT, ENTRANCE_BASE, ENTRANCE_STEP, SUPPORT_EMAIL, SUPPORT_PHONE } from './constants';
import { EmailIcon, PhoneIcon } from './HelpSupportIcons';

type ContactCardProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
    index: number;
    onPress: () => void;
};

const ContactCard: React.FC<ContactCardProps> = ({ title, value, icon, index, onPress }) => {
    const animatedStyle = useEntranceAnimation({
        index,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 16,
    });
    const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();

    return (
        <Animated.View style={[styles.cardWrap, animatedStyle]}>
            <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Animated.View style={pressStyle}>
                    <LinearGradient
                        colors={[...CONTACT_CARD_GRADIENT]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        {icon}
                        <TextComp text={title} style={styles.title} />
                        <TextComp text={value} style={styles.value} />
                    </LinearGradient>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const ContactSupportCards: React.FC = () => {
    const sectionStyle = useEntranceAnimation({ baseDelay: 80, translateY: 12 });

    const handleCall = useCallback(() => {
        const phoneUrl = `tel:${SUPPORT_PHONE.replace(/[^\d+]/g, '')}`;
        Linking.openURL(phoneUrl).catch(() => {
            Alert.alert('Unable to call', SUPPORT_PHONE);
        });
    }, []);

    const handleEmail = useCallback(() => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {
            Alert.alert('Unable to open email', SUPPORT_EMAIL);
        });
    }, []);

    return (
        <Animated.View style={sectionStyle}>
            <TextComp text="Contact Support" style={styles.sectionTitle} />
            <View style={styles.row}>
                <ContactCard
                    title="Call Us"
                    value={SUPPORT_PHONE}
                    icon={<PhoneIcon />}
                    index={0}
                    onPress={handleCall}
                />
                <ContactCard
                    title="Email"
                    value={SUPPORT_EMAIL}
                    icon={<EmailIcon />}
                    index={1}
                    onPress={handleEmail}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginBottom: moderateScale(12),
    },
    row: {
        flexDirection: 'row',
        gap: moderateScale(12),
        marginBottom: moderateScale(8),
    },
    cardWrap: {
        flex: 1,
    },
    card: {
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: moderateScale(14),
        minHeight: moderateScale(108),
        justifyContent: 'center',
        gap: moderateScale(6),
    },
    title: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginTop: moderateScale(4),
    },
    value: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.72)',
    },
});

export default React.memo(ContactSupportCards);
