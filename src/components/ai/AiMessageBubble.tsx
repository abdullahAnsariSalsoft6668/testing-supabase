import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import type { AiChatRole } from '@/types/aiAssistant';

type AiMessageBubbleProps = {
    role: AiChatRole;
    text: string;
};

const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({ role, text }) => {
    const isUser = role === 'user';

    return (
        <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
            <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                <TextComp text={text} style={[styles.text, isUser ? styles.textUser : styles.textAssistant]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: { marginBottom: moderateScale(10), flexDirection: 'row' },
    rowUser: { justifyContent: 'flex-end' },
    rowAssistant: { justifyContent: 'flex-start' },
    bubble: {
        maxWidth: '82%',
        borderRadius: moderateScale(16),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(10),
    },
    bubbleUser: {
        backgroundColor: theme.palette.teal.main,
        borderBottomRightRadius: moderateScale(4),
    },
    bubbleAssistant: {
        backgroundColor: theme.colors.card.background,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderBottomLeftRadius: moderateScale(4),
    },
    text: { fontSize: moderateScale(14), lineHeight: moderateScale(20) },
    textUser: { color: theme.colors.text.inverse },
    textAssistant: { color: theme.colors.text.primary },
});

export default AiMessageBubble;
