import HeaderComp from '@/components/HeaderComp';
import MyIcons from '@/components/MyIcons';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const BackIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M15 6l-6 6 6 6"
            stroke={Colors.white}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const MyBetsScreenHeader: React.FC = () => {
    const navigation = useNavigation();

    return (
        <HeaderComp
            centerTitle
            title="MY BETS"
            iconColor={Colors.white}
            customStyle={styles.header}
            leftElement={
                <Pressable
                    onPress={() => navigation.goBack()}
                    hitSlop={8}
                    style={styles.iconButton}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <BackIcon />
                </Pressable>
            }
            rightElement={
                <Pressable
                    onPress={() => navigateToAlertsTab(navigation)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Notifications"
                >
                    <LinearGradient
                        colors={[...Colors.buttonSplitBorderGradient]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.notificationOuter}
                    >
                        <View style={styles.notificationInner}>
                            <MyIcons name="notification" size={moderateScale(18)} />
                            <View style={styles.notificationBadge} />
                        </View>
                    </LinearGradient>
                </Pressable>
            }
        />
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: moderateScale(4),
        marginBottom: moderateScale(4),
    },
    iconButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationOuter: {
        borderRadius: moderateScale(22),
        padding: moderateScale(1.6),
    },
    notificationInner: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(100),
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: moderateScale(4),
        borderColor: Colors.primary,
    },
    notificationBadge: {
        position: 'absolute',
        top: moderateScale(8),
        right: moderateScale(8),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.error,
        borderWidth: 1,
        borderColor: Colors.white,
    },
});

export default React.memo(MyBetsScreenHeader);
