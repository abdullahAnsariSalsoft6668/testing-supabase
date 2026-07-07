import { localImages } from '@/assets/images';
import HeaderComp from '@/components/HeaderComp';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { MainStackParamList } from '@/navigation/types';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { devLog } from '@/utils/logger';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './styles';

const SUPPORT_AGENT = 'Liam';
const DATE_LABEL = 'Today';

type UserBubbleTone = 'peach' | 'blue';

type MessageItem =
    | { id: string; type: 'date'; dateLabel: string }
    | {
          id: string;
          type: 'message';
          text: string;
          timestamp: string;
          from: 'user' | 'support';
          tone?: UserBubbleTone;
          deleted?: boolean;
          read?: boolean;
          reaction?: string;
      };

/** Newest first for inverted FlatList (matches ChatScreen). */
const INITIAL_MESSAGES: MessageItem[] = [
    {
        id: 'm8',
        type: 'message',
        from: 'user',
        text: 'Perfect, thank you!',
        timestamp: '10:15',
        tone: 'peach',
        read: true,
    },
    {
        id: 'm7',
        type: 'message',
        from: 'support',
        text: 'Glad I could help. Reach out anytime!',
        timestamp: '10:14',
    },
    {
        id: 'm6',
        type: 'message',
        from: 'user',
        text: 'That answers everything.',
        timestamp: '10:13',
        tone: 'blue',
        read: true,
    },
    {
        id: 'm5',
        type: 'message',
        from: 'support',
        text: 'Refunds are available within 14 days if the item is unused. I can send a link to the policy.',
        timestamp: '10:11',
        reaction: '👌',
    },
    {
        id: 'm4',
        type: 'message',
        from: 'user',
        text: 'Is there a refund policy on digital gifts?',
        timestamp: '10:10',
        tone: 'peach',
        read: true,
    },
    {
        id: 'm3',
        type: 'message',
        from: 'user',
        text: '',
        timestamp: '10:04',
        deleted: true,
        tone: 'blue',
    },
    {
        id: 'm2',
        type: 'message',
        from: 'support',
        text: "Hi there! I'm Liam from support. How can I help you today?",
        timestamp: '10:02',
    },
    {
        id: 'm1',
        type: 'message',
        from: 'user',
        text: 'Hi! I have a question about my order.',
        timestamp: '10:02',
        tone: 'blue',
        read: true,
    },
    { id: 'd1', type: 'date', dateLabel: DATE_LABEL },
];

const Support: React.FC = () => {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();
    const insets = useSafeAreaInsets();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
    const flatListRef = useRef<FlatList<MessageItem>>(null);

    const handleSend = useCallback(() => {
        const trimmed = inputText.trim();
        if (!trimmed) {
            return;
        }
        devLog('Support chat send', { len: trimmed.length });
        setMessages((prev) => {
            const userCount = prev.filter(
                (m) => m.type === 'message' && m.from === 'user' && !m.deleted
            ).length;
            const nextTone: UserBubbleTone = userCount % 2 === 0 ? 'peach' : 'blue';
            const newMessage: MessageItem = {
                id: `local-${Date.now()}`,
                type: 'message',
                text: trimmed,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                from: 'user',
                tone: nextTone,
                read: true,
            };
            return [newMessage, ...prev];
        });
        setInputText('');
        Keyboard.dismiss();
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 80);
    }, [inputText]);

    const renderItem = useCallback(({ item }: { item: MessageItem }) => {
        if (item.type === 'date') {
            return (
                <View style={styles.dateSeparatorWrap}>
                    <View style={styles.datePill}>
                        <TextComp text={item.dateLabel} style={styles.datePillText} />
                    </View>
                </View>
            );
        }

        if (item.from === 'user') {
            const toneStyle = item.deleted
                ? styles.sentBubbleDeleted
                : item.tone === 'blue'
                  ? styles.sentBubbleBlue
                  : styles.sentBubblePeach;

            return (
                <View style={styles.sentWrapper}>
                    <View style={[styles.bubble, styles.sentBubble, toneStyle]}>
                        {item.deleted ? (
                            <TextComp text="*Message was deleted.*" style={styles.deletedText} />
                        ) : (
                            <TextComp text={item.text} style={styles.bubbleText} />
                        )}
                        <View style={styles.sentBubbleFooter}>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                            {!item.deleted && item.read ? <Text style={styles.readChecks}>✓✓</Text> : null}
                        </View>
                    </View>
                </View>
            );
        }

        const showReaction = Boolean(item.reaction);

        return (
            <View style={styles.receivedWrapper}>
                <View style={styles.avatarWrap}>
                    <Image source={localImages.profileImage} style={styles.avatarImg} resizeMode="cover" />
                </View>
                <View style={styles.receivedContent}>
                    <View style={[styles.bubble, styles.receivedBubble]}>
                        <TextComp text={SUPPORT_AGENT} style={styles.nameInBubble} />
                        <TextComp text={item.text} style={styles.bubbleText} />
                        {showReaction ? (
                            <View style={styles.reactionBadge}>
                                <Text style={styles.reactionEmoji}>{item.reaction}</Text>
                            </View>
                        ) : null}
                        <View style={styles.receivedBubbleFooter}>
                            <Text style={styles.timestampInBubble}>{item.timestamp}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }, []);

    return (
        <WrapperContainer style={styles.container}>
            <View style={styles.headerPad}>
                <HeaderComp
                    centerTitle
                    title="Support"
                    iconColor={Colors.text}
                    leftIcon="back"
                    onLeftIconPress={() => navigation.goBack()}
                       
                />
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.chatArea}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(msg) => msg.id}
                        inverted
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.flatListContent}
                    />
                </View>

                <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, moderateScale(12)) }]}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a Message Here..."
                            placeholderTextColor={Colors.gray300}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={2000}
                            onSubmitEditing={handleSend}
                            blurOnSubmit={false}
                        />
                        <Pressable
                            style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.88 }]}
                            onPress={handleSend}
                            accessibilityLabel="Send message"
                        >
                            <Text style={styles.sendGlyph}>➤</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </WrapperContainer>
    );
};

export default React.memo(Support);
