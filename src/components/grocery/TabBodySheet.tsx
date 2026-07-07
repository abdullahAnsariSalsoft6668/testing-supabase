import React from 'react';
import { View, ViewStyle } from 'react-native';

import { tabScreenStyles } from '@/styles/tabScreenStyles';

type TabBodySheetProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};

const TabBodySheet: React.FC<TabBodySheetProps> = ({ children, style }) => (
    <View style={[tabScreenStyles.bodySheet, style]}>{children}</View>
);

export default TabBodySheet;
