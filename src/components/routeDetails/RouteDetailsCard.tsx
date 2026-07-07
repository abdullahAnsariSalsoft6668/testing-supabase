import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type RouteDetailsCardProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};

const RouteDetailsCard: React.FC<RouteDetailsCardProps> = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(14),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
});

export default React.memo(RouteDetailsCard);
