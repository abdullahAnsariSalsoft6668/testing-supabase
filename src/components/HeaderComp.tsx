import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { useDrawerSafe } from '@/context/DrawerContext';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import { clearDataAction } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { ReactNode, useState } from 'react';
import { I18nManager, Pressable, StyleSheet, View } from 'react-native';
import MyIcons, { IconName } from './MyIcons';
import { lifeSavers } from '@/assets/fonts';

interface HeaderCompProps {
    title?: string;
    showBack?: boolean;
    customStyle?: object;
    iconColor?: string;
    leftIcon?: IconName;
    onLeftIconPress?: () => void;
    rightIcon?: IconName;
    onRightIconPress?: () => void;
    /** Red dot on the top-right of the right icon (e.g. unread notifications). */
    rightBadge?: boolean;
    titleStyle?: object;
    /** Replaces the left icon slot (e.g. profile avatar). */
    leftElement?: ReactNode;
    /** Replaces the right icon slot (e.g. multiple actions). */
    rightElement?: ReactNode;
    /**
     * When true, title is centered between equal side columns (use with leftElement/rightElement
     * when sides have different widths).
     */
    centerTitle?: boolean;
}

const HeaderComp: React.FC<HeaderCompProps> = ({
    title,
    showBack = true,
    customStyle,
    iconColor = Colors.white,
    leftIcon,
    onLeftIconPress,
    rightIcon,
    onRightIconPress,
    rightBadge = false,
    titleStyle,
    leftElement,
    rightElement,
    centerTitle = false,
}) => {
    const navigation = useNavigation();
    const drawer = useDrawerSafe();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingLogout, setIsLoadingLogout] = useState(false);

    const { isFirstTime } = useSelector(state => state.auth);

    const handleBackPress = () => {
        navigation.goBack();
    };
    const handleMenuPress = () => {
        drawer?.open();
    };

    const closeModal = () => {
        setIsModalVisible(false);
    }

    const onLogout = () => {
        setIsLoadingLogout(true);
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                clearDataAction();
                setIsLoadingLogout(false);
            }, 400);
        }, 1500);
    }

    const leftSlot =
        leftElement != null ? (
            <View style={styles.sideSlot}>{leftElement}</View>
        ) : leftIcon ? (
            <Pressable
                onPress={
                    onLeftIconPress
                        ? onLeftIconPress
                        : leftIcon === 'back'
                            ? handleBackPress
                            : handleBackPress
                }
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.iconButton}
            >
                <MyIcons name={leftIcon} size={moderateScale(24)} />
            </Pressable>
        ) : (
            <View style={{ width: moderateScale(40) }} />
        );

    const rightSlot =
        rightElement != null ? (
            <View style={[styles.sideSlot, styles.sideSlotEnd]}>{rightElement}</View>
        ) : rightIcon ? (
            <Pressable
                onPress={
                    onRightIconPress
                        ? onRightIconPress
                        : () => navigateToAlertsTab(navigation)
                }
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.rightIconButton}
            >
                <View style={styles.rightIconInner}>
                    <MyIcons name={rightIcon} size={moderateScale(24)} />
                    {rightBadge ? <View style={styles.notificationBadge} /> : null}
                </View>
            </Pressable>
        ) : (
            <View style={{ width: moderateScale(40) }} />
        );

    if (centerTitle && title) {
        return (
            <View style={[styles.container, styles.containerCenterTitle, customStyle]}>
                {leftSlot}
                <View style={styles.titleCenterWrap} pointerEvents="box-none">
                    <TextComp
                        text={title}
                        style={[styles.titleText, { color: iconColor }, titleStyle]}
                    />
                </View>
                {rightSlot}
            </View>
        );
    }

    return (
        <View style={[styles.container, customStyle]}>
            {leftSlot}

            {title && (
                <TextComp
                    text={title}
                    style={[styles.titleText, { color: iconColor }, titleStyle]}
                />
            )}

            {rightSlot}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        // paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(12),
    },
    containerCenterTitle: {
        justifyContent: 'flex-start',
    },
    sideSlot: {
        minWidth: moderateScale(48),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    sideSlotEnd: {
        alignItems: 'flex-end',
    },
    titleCenterWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: lifeSavers.bold,
        fontSize: moderateScale(20),
        color: Colors.text,
    },
    modalContainer: {
        backgroundColor: Colors.background,
        minHeight: moderateScale(100),
    },
    modalTitle: {
        fontSize: moderateScale(24),
        fontFamily: fontFamily.bold,
        marginBottom: moderateScale(24),
        textAlign: 'center',
    },
    iconButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightIconButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightIconInner: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: moderateScale(4),
        right: moderateScale(6),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.error,
        borderWidth: 1.5,
        borderColor: Colors.white,
    },
});

export default HeaderComp;
