import { localImages } from '@/assets/images';
import {
    ContactSupportCards,
    FAQ_ITEMS,
    FaqCard,
    HELP_GRADIENT_GLOW,
    HELP_GRADIENT_MID,
    HELP_SUPPORT_BG,
    HelpSupportHeader,
    QUICK_ACTIONS,
    QuickActionCard,
    SectionTitle,
} from '@/components/helpSupport';
import WrapperContainer from '@/components/WrapperContainer';
import React, { useMemo } from 'react';
import { StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const WorkHistory: React.FC = () => {
    const quickActions = useMemo(() => QUICK_ACTIONS, []);
    const faqItems = useMemo(() => FAQ_ITEMS, []);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={HELP_SUPPORT_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={HELP_SUPPORT_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#00050a', HELP_SUPPORT_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[HELP_GRADIENT_GLOW, HELP_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />
                    <HelpSupportHeader
                        avatarSource={localImages.user}
                        title="Work History"
                        subtitle="Review your past routes and shifts"
                    />
                    <ContactSupportCards />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <SectionTitle title="Quick Actions" />
                    {quickActions.map((action, index) => (
                        <QuickActionCard key={action.id} action={action} index={index} />
                    ))}

                    <SectionTitle title="Frequently Asked Questions" baseDelay={200} />
                    {faqItems.map((item, index) => (
                        <FaqCard key={item.id} item={item} index={index} />
                    ))}
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default WorkHistory;
