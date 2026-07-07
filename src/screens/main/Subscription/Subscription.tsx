import HeaderComp from '@/components/HeaderComp';
import SubscriptionPlanCard, {
    PlanVariant,
} from '@/components/SubscriptionPlanCard';
import WrapperContainer from '@/components/WrapperContainer';
import { useStagger } from '@/hooks/animations/useStagger';
import { Colors } from '@/styles/colors';
import { devLog } from '@/utils/logger';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import styles from './styles';
import routes from '@/constants/routes';
import { useNavigation } from '@react-navigation/native';

const STAGGER_DELAY = 70;

interface PlanData {
    id: string;
    title: string;
    price: string;
    priceSuffix: string;
    features: string[];
    variant: PlanVariant;
    recommended?: boolean;
}

const PLANS: PlanData[] = [
    {
        id: 'basic',
        title: 'Basic',
        price: 'Free',
        priceSuffix: '/month',
        features: [
            'Access to basic features',
            'Limited storage',
            'Community support',
        ],
        variant: 'basic',
    },
    {
        id: 'premium',
        title: 'Premium',
        price: '$9.99',
        priceSuffix: '/month',
        features: [
            'Access to all features',
            'Unlimited storage',
            'Priority support',
            'Exclusive content',
        ],
        variant: 'premium',
        recommended: true,
    },
    {
        id: 'pro',
        title: 'Pro',
        price: '$19.99',
        priceSuffix: '/month',
        features: [
            'Dedicated account manager',
            'Customizable reports',
            'White-label options',
        ],
        variant: 'pro',
    },
];

const Subscription: React.FC = () => {
    const navigation = useNavigation<any>();
    const card0Style = useStagger(0, STAGGER_DELAY).animatedStyle;
    const card1Style = useStagger(1, STAGGER_DELAY).animatedStyle;
    const card2Style = useStagger(2, STAGGER_DELAY).animatedStyle;

    const staggerStyles = useMemo(
        () => [card0Style, card1Style, card2Style],
        [card0Style, card1Style, card2Style]
    );

    const handleSelectPlan = useCallback((planId: string) => {
        // TODO: Navigate to payment or persist selection
        devLog('Select plan:', planId);
        navigation.navigate(routes.main.manageSubscriptions);
    }, []);

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp
                title="Subscription Plans"
                showBack={false}
                leftIcon="menu"
                iconColor={Colors.brandPurple}
                rightIcon="notification"
                titleStyle={styles.headerTitle}
            />
            <View style={styles.content}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                >
                    {PLANS.map((plan, index) => (
                        <Animated.View
                            key={plan.id}
                            style={staggerStyles[index]}
                        >
                            <SubscriptionPlanCard
                                title={plan.title}
                                price={plan.price}
                                priceSuffix={plan.priceSuffix}
                                features={plan.features}
                                variant={plan.variant}
                                recommended={plan.recommended}
                                onSelectPlan={() => handleSelectPlan(plan.id)}
                            />
                        </Animated.View>
                    ))}
                </ScrollView>
            </View>
        </WrapperContainer>
    );
};

export default React.memo(Subscription);
