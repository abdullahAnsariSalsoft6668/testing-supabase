import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import SettingsItemCard from './SettingsItemCard';
import type { SettingsSection as SettingsSectionType } from './types';

type SettingsSectionProps = {
    section: SettingsSectionType;
    sectionIndex: number;
    toggleValues: Record<string, boolean>;
    onToggle: (id: string, value: boolean) => void;
    onNavigate: (screen?: string) => void;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
    section,
    sectionIndex,
    toggleValues,
    onToggle,
    onNavigate,
}) => {
    const titleStyle = useEntranceAnimation({
        baseDelay: 80 + sectionIndex * 40,
        translateY: 12,
    });

    const itemOffset = sectionIndex * 3;

    return (
        <View style={styles.wrapper}>
            <Animated.View style={titleStyle}>
                <TextComp text={section.title} style={styles.title} />
            </Animated.View>

            {section.items.map((item, index) => (
                <SettingsItemCard
                    key={item.id}
                    item={item}
                    index={itemOffset + index}
                    toggleValue={toggleValues[item.id]}
                    onToggle={onToggle}
                    onNavigate={onNavigate}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: moderateScale(8),
    },
    title: {
        fontSize: moderateScale(17),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(14),
    },
});

export default React.memo(SettingsSection);
