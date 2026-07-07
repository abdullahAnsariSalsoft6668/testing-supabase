import { nasalization } from '@/assets/fonts';
import ButtonComp from '@/components/ButtonComp';
import CalendarComp, { DateData } from '@/components/CalendarComp';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { borders, heights, spaces } from '@/styles/sizes';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Svg, { Path, Rect } from 'react-native-svg';

export type ModalCompType = 'bottomSheet' | 'alert-box' | 'date-box' | 'withdraw-box';
export type AlertBoxStatus = 'success' | 'error' | 'confirm';
export type WithdrawMethod = 'bank' | 'crypto';

export interface WithdrawFormValues {
    method: WithdrawMethod;
    amount: string;
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
}

export interface ModalCompProps {
    isVisible: boolean;
    onClose: () => void;
    children?: ReactNode;
    type?: ModalCompType;
    containerStyle?: ViewStyle;
    backdropOpacity?: number;
    animationIn?: string;
    animationOut?: string;
    backdropTransitionOutTiming?: number;
    animationInTiming?: number;
    animationOutTiming?: number;
    showHandle?: boolean;
    showCloseButton?: boolean;
    title?: string;
    message?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    /** Used by `alert-box` for success / error icon styling */
    alertStatus?: AlertBoxStatus;
    /** Used by `date-box` */
    dateLabel?: string;
    dateValue?: string;
    onDateChange?: (date: string) => void;
    dateRequired?: boolean;
    /** Used by `withdraw-box` */
    balance?: string;
    withdrawMethod?: WithdrawMethod;
    onWithdrawMethodChange?: (method: WithdrawMethod) => void;
    onSubmitWithdraw?: (values: WithdrawFormValues) => void;
}

const DEFAULTS = {
    'alert-box': {
        success: {
            title: 'PAYMENT SUCCESSFUL',
            message: 'Your square has been added to the board.',
            primaryButtonText: 'VIEW MY SQUARES',
            secondaryButtonText: 'RETURN TO GAME BOARD',
        },
        error: {
            title: 'PAYMENT FAILED',
            message: 'Your square has been added to the board.',
            primaryButtonText: 'TRY AGAIN',
            secondaryButtonText: 'CANCEL',
        },
        confirm: {
            title: 'CONFIRM PURCHASE',
            message: 'Are you sure you want to purchase?',
            primaryButtonText: 'CONFIRM PURCHASE',
            secondaryButtonText: 'CANCEL',
        },
    },
    'date-box': {
        title: 'SELECT DATE FOR GAME',
        message: 'Choose a date to see basketball games on the dashboard.',
        dateLabel: 'Date',
        primaryButtonText: 'PROCEED TO DASHBOARD',
        secondaryButtonText: 'CANCEL',
    },
    'withdraw-box': {
        title: 'WITHDRAW EARNINGS',
        message: 'Transfer funds to your bank account or crypto wallet',
        balance: '$1245.50',
        primaryButtonText: 'SUBMIT WITHDRAWAL REQUEST',
        noticeText: 'Withdrawals are processed within 1-3 business days by the admin team.',
    },
} as const;

function formatDisplayDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${Number(month)} - ${Number(day)} - ${year}`;
}

function getTodayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
}

const CloseButton = ({ onPress }: { onPress: () => void }) => (
    <Pressable
        onPress={onPress}
        hitSlop={8}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
    >
        <MyIcons name="close" size={moderateScale(22)} />
    </Pressable>
);

const AlertStatusIcon = ({ status }: { status: AlertBoxStatus }) => (
    <View style={styles.statusIconWrap}>
        {status === 'confirm' ? (
            <View style={styles.confirmIconWrap}>
                <MyIcons name="bell" size={moderateScale(72)} />
                <View style={styles.confirmBadge}>
                    <TextComp text="1" style={styles.confirmBadgeText} />
                </View>
            </View>
        ) : (
            <MyIcons name={status === 'success' ? 'success' : 'fail'} size={moderateScale(72)} />
        )}
    </View>
);

const WalletIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="6" width="18" height="13" rx="2" stroke={Colors.black} strokeWidth={1.8} />
        <Path
            d="M3 10h18M16 14h2"
            stroke={Colors.black}
            strokeWidth={1.8}
            strokeLinecap="round"
        />
    </Svg>
);

type WithdrawBoxContentProps = {
    title?: string;
    message?: string;
    primaryButtonText?: string;
    balance?: string;
    noticeText?: string;
    withdrawMethod?: WithdrawMethod;
    onWithdrawMethodChange?: (method: WithdrawMethod) => void;
    onPrimaryPress?: () => void;
    onSubmitWithdraw?: (values: WithdrawFormValues) => void;
    onClose: () => void;
};

const WithdrawBoxContent: React.FC<WithdrawBoxContentProps> = ({
    title,
    message,
    primaryButtonText,
    balance,
    noticeText,
    withdrawMethod,
    onWithdrawMethodChange,
    onPrimaryPress,
    onSubmitWithdraw,
    onClose,
}) => {
    const [internalMethod, setInternalMethod] = useState<WithdrawMethod>('bank');
    const [amount, setAmount] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');

    const resolvedMethod = withdrawMethod ?? internalMethod;
    const resolvedTitle = title ?? DEFAULTS['withdraw-box'].title;
    const resolvedMessage = message ?? DEFAULTS['withdraw-box'].message;
    const resolvedBalance = balance ?? DEFAULTS['withdraw-box'].balance;
    const resolvedPrimaryText = primaryButtonText ?? DEFAULTS['withdraw-box'].primaryButtonText;
    const resolvedNoticeText = noticeText ?? DEFAULTS['withdraw-box'].noticeText;

    const handleMethodChange = useCallback(
        (method: WithdrawMethod) => {
            onWithdrawMethodChange?.(method);
            if (withdrawMethod == null) {
                setInternalMethod(method);
            }
        },
        [onWithdrawMethodChange, withdrawMethod],
    );

    const handleSubmit = useCallback(() => {
        const values: WithdrawFormValues = {
            method: resolvedMethod,
            amount,
            accountHolderName,
            accountNumber,
            confirmAccountNumber,
        };

        onSubmitWithdraw?.(values);
        (onPrimaryPress ?? onClose)();
    }, [
        accountHolderName,
        accountNumber,
        amount,
        confirmAccountNumber,
        onClose,
        onPrimaryPress,
        onSubmitWithdraw,
        resolvedMethod,
    ]);

    return (
        <ScrollView
            style={styles.withdrawScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <TextComp text={resolvedTitle} style={styles.centerTitle} />
            {resolvedMessage ? (
                <TextComp text={resolvedMessage} style={styles.withdrawMessage} />
            ) : null}

            <LinearGradient
                colors={[
                    Colors.buttonSplitFillStart,
                    Colors.buttonSplitFillMid,
                    Colors.buttonSplitFillEnd,
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.balanceCard}
            >
                <View style={styles.walletIconWrap}>
                    <WalletIcon />
                </View>
                <View style={styles.balanceTextWrap}>
                    <TextComp text="AVAILABLE BALANCE" style={styles.balanceLabel} />
                    <TextComp text={resolvedBalance} style={styles.balanceValue} />
                </View>
            </LinearGradient>

            <TextComp text="Withdrawal Method" style={styles.sectionLabel} />

            <View style={styles.methodRow}>
                <Pressable
                    onPress={() => handleMethodChange('bank')}
                    style={[
                        styles.methodCard,
                        resolvedMethod === 'bank' ? styles.methodCardActive : styles.methodCardInactive,
                    ]}
                >
                    <MyIcons name="bankTransfer" size={moderateScale(28)} fill={Colors.black} />
                    <TextComp text="Via Bank Transfer" style={styles.methodLabel} />
                </Pressable>
                <Pressable
                    onPress={() => handleMethodChange('crypto')}
                    style={[
                        styles.methodCard,
                        resolvedMethod === 'crypto' ? styles.methodCardActive : styles.methodCardInactive,
                    ]}
                >
                    <MyIcons name="cryptoWallet" size={moderateScale(28)} fill={Colors.black} />
                    <TextComp text="Crypto Wallet" style={styles.methodLabel} />
                </Pressable>
            </View>

            <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter Amount"
                placeholderTextColor={Colors.inputPlaceholder}
                keyboardType="decimal-pad"
                style={styles.withdrawInput}
            />
            <TextInput
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                placeholder="Account Holder Name"
                placeholderTextColor={Colors.inputPlaceholder}
                style={styles.withdrawInput}
            />
            <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Account Number / IBAN"
                placeholderTextColor={Colors.inputPlaceholder}
                style={styles.withdrawInput}
            />
            <TextInput
                value={confirmAccountNumber}
                onChangeText={setConfirmAccountNumber}
                placeholder="Confirm Account Number"
                placeholderTextColor={Colors.inputPlaceholder}
                style={styles.withdrawInput}
            />

            <TextComp text={resolvedNoticeText} style={styles.noticeText} />

            <ButtonComp
                title={resolvedPrimaryText}
                onPress={handleSubmit}
                style={styles.withdrawSubmitButton}
                rightIcon
                size="s"
            />
        </ScrollView>
    );
};

type CenterBoxContentProps = {
    type: 'alert-box' | 'date-box';
    title?: string;
    message?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    onClose: () => void;
    alertStatus?: AlertBoxStatus;
    dateLabel?: string;
    dateValue?: string;
    onDateChange?: (date: string) => void;
    dateRequired?: boolean;
};

const CenterBoxContent: React.FC<CenterBoxContentProps> = ({
    type,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    onClose,
    alertStatus = 'success',
    dateLabel,
    dateValue,
    onDateChange,
    dateRequired = true,
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [internalDate, setInternalDate] = useState(dateValue ?? getTodayIsoDate());

    const resolvedDate = dateValue ?? internalDate;

    const resolvedTitle =
        title ??
        (type === 'alert-box'
            ? DEFAULTS['alert-box'][alertStatus].title
            : DEFAULTS['date-box'].title);

    const resolvedMessage =
        message ??
        (type === 'alert-box'
            ? DEFAULTS['alert-box'][alertStatus].message
            : DEFAULTS['date-box'].message);

    const resolvedPrimaryText =
        primaryButtonText ??
        (type === 'alert-box'
            ? DEFAULTS['alert-box'][alertStatus].primaryButtonText
            : DEFAULTS['date-box'].primaryButtonText);

    const resolvedSecondaryText =
        secondaryButtonText ??
        (type === 'alert-box'
            ? DEFAULTS['alert-box'][alertStatus].secondaryButtonText
            : DEFAULTS['date-box'].secondaryButtonText);

    const resolvedDateLabel = dateLabel ?? DEFAULTS['date-box'].dateLabel;

    const handleDateSelect = useCallback(
        (day: DateData) => {
            onDateChange?.(day.dateString);
            if (dateValue == null) {
                setInternalDate(day.dateString);
            }
            setShowCalendar(false);
        },
        [dateValue, onDateChange],
    );

    const secondaryIsCancel = type === 'date-box' || alertStatus === 'error' || alertStatus === 'confirm';

    return (
        <>
            {type === 'alert-box' ? <AlertStatusIcon status={alertStatus} /> : null}

            <TextComp text={resolvedTitle} style={styles.centerTitle} />
            {resolvedMessage ? <TextComp text={resolvedMessage} style={styles.centerMessage} /> : null}

            {type === 'date-box' ? (
                <View style={styles.dateBlock}>
                    <View style={styles.dateLabelRow}>
                        <TextComp text={resolvedDateLabel} style={styles.dateLabel} />
                        {dateRequired ? <TextComp text="*" style={styles.requiredStar} /> : null}
                    </View>
                    <Pressable
                        style={styles.dateField}
                        onPress={() => setShowCalendar(prev => !prev)}
                    >
                        <TextComp text={formatDisplayDate(resolvedDate)} style={styles.dateValue} />
                        <MyIcons name="dateIcon" size={moderateScale(22)} />
                    </Pressable>
                    {showCalendar ? (
                        <CalendarComp
                            selected={resolvedDate}
                            onDayPress={handleDateSelect}
                            style={styles.calendar}
                        />
                    ) : null}
                </View>
            ) : null}

            <ButtonComp
                title={resolvedPrimaryText}
                onPress={onPrimaryPress ?? onClose}
                style={styles.primaryButton}
                rightIcon
            />

            <TouchableOpacity
                onPress={onSecondaryPress ?? onClose}
                activeOpacity={0.8}
                style={styles.secondaryButton}
            >
                <TextComp
                    text={resolvedSecondaryText}
                    style={secondaryIsCancel ? styles.secondaryCancelText : styles.secondaryLinkText}
                />
            </TouchableOpacity>
        </>
    );
};

const ModalComp: React.FC<ModalCompProps> = ({
    isVisible,
    onClose,
    children,
    type = 'bottomSheet',
    containerStyle,
    backdropOpacity = 0.55,
    animationIn,
    animationOut,
    backdropTransitionOutTiming = 300,
    animationInTiming = 300,
    animationOutTiming = 300,
    showHandle,
    showCloseButton = true,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    alertStatus = 'success',
    dateLabel,
    dateValue,
    onDateChange,
    dateRequired,
    balance,
    withdrawMethod,
    onWithdrawMethodChange,
    onSubmitWithdraw,
}) => {
    const isBottomSheet = type === 'bottomSheet';
    const isCenterBox =
        type === 'alert-box' || type === 'date-box' || type === 'withdraw-box';
    const resolvedShowHandle = showHandle ?? isBottomSheet;

    const resolvedAnimationIn = animationIn ?? (isBottomSheet ? 'slideInUp' : 'zoomIn');
    const resolvedAnimationOut = animationOut ?? (isBottomSheet ? 'slideOutDown' : 'zoomOut');

    const centerBoxContent = useMemo(() => {
        if (children) {
            return null;
        }

        if (type === 'withdraw-box') {
            return (
                <WithdrawBoxContent
                    title={title}
                    message={message}
                    primaryButtonText={primaryButtonText}
                    balance={balance}
                    withdrawMethod={withdrawMethod}
                    onWithdrawMethodChange={onWithdrawMethodChange}
                    onPrimaryPress={onPrimaryPress}
                    onSubmitWithdraw={onSubmitWithdraw}
                    onClose={onClose}
                />
            );
        }

        if (type === 'alert-box' || type === 'date-box') {
            return (
                <CenterBoxContent
                    type={type}
                    title={title}
                    message={message}
                    primaryButtonText={primaryButtonText}
                    secondaryButtonText={secondaryButtonText}
                    onPrimaryPress={onPrimaryPress}
                    onSecondaryPress={onSecondaryPress}
                    onClose={onClose}
                    alertStatus={alertStatus}
                    dateLabel={dateLabel}
                    dateValue={dateValue}
                    onDateChange={onDateChange}
                    dateRequired={dateRequired}
                />
            );
        }

        return null;
    }, [
        alertStatus,
        balance,
        children,
        dateLabel,
        dateRequired,
        dateValue,
        message,
        onClose,
        onDateChange,
        onPrimaryPress,
        onSecondaryPress,
        onSubmitWithdraw,
        onWithdrawMethodChange,
        primaryButtonText,
        secondaryButtonText,
        title,
        type,
        withdrawMethod,
    ]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            backdropOpacity={backdropOpacity}
            animationIn={resolvedAnimationIn as any}
            animationOut={resolvedAnimationOut as any}
            backdropTransitionOutTiming={backdropTransitionOutTiming}
            animationInTiming={animationInTiming}
            animationOutTiming={animationOutTiming}
            useNativeDriver
            useNativeDriverForBackdrop
            hideModalContentWhileAnimating
            avoidKeyboard
            style={isBottomSheet ? styles.bottomSheetModal : styles.centerModal}
            statusBarTranslucent
        >
            <View
                style={[
                    isBottomSheet
                        ? styles.bottomSheetContainer
                        : type === 'withdraw-box'
                          ? styles.withdrawBoxContainer
                          : styles.centerBoxContainer,
                    containerStyle,
                ]}
            >
                {isCenterBox && showCloseButton ? <CloseButton onPress={onClose} /> : null}
                {resolvedShowHandle ? <View style={styles.handle} /> : null}
                {children ?? centerBoxContent}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    bottomSheetModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    centerModal: {
        justifyContent: 'center',
        marginHorizontal: moderateScale(16),
    },
    bottomSheetContainer: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        padding: moderateScale(20),
        paddingTop: moderateScale(12),
        minHeight: moderateScale(100),
        shadowColor: Colors.text,
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    centerBoxContainer: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(24),
        paddingHorizontal: moderateScale(20),
        paddingTop: moderateScale(28),
        paddingBottom: moderateScale(24),
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    withdrawBoxContainer: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(24),
        paddingHorizontal: moderateScale(20),
        paddingTop: moderateScale(28),
        paddingBottom: moderateScale(20),
        maxHeight: '88%',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: moderateScale(14),
        right: moderateScale(14),
        zIndex: 2,
    },
    handle: {
        width: moderateScale(40),
        height: moderateScale(4),
        backgroundColor: Colors.textSecondary,
        opacity: 0.3,
        borderRadius: moderateScale(2),
        alignSelf: 'center',
        marginBottom: moderateScale(16),
    },
    statusIconWrap: {
        alignItems: 'center',
        marginBottom: moderateScale(16),
    },
    confirmIconWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBadge: {
        position: 'absolute',
        top: moderateScale(4),
        right: moderateScale(2),
        minWidth: moderateScale(18),
        height: moderateScale(18),
        borderRadius: moderateScale(9),
        backgroundColor: Colors.error,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(4),
    },
    confirmBadgeText: {
        fontSize: moderateScale(10),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    centerTitle: {
        fontFamily: nasalization.regular,
        fontSize: moderateScale(22),
        color: Colors.black,
        textAlign: 'center',
        letterSpacing: moderateScale(0.8),
        marginBottom: moderateScale(10),
        marginTop: moderateScale(16),
    },
    centerMessage: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: moderateScale(22),
        marginBottom: moderateScale(20),
        paddingHorizontal: moderateScale(8),
    },
    dateBlock: {
        marginBottom: moderateScale(20),
    },
    dateLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    dateLabel: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.label,
        color: Colors.black,
    },
    requiredStar: {
        color: Colors.error,
        marginLeft: moderateScale(4),
        fontSize: moderateScale(14),
    },
    dateField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.inputBackgroundApp,
        borderRadius: borders.input,
        minHeight: heights.input,
        paddingHorizontal: spaces.medium,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    dateValue: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.black,
    },
    calendar: {
        marginTop: moderateScale(12),
        borderRadius: moderateScale(12),
        overflow: 'hidden',
    },
    primaryButton: {
        width: '100%',
        marginBottom: moderateScale(12),
    },
    secondaryButton: {
        alignItems: 'center',
        paddingVertical: moderateScale(6),
    },
    secondaryLinkText: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: Colors.black,
        textAlign: 'center',
        letterSpacing: moderateScale(0.6),
    },
    secondaryCancelText: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: Colors.error,
        textAlign: 'center',
        letterSpacing: moderateScale(0.6),
    },
    withdrawScroll: {
        flexGrow: 0,
    },
    withdrawMessage: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: moderateScale(20),
        marginBottom: moderateScale(16),
        paddingHorizontal: moderateScale(4),
    },
    balanceCard: {
        borderRadius: moderateScale(14),
        padding: moderateScale(14),
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        marginBottom: moderateScale(18),
    },
    walletIconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceTextWrap: {
        flex: 1,
    },
    balanceLabel: {
        fontSize: moderateScale(10),
        fontFamily: fontFamily.bold,
        color: Colors.gray500,
        letterSpacing: moderateScale(0.6),
        marginBottom: moderateScale(2),
    },
    balanceValue: {
        fontSize: moderateScale(24),
        fontFamily: fontFamily.bold,
        color: Colors.black,
    },
    sectionLabel: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.label,
        color: Colors.black,
        marginBottom: moderateScale(10),
    },
    methodRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginBottom: moderateScale(16),
    },
    methodCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(12),
        borderWidth: 1.5,
        borderStyle: 'dashed',
        gap: moderateScale(8),
    },
    methodCardActive: {
        backgroundColor: 'rgba(0,161,58,0.08)',
        borderColor: Colors.success,
    },
    methodCardInactive: {
        backgroundColor: Colors.gray100,
        borderColor: Colors.gray200,
    },
    methodLabel: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.black,
        textAlign: 'center',
    },
    withdrawInput: {
        backgroundColor: Colors.white,
        borderRadius: borders.input,
        minHeight: heights.input,
        paddingHorizontal: spaces.medium,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.black,
        marginBottom: moderateScale(12),
    },
    noticeText: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: Colors.error,
        textAlign: 'center',
        lineHeight: moderateScale(18),
        marginBottom: moderateScale(16),
    },
    withdrawSubmitButton: {
        width: '100%',
        marginBottom: moderateScale(4),
    },
});

export default ModalComp;
