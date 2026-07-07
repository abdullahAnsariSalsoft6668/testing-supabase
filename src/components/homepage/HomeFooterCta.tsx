import React from 'react';
import { View } from 'react-native';

import AuthYellowButton from '@/screens/auth/shared/AuthYellowButton';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { homeStyles } from '@/styles/homeStyles';
import { moderateScale } from '@/styles/scaling';

type HomeFooterCtaProps = {
    onBrowseDeals?: () => void;
};

const HomeFooterCta: React.FC<HomeFooterCtaProps> = ({ onBrowseDeals }) => (
    <View style={homeStyles.footerCta}>
        <View style={homeStyles.footerIconWrap}>
            <MyIcons name="up" size={moderateScale(28)} stroke="#FFFFFF" />
        </View>
        <TextComp text="Ready to Start Saving?" style={homeStyles.footerTitle} />
        <TextComp
            text="Join 1.2M+ smart shoppers saving every week"
            style={homeStyles.footerSubtitle}
        />
        <AuthYellowButton
            title="Browse Today's Deals"
            onPress={onBrowseDeals ?? (() => {})}
        />
    </View>
);

export default HomeFooterCta;
