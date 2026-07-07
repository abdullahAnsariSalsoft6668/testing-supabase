import { plusJakarta } from '@/assets/fonts';
import { LogoutIcon } from '@/components/drawer/DrawerMenuIcons';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import ButtonComp from './ButtonComp';
import MyIcons from './MyIcons';
import TextComp from './TextComp';
import { localLottie } from '@/assets/lottie';
import LottieView from 'lottie-react-native';
import { spaces } from '@/styles/sizes';

export type AppModalType =
    | 'cart'
    | 'login'
    | 'filter'
    | 'payment'
    | 'appointment'
    | 'quoteRequest'
    | 'booking'
    | 'logout';

interface AppModalProps {
    isVisible: boolean;
    onClose: () => void;
    /** Called after the modal has fully hidden (use with navigation after dismiss to avoid glitches). */
    onModalHide?: () => void;
    type: AppModalType;
    title?: string;
    message?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    appointmentProviderName?: string;
    appointmentProviderSpecialty?: string;
    appointmentDateText?: string;
    appointmentTimeText?: string;
    appointmentLocationText?: string;
    appointmentProviderImage?: ImageSourcePropType;
    children?: React.ReactNode;
}

const AppModal: React.FC<AppModalProps> = ({
    isVisible,
    onClose,
    onModalHide,
    type,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    appointmentProviderName,
    appointmentProviderSpecialty,
    appointmentDateText,
    appointmentTimeText,
    appointmentLocationText,
    appointmentProviderImage,
    children,
}) => {
    const isBottomSheet =
        type === 'cart' ||
        type === 'filter' ||
        type === 'payment' ||
        type === 'appointment' ||
        type === 'quoteRequest' ||
        type === 'booking';

    const resolvedTitle =
        title ??
        (type === 'cart'
            ? ''
            : type === 'login'
                ? 'Sign In Required'
                : type === 'payment'
                    ? ''
                    : type === 'appointment'
                        ? 'Your appointment is confirmed!'
                        : type === 'quoteRequest'
                            ? 'Your request has been submitted successfully!'
                            : type === 'logout'
                                ? 'Log out?'
                                : type === 'filter'
                                    ? ''
                                    : '');

    const resolvedMessage =
        message ??
        (type === 'cart'
            ? 'Product has been successfully added to cart!'
            : type === 'login'
                ? 'Please login to continue.'
                : type === 'payment'
                    ? 'Your order has been placed successfully!'
                    : type === 'appointment'
                        ? "You're all set! We've sent a confirmation to your email."
                        : type === 'quoteRequest'
                            ? ''
                            : type === 'logout'
                                ? 'Are you sure you want to log out?'
                                : '');

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            backdropOpacity={0.55}
            animationIn={isBottomSheet ? 'slideInUp' : 'zoomIn'}
            animationOut={isBottomSheet ? 'slideOutDown' : 'zoomOut'}
            animationInTiming={220}
            animationOutTiming={180}
            backdropTransitionInTiming={220}
            backdropTransitionOutTiming={0}
            style={isBottomSheet ? styles.bottomModalRoot : styles.centerModalRoot}
            useNativeDriver
            useNativeDriverForBackdrop
            hideModalContentWhileAnimating
            avoidKeyboard
            onModalHide={onModalHide}
        >
            <View style={[styles.baseCard, isBottomSheet ? styles.bottomSheetCard : styles.centerCard]}>
                {isBottomSheet ? <View style={styles.handle} /> : null}

                {type === 'cart' ? (
                    <>
                        <View style={styles.successIconWrap}>
                            <LottieView source={localLottie.success} autoPlay loop={false} style={styles.successIcon} />
                        </View>
                        {resolvedMessage ? <TextComp text={resolvedMessage} style={styles.message} /> : null}
                        <ButtonComp
                            title={primaryButtonText ?? 'View Cart'}
                            onPress={onPrimaryPress ?? onClose}
                            height={52}
                            style={styles.primaryButton}
                        />
                    </>
                ) : null}

                {type === 'payment' ? (
                    <>
                        <View style={styles.successIconWrap}>
                            <LottieView
                                source={localLottie.success}
                                autoPlay
                                loop={false}
                                speed={1}
                                style={styles.successIcon}
                            />
                        </View>
                        {resolvedMessage ? <TextComp text={resolvedMessage} style={styles.message} /> : null}
                        <ButtonComp
                            title={primaryButtonText ?? 'View Order History'}
                            onPress={onPrimaryPress ?? onClose}
                            height={52}
                            style={styles.primaryButton}
                            variant="premium"
                        />
                    </>
                ) : null}





                {type === 'filter' ? (
                    <>
                        {resolvedTitle ? <TextComp text={resolvedTitle} style={styles.filterTitle} /> : null}
                        {children}
                    </>
                ) : null}

                {type === 'logout' ? (
                    <>
                        <View style={styles.logoutIconWrap}>
                            <View style={styles.logoutIconCircle}>
                                <LogoutIcon />
                            </View>
                        </View>
                        {resolvedTitle ? (
                            <TextComp text={resolvedTitle} style={styles.logoutSheetTitle} />
                        ) : null}
                        {resolvedMessage ? (
                            <TextComp text={resolvedMessage} style={styles.logoutSheetMessage} />
                        ) : null}
                        <View style={styles.logoutActionsRow}>
                            <ButtonComp
                                title={secondaryButtonText ?? 'No'}
                                onPress={onSecondaryPress ?? onClose}
                                variant="outline"
                                height={48}
                                style={styles.logoutActionButtonOutline}
                                textStyle={styles.logoutNoText}
                            />
                            <ButtonComp
                                title={primaryButtonText ?? 'Yes'}
                                onPress={onPrimaryPress ?? onClose}
                                height={48}
                                style={styles.logoutActionButton}
                                textStyle={styles.logoutYesText}
                                variant="primary"
                            />
                        </View>
                    </>
                ) : null}

                {type === 'login' ? (
                    <>
                        <TextComp text={resolvedTitle} style={styles.loginTitle} />
                        {resolvedMessage ? <TextComp text={resolvedMessage} style={styles.loginMessage} /> : null}
                        <ButtonComp
                            title={primaryButtonText ?? 'Login'}
                            onPress={onPrimaryPress ?? onClose}
                            height={50}
                            style={styles.primaryButton}
                        />
                        {secondaryButtonText ? (
                            <TouchableOpacity onPress={onSecondaryPress ?? onClose} activeOpacity={0.8}>
                                <TextComp text={secondaryButtonText} style={styles.secondaryTextButton} />
                            </TouchableOpacity>
                        ) : null}
                    </>
                ) : null}

            </View>
        </Modal>
    );
};

export default AppModal;

const styles = StyleSheet.create({
    successIcon: {
        width: moderateScale(80),
        height: moderateScale(80),
    },
    bottomModalRoot: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    centerModalRoot: {
        justifyContent: 'center',
        marginHorizontal: moderateScale(24),
    },
    baseCard: {
        backgroundColor: Colors.surface,
        borderRadius: moderateScale(20),

    },
    bottomSheetCard: {
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        paddingHorizontal: moderateScale(22),
        paddingTop: moderateScale(12),
        paddingBottom: moderateScale(28),
    },
    centerCard: {
        borderRadius: moderateScale(24),
        paddingHorizontal: moderateScale(24),
        paddingVertical: moderateScale(28),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    appointmentTitle: {
        fontSize: moderateScale(34 / 1.4),
        color: Colors.gray700,
        fontFamily: fontFamily.bold,
        textAlign: 'center',
        marginBottom: moderateScale(8),
    },
    appointmentMessage: {
        fontSize: moderateScale(30 / 1.8),
        lineHeight: moderateScale(40 / 1.8),
        color: Colors.gray600,
        fontFamily: fontFamily.regular,
        textAlign: 'center',
        marginBottom: moderateScale(16),
        paddingHorizontal: moderateScale(8),
    },
    appointmentProviderCard: {
        backgroundColor: '#F7DCDD',
        borderRadius: moderateScale(14),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(16),
    },
    appointmentProviderImage: {
        width: moderateScale(62),
        height: moderateScale(62),
        borderRadius: moderateScale(31),
        backgroundColor: Colors.surface,
    },
    appointmentProviderBody: {
        marginLeft: moderateScale(10),
        flex: 1,
    },
    appointmentProviderName: {
        color: Colors.gray700,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(30 / 1.7),
        marginBottom: moderateScale(2),
    },
    appointmentProviderSpecialty: {
        color: Colors.gray500,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(24 / 1.7),
    },
    appointmentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(10),
    },
    appointmentMetaIconWrap: {
        width: moderateScale(34),
        height: moderateScale(34),
        borderRadius: moderateScale(6),
        backgroundColor: Colors.brandSalmon,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(10),
    },
    appointmentMetaText: {
        color: Colors.gray700,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(28 / 1.7),
        flex: 1,
    },
    quoteTitle: {
        fontSize: moderateScale(20),
        lineHeight: moderateScale(30),
        color: Colors.gray700,
        fontFamily: fontFamily.bold,
        textAlign: 'center',
        marginBottom: moderateScale(22),
        paddingHorizontal: moderateScale(20),
    },
    handle: {
        width: moderateScale(58),
        height: moderateScale(5),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.gray200,
        alignSelf: 'center',
        marginBottom: moderateScale(16),
    },
    successIconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(6),
        alignSelf: 'center',
    },
    successIconText: {
        color: Colors.white,
        fontSize: moderateScale(38),
        fontFamily: fontFamily.bold,
        lineHeight: moderateScale(38),
    },
    message: {
        fontSize: moderateScale(18),
        lineHeight: moderateScale(22),
        color: Colors.gray600,
        fontFamily: fontFamily.bold,
        textAlign: 'center',
        marginBottom: moderateScale(22),
        paddingHorizontal: moderateScale(8),
    },
    primaryButton: {
        borderRadius: moderateScale(26),
        width: '100%',
    },
    loginTitle: {
        fontSize: moderateScale(20),
        color: Colors.text,
        fontFamily: fontFamily.bold,
        textAlign: 'center',
        marginBottom: moderateScale(10),
    },
    loginMessage: {
        fontSize: moderateScale(14),
        color: Colors.textSecondary,
        fontFamily: fontFamily.regular,
        textAlign: 'center',
        marginBottom: moderateScale(18),
    },
    secondaryTextButton: {
        marginTop: moderateScale(12),
        color: Colors.brandPurple,
        fontFamily: fontFamily.bold,
        textAlign: 'center',
    },
    filterTitle: {
        fontSize: moderateScale(18),
        color: Colors.text,
        textAlign: 'center',
        fontFamily: fontFamily.bold,
        marginBottom: moderateScale(8),
    },
    bookingRatingBlock: {
        paddingVertical: spaces.medium,
        gap: spaces.small,
        // alignItems: 'center',
    },
    bookingTitleBelowStars: {
        marginTop: moderateScale(12),
        textAlign: 'center',
        fontFamily: fontFamily.bold,
    },
    bookingReviewInput: {
        width: '100%',
        height: moderateScale(100),
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(10),
        marginTop: moderateScale(10),
        textAlign: 'left',
        textAlignVertical: 'top',

    },
    bookingReviewTitle: {
        fontSize: moderateScale(16),
        textAlign: 'left',

    },
    submitReviewButton: {
        marginTop: spaces.small,
    },
    logoutIconWrap: {
        alignItems: 'center',
        marginBottom: moderateScale(18),
    },
    logoutIconCircle: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(36),
        backgroundColor: palette.purple.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutSheetTitle: {
        fontSize: moderateScale(20),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        textAlign: 'center',
        marginBottom: moderateScale(8),
    },
    logoutSheetMessage: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: moderateScale(24),
        paddingHorizontal: moderateScale(8),
        lineHeight: moderateScale(21),
    },
    logoutActionsRow: {
        flexDirection: 'row',
        gap: moderateScale(12),
        width: '100%',
    },
    logoutActionButtonOutline: {
        flex: 1,
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: Colors.gray200,
        backgroundColor: Colors.white,
    },
    logoutActionButton: {
        flex: 1,
        borderRadius: moderateScale(14),
        overflow: 'hidden',
    },
    logoutNoText: {
        color: Colors.text,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
    },
    logoutYesText: {
        color: Colors.text,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
    },

});
