import React from 'react';
import { View } from 'react-native';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { HOME_STATS } from '@/components/homepage/constants';
import { homeStyles } from '@/styles/homeStyles';
import { moderateScale } from '@/styles/scaling';

const STAT_ICON_SIZE = moderateScale(40);

const HomeStatsGrid = () => (
    <View style={homeStyles.statsGrid}>
        {HOME_STATS.map(item => (
            <View key={item.id} style={homeStyles.statCard}>
                <View style={homeStyles.statIconWrap}>
                    <MyIcons name={item.icon} size={STAT_ICON_SIZE} />
                </View>
                <TextComp text={item.value} style={homeStyles.statValue} />
                <TextComp text={item.label} style={homeStyles.statLabel} />
            </View>
        ))}
    </View>
);

export default HomeStatsGrid;
