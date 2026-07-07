import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const MyProfile: React.FC = () => {
    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="MyProfile" />
            <View style={styles.content}>
                <TextComp text="Welcome to MyProfile" />
            </View>
        </WrapperContainer>
    );
};

export default MyProfile;
