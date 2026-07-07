import TextInputComp from '@/components/TextInputComp';
import React from 'react';
import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

import AuthStaggerItem from './AuthStaggerItem';

type AuthTextInputProps = TextInputProps & {
    index: number;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    error?: boolean | string;
    touched?: boolean;
    label?: string;
    required?: boolean;
    labelStyle?: TextStyle;
    inputContainerStyle?: ViewStyle;
    isPassword?: boolean;
};

const AuthTextInput: React.FC<AuthTextInputProps> = ({ index, ...props }) => (
    <AuthStaggerItem index={index}>
        <TextInputComp enableFocusAnimation {...props} />
    </AuthStaggerItem>
);

export default AuthTextInput;
