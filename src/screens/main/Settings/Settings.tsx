//import libraries
import HeaderComp from '@/components/HeaderComp';
import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { MainStackParamList } from '@/navigation/types';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import styles from './styles';

type PreferenceItem = {
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
};

// create a component
const Settings = () => {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();

    const preferenceItems: PreferenceItem[] = [
        {
            id: 'profile',
            label: 'Profile Details',
            icon: 'user',
            onPress: () => navigation.navigate(routes.main.profileDetails),
        },
        {
            id: 'appearance',
            label: 'Appearance',
            icon: 'moon',
            onPress: () => {},
        },
        {
            id: 'language',
            label: 'Language',
            icon: 'world',
            onPress: () => {},
        },
    ];

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp
                title="Settings"
                leftIcon="backBlack"
                iconColor={Colors.text}
                titleStyle={styles.headerTitle}
            />
            <View style={styles.content}>
                <TextComp text="Preferences" style={styles.sectionTitle} />
                {preferenceItems.map((item) => (
                    <Pressable key={item.id} style={styles.preferenceCard} onPress={item.onPress}>
                        <View style={styles.preferenceLeft}>
                            <View style={styles.iconWrap}>
                                <MyIcons name={item.icon} size={moderateScale(18)} stroke={Colors.gray500} />
                            </View>
                            <TextComp text={item.label} style={styles.preferenceText} />
                        </View>
                        <MyIcons name="sideArrow" size={moderateScale(14)} stroke={Colors.gray300} />
                    </Pressable>
                ))}
            </View>
        </WrapperContainer>
    );
};

export default Settings;
