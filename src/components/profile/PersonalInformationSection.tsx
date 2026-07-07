import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { PROFILE_ICON_COLOR } from './constants';
import ProfileInfoCard from './ProfileInfoCard';
import type { ProfileInfoItem } from './types';

type PersonalInformationSectionProps = {
    items: ProfileInfoItem[];
};

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({ items }) => {
    const titleStyle = useEntranceAnimation({ baseDelay: 80, translateY: 14 });

    return (
        <View style={styles.section}>
            <Animated.View style={titleStyle}>
                <TextComp text="Personal Information" style={styles.title} />
            </Animated.View>

            {items.map((item, index) => (
                <ProfileInfoCard key={item.id} item={item} index={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(18),
        fontFamily: plusJakarta.bold,
        color: PROFILE_ICON_COLOR,
        marginBottom: moderateScale(16),
    },
});

export default React.memo(PersonalInformationSection);
