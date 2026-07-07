import HeaderComp from '@/components/HeaderComp';
import MyIcons, { IconName } from '@/components/MyIcons';
import PaymentMethodOption from '@/components/PaymentMethodOption';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { MainStackParamList } from '@/navigation/types';
import { Colors } from '@/styles/colors';
import { devLog } from '@/utils/logger';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles, { PAYMENT_ACCENT } from './styles';

type PaymentId = 'paypal' | 'google' | 'apple' | 'visa';

interface PaymentOption {
    id: PaymentId;
    title: string;
    subtitle?: string;
    icon?: IconName;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
    { id: 'paypal', title: 'PayPal', icon: 'paypal' },
    { id: 'google', title: 'Google Pay', icon: 'google' },
    { id: 'apple', title: 'Apple Pay', icon: 'apple' },
    { id: 'visa', title: '•••• 4567', subtitle: 'Expires 08/25', icon: 'visa' },
];

const PaymentMethod: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const [selectedId, setSelectedId] = useState<PaymentId>('visa');

    const handleSelect = useCallback((id: PaymentId) => {
        setSelectedId(id);
    }, []);

    const handleAddCard = useCallback(() => {
        devLog('Add new card');
    }, []);

    const gradientColors = [...Colors.gradientPrimary] as [string, string];

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.gradientPrimary[0]} />
            <LinearGradient
                colors={gradientColors}
                style={styles.gradientRoot}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <View style={styles.headerPad}>
                        <HeaderComp
                            centerTitle
                            title="Payment Details"
                            iconColor={Colors.text}
                            titleStyle={styles.headerTitle}
                            leftIcon='back'

                        />
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <TextComp
                                text="Manage your saved payment methods"
                                style={styles.sectionSubtitle}
                            />
                            {PAYMENT_OPTIONS.map((option) => (
                                <PaymentMethodOption
                                    key={option.id}
                                    icon={option.icon}
                                    title={option.title}
                                    subtitle={option.subtitle}
                                    isSelected={selectedId === option.id}
                                    onPress={() => handleSelect(option.id)}
                                />
                            ))}
                            <Pressable
                                onPress={handleAddCard}
                                style={({ pressed }) => [styles.addCardButton, pressed && { opacity: 0.92 }]}
                                accessibilityLabel="Add new card"
                            >
                                <TextComp text="Add New Card" style={styles.addCardButtonText} />
                            </Pressable>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </>
    );
};

export default React.memo(PaymentMethod);
