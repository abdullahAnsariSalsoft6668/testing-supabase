import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import TextComp from './TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

interface FAQItemProps {
    question: string;
    answer: string;
    isExpanded: boolean;
    onPress: () => void;
}

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d={expanded ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}
            stroke={Colors.gray400}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isExpanded, onPress }) => (
    <View style={styles.card}>
        <Pressable style={styles.header} onPress={onPress}>
            <TextComp text={question} style={styles.question} />
            <ChevronIcon expanded={isExpanded} />
        </Pressable>
        {isExpanded ? <TextComp text={answer} style={styles.answer} /> : null}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: moderateScale(12),
    },
    question: {
        flex: 1,
        fontSize: moderateScale(15),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
    answer: {
        marginTop: moderateScale(12),
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.gray600,
        lineHeight: moderateScale(20),
    },
});

export default React.memo(FAQItem);
