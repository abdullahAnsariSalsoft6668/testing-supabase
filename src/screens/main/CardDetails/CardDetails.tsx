import HeaderComp from '@/components/HeaderComp';
import ButtonComp from '@/components/ButtonComp';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { MainStackParamList } from '@/navigation/types';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const CardDetails: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const [cardHolderName, setCardHolderName] = useState('Mr. Myles Wilson');
    const [cardNumber, setCardNumber] = useState('6666 4444 9999 8888');
    const [expiryDate, setExpiryDate] = useState('09/25');
    const [cvv, setCvv] = useState('566');

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp
                showBack
                leftIcon="backBlack"
                title="Card Details"
                iconColor={Colors.brandPurple}
                rightIcon="notification"
                onRightIconPress={() => {}}
                titleStyle={{ color: Colors.brandPurple }}
            />

            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <LinearGradient
                        colors={[...Colors.gradientSecondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardPreview}
                    >
                        <View style={styles.cardPreviewTop}>
                            <TextComp text="****  ****  ****  8888" style={styles.cardMaskedNumber} />
                            <MyIcons name="visa" size={moderateScale(56)} stroke={Colors.white}/>
                        </View>
                        <View style={styles.cardPreviewBottom}>
                            <TextComp text="Mr. Myles" style={styles.cardName} />
                            <TextComp text="09/25" style={styles.cardExpiry} />
                        </View>
                    </LinearGradient>

                    <View style={styles.inputSection}>
                        <TextInputComp
                            value={cardHolderName}
                            onChangeText={setCardHolderName}
                            placeholder="Card holder name"
                            placeholderTextColor={Colors.gray400}
                            containerStyle={styles.inputWrap}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={styles.inputText}
                            leftIcon={<MyIcons name="user" size={moderateScale(18)} />}
                        />
                        <TextInputComp
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            placeholder="Card number"
                            placeholderTextColor={Colors.gray400}
                            containerStyle={styles.inputWrap}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={styles.inputText}
                            keyboardType="number-pad"
                            leftIcon={<MyIcons name="card" size={moderateScale(18)} />}
                        />
                        <View style={styles.rowInputs}>
                            <TextInputComp
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                                placeholder="MM/YY"
                                placeholderTextColor={Colors.gray400}
                                containerStyle={styles.rowInputLeft}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputText}
                                leftIcon={<MyIcons name="dateTime" size={moderateScale(18)} />}
                            />
                            <TextInputComp
                                value={cvv}
                                onChangeText={setCvv}
                                placeholder="CVV"
                                placeholderTextColor={Colors.gray400}
                                containerStyle={styles.rowInputRight}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputText}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.summarySection}>
                        <View style={styles.summaryRow}>
                            <TextComp text="Subtotal (4 Items)" style={styles.summaryLabel} />
                            <TextComp text="$128.00" style={styles.summaryValue} />
                        </View>
                        <View style={styles.summaryRow}>
                            <TextComp text="Discount" style={styles.summaryLabel} />
                            <TextComp text="$10.00" style={styles.summaryValue} />
                        </View>
                        <View style={styles.summaryRow}>
                            <TextComp text="Shipping" style={styles.summaryLabel} />
                            <TextComp text="$00.00" style={styles.summaryValue} />
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                            <TextComp text="Total Amount" style={styles.summaryTotalLabel} />
                            <TextComp text="$138.00" style={styles.summaryTotalValue} />
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.bottomButtonWrap}>
                <ButtonComp
                    title="Pay Now"
                    onPress={() => {}}
                    variant="premium"
                    height={52}
                    style={styles.bottomButton}
                />
            </View>
        </WrapperContainer>
    );
};

export default CardDetails;
