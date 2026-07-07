import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TextComp from '@/components/TextComp';
import AuthGridOverlay from '@/screens/auth/shared/AuthGridOverlay';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { moderateScale } from '@/styles/scaling';

type TabScreenHeaderProps = {
    title: string;
    subtitle?: string;
    leadingAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    children?: React.ReactNode;
};

const TabScreenHeader: React.FC<TabScreenHeaderProps> = ({
    title,
    subtitle,
    leadingAction,
    rightAction,
    children,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[tabScreenStyles.hero, { paddingTop: insets.top + moderateScale(12) }]}>
            <View style={tabScreenStyles.heroGrid} pointerEvents="none">
                <AuthGridOverlay />
            </View>
            <View style={tabScreenStyles.heroContent}>
                {leadingAction ? (
                    <View style={{ marginBottom: moderateScale(12) }}>{leadingAction}</View>
                ) : null}
                <View style={tabScreenStyles.heroTitleRow}>
                    <View style={tabScreenStyles.heroTitleBlock}>
                        <TextComp text={title} style={tabScreenStyles.pageTitle} />
                        {subtitle ? (
                            <TextComp text={subtitle} style={tabScreenStyles.pageSubtitle} />
                        ) : null}
                    </View>
                    {rightAction ? (
                        <View style={tabScreenStyles.heroAction}>{rightAction}</View>
                    ) : null}
                </View>
                {children}
            </View>
        </View>
    );
};

export default TabScreenHeader;
