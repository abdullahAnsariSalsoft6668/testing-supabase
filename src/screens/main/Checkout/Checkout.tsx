import { localImages } from '@/assets/images';
import ButtonComp from '@/components/ButtonComp';
import CustomModal from '@/components/Modal';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import CheckoutFormInput from './CheckoutFormInput';
import CheckoutScreenHeader from './CheckoutScreenHeader';
import CheckoutSummary from './CheckoutSummary';
import styles from './styles';

const UserIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={Colors.gray400} strokeWidth={1.8} />
        <Path
            d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"
            stroke={Colors.gray400}
            strokeWidth={1.8}
            strokeLinecap="round"
        />
    </Svg>
);

const CardIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="5" width="20" height="14" rx="2" stroke={Colors.gray400} strokeWidth={1.8} />
        <Path d="M2 10h20" stroke={Colors.gray400} strokeWidth={1.8} />
    </Svg>
);

const CvvIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="6" width="18" height="12" rx="2" stroke={Colors.gray400} strokeWidth={1.8} />
        <Path
            d="M8 12h2M14 12h2M11 12h2"
            stroke={Colors.gray400}
            strokeWidth={1.8}
            strokeLinecap="round"
        />
    </Svg>
);

const Checkout: React.FC = () => {
    const navigation = useNavigation();
    const [cardHolderName, setCardHolderName] = useState('James Anderson');
    const [cardNumber, setCardNumber] = useState('James.25john@gmail.com');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const handleConfirmPurchase = useCallback(() => {
        setIsConfirmModalVisible(false);
        setIsSuccessModalVisible(true);
    }, []);

    const handleViewMySquares = useCallback(() => {
        setIsSuccessModalVisible(false);
        navigation.navigate(routes.main.mybets as never);
    }, [navigation]);

    return (
        <WrapperContainer style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ImageBackground source={localImages.homeBg} style={styles.background} resizeMode="cover">
                <CheckoutScreenHeader />

                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <TextComp text="PAYMENT" style={styles.sectionTitle} />
                    <TextComp
                        text="Enter your card details below for secure payment processing"
                        style={styles.sectionSubtitle}
                    />

                    <CheckoutFormInput
                        label="Cardholder's Name"
                        icon={<MyIcons name="userIcon" size={moderateScale(20)} />}
                        value={cardHolderName}
                        onChangeText={setCardHolderName}
                        placeholder="James Anderson"
                    />
                    <CheckoutFormInput
                        label="Card Number"
                        icon={<CardIcon />}
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        placeholder="James.25john@gmail.com"
                        keyboardType="default"
                    />
                    <CheckoutFormInput
                        label="Expiry"
                        icon={<MyIcons name="dateIcon" size={moderateScale(20)} />}
                        value={expiry}
                        onChangeText={setExpiry}
                        placeholder="mm/dd/yy"
                        keyboardType="number-pad"
                    />
                    <CheckoutFormInput
                        label="CVV"
                        icon={<MyIcons name="counting" size={moderateScale(20)} />}
                        value={cvv}
                        onChangeText={setCvv}
                        placeholder="505"
                        keyboardType="number-pad"
                        secureTextEntry
                    />

                    <ButtonComp
                        title="PAY NOW"
                        onPress={() => setIsConfirmModalVisible(true)}
                        variant="premium"
                        height={moderateScale(52)}
                        style={styles.payButton}
                        rightIcon
                    />

                    <View style={styles.summaryWrap}>
                        <CheckoutSummary />
                    </View>
                </ScrollView>
            </ImageBackground>

            <CustomModal
                isVisible={isConfirmModalVisible}
                onClose={() => setIsConfirmModalVisible(false)}
                type="alert-box"
                alertStatus="confirm"
                onPrimaryPress={handleConfirmPurchase}
                onSecondaryPress={() => setIsConfirmModalVisible(false)}
            />

            <CustomModal
                isVisible={isSuccessModalVisible}
                onClose={() => setIsSuccessModalVisible(false)}
                type="alert-box"
                alertStatus="success"
                onPrimaryPress={handleViewMySquares}
                onSecondaryPress={() => setIsSuccessModalVisible(false)}
            />
        </WrapperContainer>
    );
};

export default Checkout;
