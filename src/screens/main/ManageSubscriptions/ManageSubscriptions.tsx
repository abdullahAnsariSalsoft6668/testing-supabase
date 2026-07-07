import ActionItemCard from '@/components/ActionItemCard';
import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import MyIcons, { IconName } from '@/components/MyIcons';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import routes from '@/constants/routes';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import styles from './styles';

interface ActionDef {
    id: string;
    title: string;
    iconColor: string;
    icon: IconName;
}

const ACTIONS: ActionDef[] = [
    { id: 'change', title: 'Change Plan', iconColor: Colors.actionIconBlue, icon: 'changePlan' },
    { id: 'pause', title: 'Pause Subscription', iconColor: Colors.actionIconOrange, icon: 'pause' },
    { id: 'cancel', title: 'Cancel Subscription', iconColor: Colors.actionIconRed, icon: 'cancel' },
    { id: 'billing', title: 'Billing History & Invoices', iconColor: Colors.actionIconGrey, icon: 'billing' },
];

const ManageSubscriptions: React.FC = () => {
    const navigation = useNavigation<any>();
    const handleUpgrade = useCallback(() => {
        navigation.navigate(routes.main.paymentMethod);
    }, []);

    const handleAction = useCallback((id: string) => {
    }, []);

    const renderActionIcon = useCallback((icon: IconName) => (
        <MyIcons name={icon} size={moderateScale(22)} stroke={Colors.white} />
    ), []);

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp
                title="Manage Subscriptions"
                showBack={true}
                leftIcon="backBlack"
                iconColor={Colors.brandPurple}
                rightIcon="notification"
                titleStyle={styles.headerTitle}
            />
            <View style={styles.content}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.subscriptionCard}>
                        <View style={styles.billingRow}>
                            <TextComp text="Next billing date: Dec 15, 2025" style={styles.nextBilling} />
                            <TextComp text="$99.99/month" style={styles.price} />
                        </View>
                        <TextComp text="Premium Plan" style={styles.planName} />
                        <ButtonComp
                            title="Upgrade Plan"
                            onPress={handleUpgrade}
                            variant="primary"
                            style={styles.upgradeButton}
                        />
                    </View>

                    <TextComp text="Actions" style={styles.sectionTitle} />

                    {ACTIONS.map((action) => (
                        <ActionItemCard
                            key={action.id}
                            title={action.title}
                            iconBackgroundColor={action.iconColor}
                            iconPlaceholder={renderActionIcon(action.icon)}
                            onPress={() => handleAction(action.id)}
                        />
                    ))}
                </ScrollView>
            </View>
        </WrapperContainer>
    );
};

export default React.memo(ManageSubscriptions);
