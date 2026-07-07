import React, { useCallback, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import type { HelpFaqQuestion } from './constants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FaqAccordionItemProps = {
    item: HelpFaqQuestion;
    isExpanded: boolean;
    onToggle: () => void;
    showDivider?: boolean;
};

const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
    item,
    isExpanded,
    onToggle,
    showDivider = true,
}) => (
    <>
        <Pressable
            onPress={onToggle}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            accessibilityRole="button"
            accessibilityState={{ expanded: isExpanded }}
        >
            <TextComp text={item.question} style={styles.question} />
            <View style={[styles.chevronWrap, isExpanded && styles.chevronExpanded]}>
                <MyIcons name="arrowChevron" size={moderateScale(14)} stroke={palette.neutral.textMuted} />
            </View>
        </Pressable>
        {isExpanded ? <TextComp text={item.answer} style={styles.answer} /> : null}
        {showDivider ? <View style={styles.divider} /> : null}
    </>
);

type FaqAccordionListProps = {
    questions: HelpFaqQuestion[];
};

export const FaqAccordionList: React.FC<FaqAccordionListProps> = ({ questions }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggle = useCallback((id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(current => (current === id ? null : id));
    }, []);

    return (
        <View>
            {questions.map((item, index) => (
                <FaqAccordionItem
                    key={item.id}
                    item={item}
                    isExpanded={expandedId === item.id}
                    onToggle={() => handleToggle(item.id)}
                    showDivider={index < questions.length - 1}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(14),
    },
    rowPressed: {
        opacity: 0.75,
    },
    question: {
        flex: 1,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        color: theme.colors.text.primary,
        paddingRight: spaces.small,
    },
    chevronWrap: {
        transform: [{ rotate: '0deg' }],
    },
    chevronExpanded: {
        transform: [{ rotate: '180deg' }],
    },
    answer: {
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: theme.colors.text.secondary,
        paddingBottom: moderateScale(12),
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: palette.neutral.gray100,
    },
});

export default FaqAccordionItem;
