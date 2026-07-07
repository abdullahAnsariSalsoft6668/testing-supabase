import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { InfoIcon } from './WageIcons';

const ContactCard: React.FC = () => {
    const animatedStyle = useEntranceAnimation({ baseDelay: 120, index: 1 });

    return (
        <Animated.View style={[styles.contactCard, animatedStyle]}>
            <TextComp
                text="Questions about your wages? Contact the admin office for detailed breakdowns."
                style={styles.contactText}
            />
        </Animated.View>
    );
};

const DisclaimerCard: React.FC = () => {
    const animatedStyle = useEntranceAnimation({ baseDelay: 150, index: 2 });

    return (
        <Animated.View style={[styles.disclaimerCard, animatedStyle]}>
            <InfoIcon />
            <View style={styles.disclaimerContent}>
                <TextComp text="Estimated Earnings" style={styles.disclaimerTitle} />
                <TextComp
                    text="The amounts shown are estimates based on submitted data. Final calculations are subject to admin review and approval."
                    style={styles.disclaimerBody}
                />
            </View>
        </Animated.View>
    );
};

const WageInfoCards: React.FC = () => (
    <>
        <ContactCard />
        <DisclaimerCard />
    </>
);

const styles = StyleSheet.create({
    contactCard: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        padding: moderateScale(18),
        marginBottom: moderateScale(12),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    contactText: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: moderateScale(20),
    },
    disclaimerCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(12),
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        padding: moderateScale(16),
        marginBottom: moderateScale(8),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    disclaimerContent: {
        flex: 1,
    },
    disclaimerTitle: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(6),
    },
    disclaimerBody: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        lineHeight: moderateScale(18),
    },
});

export default React.memo(WageInfoCards);
