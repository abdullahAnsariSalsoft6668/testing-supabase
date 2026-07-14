import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AiMessageBubble from '@/components/ai/AiMessageBubble';
import { HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { useAiAssistant } from '@/hooks/useAiAssistant';
import type { AuthUserProfile } from '@/models/auth.types';
import { PatientStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

const AiChatScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const insets = useSafeAreaInsets();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const patientId = user?.patient_id ?? user?.patient?.id;
    const firstName = user?.full_name?.split(' ')[0];
    const scrollRef = useRef<ScrollView>(null);
    const [input, setInput] = useState('');

    const { messages, loading, quickPrompts, initGreeting, sendMessage } = useAiAssistant(patientId, firstName);

    useEffect(() => {
        initGreeting();
    }, [initGreeting]);

    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [messages, loading]);

    const handleSend = async (text?: string) => {
        const value = (text ?? input).trim();
        if (!value) return;
        if (!patientId) {
            Toast.show({ type: 'error', text1: 'Patient profile required' });
            return;
        }
        setInput('');
        const res = await sendMessage(value);
        if (res?.bookedAppointmentId) {
            Toast.show({ type: 'success', text1: 'Appointment booked', text2: 'See My Visits for details.' });
        }
    };

    return (
        <View style={styles.screen}>
            <HealthScreenHeader
                title="AI Chat"
                subtitle="Book visits & ask health admin questions"
                onBack={() => navigation.goBack()}
                rightAction={
                    <Pressable style={styles.voiceLink} onPress={() => navigation.navigate(routes.patient.aiVoiceCall)}>
                        <MyIcons name="callBlue" size={18} stroke={theme.colors.text.inverse} />
                    </Pressable>
                }
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={moderateScale(8)}
            >
                <ScrollView
                    ref={scrollRef}
                    style={styles.flex}
                    contentContainerStyle={styles.messages}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {messages.map((m) => (
                        <AiMessageBubble key={m.id} role={m.role} text={m.text} />
                    ))}
                    {loading ? (
                        <View style={styles.typingRow}>
                            <ActivityIndicator size="small" color={theme.palette.teal.main} />
                            <TextComp text="Assistant is typing…" style={styles.typingText} />
                        </View>
                    ) : null}
                </ScrollView>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                    keyboardShouldPersistTaps="handled"
                >
                    {quickPrompts.map((prompt) => (
                        <Pressable
                            key={prompt}
                            style={styles.chip}
                            onPress={() => handleSend(prompt)}
                            disabled={loading}
                        >
                            <TextComp text={prompt} style={styles.chipText} />
                        </Pressable>
                    ))}
                </ScrollView>

                <View style={[styles.inputBar, { paddingBottom: insets.bottom + moderateScale(10) }]}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type your message…"
                        placeholderTextColor={theme.colors.text.muted}
                        multiline
                        maxLength={500}
                        editable={!loading}
                    />
                    <Pressable
                        style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
                        onPress={() => handleSend()}
                        disabled={!input.trim() || loading}
                    >
                        <MyIcons name="buttonEnter" size={20} stroke={theme.colors.text.inverse} />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
    flex: { flex: 1 },
    voiceLink: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messages: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(12),
    },
    typingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        paddingVertical: moderateScale(8),
    },
    typingText: { fontSize: moderateScale(12), color: theme.colors.text.secondary },
    chips: {
        gap: moderateScale(8),
        paddingHorizontal: moderateScale(16),
        paddingBottom: moderateScale(8),
    },
    chip: {
        backgroundColor: theme.palette.teal.surface,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    chipText: { fontSize: moderateScale(12), fontWeight: '600', color: theme.palette.teal.main },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(10),
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.default,
        backgroundColor: theme.colors.card.background,
    },
    input: {
        flex: 1,
        minHeight: moderateScale(44),
        maxHeight: moderateScale(100),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: moderateScale(22),
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(10),
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.background.secondary,
    },
    sendBtn: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(22),
        backgroundColor: theme.palette.teal.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: { opacity: 0.45 },
});

export default AiChatScreen;
