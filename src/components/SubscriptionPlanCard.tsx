import ButtonComp from '@/components/ButtonComp';
import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';

export type PlanVariant = 'basic' | 'premium' | 'pro';

export interface SubscriptionPlanCardProps {
    title: string;
    price: string;
    priceSuffix?: string;
    features: string[];
    onSelectPlan: () => void;
    variant: PlanVariant;
    recommended?: boolean;
}

const CARD_BG = {
    basic: '#FFEBEB',
    premium: '#F0E6FF',
    pro: '#FFEBEB',
} as const;

const CHECK_COLOR = {
    basic: Colors.brandSalmon,
    premium: Colors.brandPurple,
    pro: Colors.brandSalmon,
} as const;

const BUTTON_VARIANT: Record<PlanVariant, 'primary' | 'secondary' | 'premium'> = {
    basic: 'primary',
    premium: 'premium',
    pro: 'secondary',
};

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
    title,
    price,
    priceSuffix = '/month',
    features,
    onSelectPlan,
    variant,
    recommended = false,
}) => {
    const handlePress = useCallback(() => {
        onSelectPlan();
    }, [onSelectPlan]);

    const checkColor = CHECK_COLOR[variant];
    const cardBg = CARD_BG[variant];
    const buttonVariant = BUTTON_VARIANT[variant];

    return (
        <View style={[styles.card, { backgroundColor: cardBg }]}>
            {recommended && (
                <View style={styles.recommendedBadge}>
                    <TextComp text="Recommended" style={styles.recommendedText} />
                </View>
            )}
            <TextComp text={title} style={styles.planName} />
            <View style={styles.priceRow}>
                <TextComp text={price} style={styles.price} />
                <TextComp text={priceSuffix} style={styles.priceSuffix} />
            </View>
            <View style={styles.featureList}>
                {features.map((feature, index) => (
                    <View
                        key={index}
                        style={[styles.featureRow, I18nManager.isRTL && styles.featureRowRTL]}
                    >
                        <View style={[styles.checkCircle, { backgroundColor: checkColor }]}>
                            <TextComp text="✓" style={styles.checkMark} />
                        </View>
                        <TextComp text={feature} style={styles.featureText} />
                    </View>
                ))}
            </View>
            <ButtonComp
                title="Select Plan"
                onPress={handlePress}
                variant={buttonVariant}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: moderateScale(20),
        padding: moderateScale(20),
        marginBottom: moderateScale(16),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    recommendedBadge: {
        position: 'absolute',
        top: moderateScale(12),
        right: moderateScale(12),
        backgroundColor: Colors.secondary,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
    },
    recommendedText: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    planName: {
        fontSize: moderateScale(18),
        fontFamily: fontFamily.bold,
        color: Colors.text,
        marginBottom: moderateScale(8),
    },
    priceRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'baseline',
        marginBottom: moderateScale(16),
    },
    price: {
        fontSize: moderateScale(28),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
    priceSuffix: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.text,
        marginStart: moderateScale(4),
    },
    featureList: {
        marginBottom: moderateScale(20),
    },
    featureRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    featureRowRTL: {
        flexDirection: 'row-reverse',
    },
    checkCircle: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: moderateScale(10),
    },
    checkMark: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    featureText: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.text,
    },
    button: {
        alignSelf: 'stretch',
        borderRadius: moderateScale(24),
    },
});

export default React.memo(SubscriptionPlanCard);
