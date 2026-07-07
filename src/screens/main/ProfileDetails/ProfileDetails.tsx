import AppModal from '@/components/AppModal';
import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { MainStackParamList } from '@/navigation/types';
import { clearDataAction } from '@/redux/actions/auth';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './styles';

type MenuItem = {
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
};

const ProfileDetails: React.FC = () => {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();
    const insets = useSafeAreaInsets();
    const [signOutVisible, setSignOutVisible] = useState(false);

    const menuItems: MenuItem[] = useMemo(
        () => [
            {
                id: 'accountSetting',
                label: 'Account Details',
                icon: 'userSetting',
                onPress: () => navigation.navigate(routes.main.editProfile),
            },
            // {
            //     id: 'payment',
            //     label: 'Payment Details',
            //     icon: 'payment',
            //     onPress: () => navigation.navigate(routes.main.paymentMethod),
            // },
            {
                id: 'support',
                label: 'Support',
                icon: 'support',
                onPress: () => navigation.navigate(routes.main.support),
            },
        ],
        [navigation]
    );

    const confirmSignOut = useCallback(() => {
        setSignOutVisible(false);
        clearDataAction();
    }, []);

    return (
        <WrapperContainer style={styles.container}>
            <View style={styles.headerPad}>
                <HeaderComp
                    centerTitle
                    title="Settings"
                    iconColor={Colors.text}
                    leftIcon="back"
                />
            </View>

            <View style={styles.scrollOuter}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {menuItems.map((item) => (
                        <Pressable
                            key={item.id}
                            style={({ pressed }) => [styles.rowCard, pressed && { opacity: 0.94 }]}
                            onPress={item.onPress}
                        >
                            <View style={styles.rowLeft}>
                                <View style={styles.iconWrap}>
                                    <MyIcons
                                        name={item.icon}
                                        size={moderateScale(22)}
                                    />
                                </View>
                                <TextComp text={item.label} style={styles.rowTitle} />
                            </View>
                            <MyIcons name="rightChevron" size={moderateScale(16)} />
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, moderateScale(12)) }]}>
                <Pressable
                    style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.92 }]}
                    onPress={() => setSignOutVisible(true)}
                    accessibilityLabel="Sign out"
                >
                    <View style={styles.signOutSpacer} />
                    <TextComp text="SIGN OUT" style={styles.signOutLabel} />
                    <View style={styles.signOutArrowWrap}>
                        <MyIcons name="rightArrow" size={moderateScale(22)} />
                    </View>
                </Pressable>
            </View>

            <AppModal
                isVisible={signOutVisible}
                onClose={() => setSignOutVisible(false)}
                type="logout"
                title="Sign out?"
                message="Are you sure you want to sign out of your account?"
                primaryButtonText="Yes"
                secondaryButtonText="No"
                onPrimaryPress={confirmSignOut}
                onSecondaryPress={() => setSignOutVisible(false)}
            />
        </WrapperContainer>
    );
};

export default ProfileDetails;
