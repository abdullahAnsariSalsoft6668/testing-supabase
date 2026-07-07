import { Colors } from '@/styles/colors';
import React from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

interface WrapperContainerProps extends SafeAreaViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    innerBackgroundColor?: string;
}

const WrapperContainer: React.FC<WrapperContainerProps> = ({
    children,
    style,
    innerBackgroundColor = '#FAFAFA',
    ...safeAreaProps
}) => (
    <SafeAreaView
        style={[{ backgroundColor: Colors.tabPrimary }, styles.container, style]}
        {...safeAreaProps}
    >
        <StatusBar barStyle="dark-content" />
        <View style={[styles.inner, { backgroundColor: innerBackgroundColor }]}>{children}</View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        overflow: 'hidden',
    },
});

export default React.memo(WrapperContainer);
