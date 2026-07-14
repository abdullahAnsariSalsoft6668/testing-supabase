import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    PermissionsAndroid,
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

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { useAiAssistant } from '@/hooks/useAiAssistant';
import { useRetellNativeCall } from '@/hooks/useRetellNativeCall';
import type { AuthUserProfile } from '@/models/auth.types';
import { PatientStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import {
    createVoiceSession,
    isVoiceSessionEnabled,
    type VoiceSession,
} from '@/services/retellCallService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

type CallPhase = 'connecting' | 'ready' | 'listening' | 'thinking' | 'speaking' | 'live';
type CallMode = 'retell' | 'alpha';

const PHASE_LABELS: Record<CallPhase, string> = {
    connecting: 'Connecting…',
    ready: 'Ready',
    listening: 'Listening…',
    thinking: 'Thinking…',
    speaking: 'Assistant speaking…',
    live: 'Live voice call',
};

const AiVoiceCallScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const insets = useSafeAreaInsets();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const accessToken = useSelector((s) => s.auth.auth_token);
    const patientId = user?.patient_id ?? user?.patient?.id;
    const firstName = user?.full_name?.split(' ')[0];
    const voiceEnabled = isVoiceSessionEnabled();

    const [mode, setMode] = useState<CallMode>(voiceEnabled ? 'retell' : 'alpha');
    const [phase, setPhase] = useState<CallPhase>('connecting');
    const [elapsed, setElapsed] = useState(0);
    const [input, setInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
    const [retellLines, setRetellLines] = useState<{ id: string; role: 'user' | 'assistant'; text: string }[]>([]);
    const pulse = useRef(new Animated.Value(1)).current;
    const scrollRef = useRef<ScrollView>(null);
    const retellStarted = useRef(false);

    const { messages, loading, initGreeting, sendMessage } = useAiAssistant(patientId, firstName);

    const { stopCall: stopRetellCall } = useRetellNativeCall(
        mode === 'retell' ? voiceSession?.accessToken : undefined,
        {
            onCallStarted: () => {
                setPhase('live');
                setRetellLines([
                    {
                        id: 'retell-start',
                        role: 'assistant',
                        text: 'Connected. Tell me how I can help with your health visit.',
                    },
                ]);
            },
            onCallEnded: () => setPhase('ready'),
            onAgentSpeaking: (speaking) => setPhase(speaking ? 'speaking' : 'live'),
            onTranscriptUpdate: (lines) => {
                setRetellLines(
                    lines.map((line, idx) => ({
                        id: `retell-${idx}-${line.role}`,
                        role: line.role,
                        text: line.text,
                    })),
                );
            },
            onError: (message) => {
                Toast.show({ type: 'error', text1: 'Voice call failed', text2: message });
                setMode('alpha');
                setVoiceSession(null);
                initGreeting();
                setPhase('ready');
            },
        },
    );

    const startVoiceCall = useCallback(async () => {
        if (!patientId || !accessToken || retellStarted.current) return;
        retellStarted.current = true;
        setPhase('connecting');

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Toast.show({ type: 'error', text1: 'Microphone permission required' });
                setMode('alpha');
                initGreeting();
                setPhase('ready');
                return;
            }
        }

        const session = await createVoiceSession({
            patientId,
            firstName,
            accessToken,
        });

        if (session?.accessToken) {
            setVoiceSession(session);
            setMode('retell');
            return;
        }

        Toast.show({
            type: 'error',
            text1: 'Voice session failed',
            text2: 'Check Node backend and yarn node:reverse',
        });
        setMode('alpha');
        initGreeting();
        setTimeout(() => setPhase('ready'), 600);
    }, [accessToken, firstName, initGreeting, patientId]);

    useEffect(() => {
        if (mode === 'retell' && voiceEnabled) {
            void startVoiceCall();
            return;
        }
        initGreeting();
        const t = setTimeout(() => setPhase('ready'), 400);
        return () => clearTimeout(t);
    }, [initGreeting, mode, startVoiceCall, voiceEnabled]);

    useEffect(() => {
        if (phase === 'connecting' || phase === 'ready') return;
        const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(timer);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'listening' && phase !== 'speaking' && phase !== 'live') {
            pulse.setValue(1);
            return;
        }
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
            ]),
        );
        anim.start();
        return () => anim.stop();
    }, [phase, pulse]);

    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [messages, retellLines]);

    useEffect(() => {
        if (mode !== 'alpha') return;
        if (loading) setPhase('thinking');
        else if (phase === 'thinking') setPhase('ready');
    }, [loading, mode, phase]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const handleMicPress = () => {
        if (!patientId) {
            Toast.show({ type: 'error', text1: 'Patient profile required' });
            return;
        }
        if (mode === 'retell') {
            Toast.show({ type: 'info', text1: 'Speak naturally', text2: 'Live voice call is active' });
            setPhase('live');
            return;
        }
        setShowInput(true);
        setPhase('listening');
    };

    const handleSubmitSpeech = async () => {
        const value = input.trim();
        if (!value || loading) return;
        setInput('');
        setShowInput(false);
        setPhase('thinking');
        const res = await sendMessage(value);
        if (res?.bookedAppointmentId) {
            Toast.show({ type: 'success', text1: 'Appointment booked' });
        }
        setPhase('ready');
    };

    const handleEndCall = () => {
        if (mode === 'retell') {
            stopRetellCall();
        }
        navigation.goBack();
    };

    const alphaTranscript = messages.filter((m) => m.role !== 'system');
    const transcript =
        mode === 'retell'
            ? retellLines
            : alphaTranscript.map((m) => ({
                  id: m.id,
                  role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
                  text: m.text,
              }));

    const subtitle =
        mode === 'retell' && voiceSession
            ? 'WebRTC · Retell voice → Supabase tools'
            : 'Text fallback · Type to test booking';

    const phaseLabel =
        mode === 'alpha' && phase === 'ready'
            ? 'Tap button to type'
            : mode === 'alpha' && phase === 'listening'
              ? 'Type your message…'
              : PHASE_LABELS[phase];

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.topBar}>
                <Pressable onPress={handleEndCall} style={styles.endBtn}>
                    <MyIcons name="healthTabClose" size={16} stroke={theme.palette.status.error} />
                    <TextComp text="End" style={styles.endText} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate(routes.patient.aiChat)}>
                    <TextComp text="Switch to chat" style={styles.chatLink} />
                </Pressable>
            </View>

            <View style={styles.callBody}>
                <TextComp text={phaseLabel} style={styles.phaseLabel} />
                <TextComp text={formatTime(elapsed)} style={styles.timer} />

                <Animated.View style={[styles.avatarWrap, { transform: [{ scale: pulse }] }]}>
                    <View style={styles.avatar}>
                        <MyIcons name="healthTabUser" size={40} stroke={theme.palette.teal.main} />
                    </View>
                </Animated.View>

                <TextComp text="AI Health Assistant" style={styles.assistantName} />
                <TextComp text={subtitle} style={styles.assistantSub} />

                <ScrollView
                    ref={scrollRef}
                    style={styles.transcript}
                    contentContainerStyle={styles.transcriptContent}
                    showsVerticalScrollIndicator={false}
                >
                    {phase === 'connecting' && mode === 'retell' ? (
                        <ActivityIndicator color={theme.palette.teal.main} />
                    ) : null}
                    {transcript.length === 0 ? (
                        <TextComp text="Your conversation will appear here…" style={styles.transcriptPlaceholder} />
                    ) : (
                        transcript.slice(-6).map((m) => (
                            <View key={m.id} style={styles.transcriptLine}>
                                <TextComp
                                    text={m.role === 'user' ? 'You' : 'AI'}
                                    style={[styles.transcriptWho, m.role === 'user' && styles.transcriptWhoUser]}
                                />
                                <TextComp text={m.text} style={styles.transcriptText} />
                            </View>
                        ))
                    )}
                    {loading && mode === 'alpha' ? (
                        <ActivityIndicator color={theme.palette.teal.main} style={{ marginTop: 8 }} />
                    ) : null}
                </ScrollView>
            </View>

            {showInput && mode === 'alpha' ? (
                <View style={[styles.inputDock, { paddingBottom: insets.bottom + moderateScale(12) }]}>
                    <TextInput
                        style={styles.voiceInput}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type your message…"
                        placeholderTextColor={theme.colors.text.muted}
                        autoFocus
                        multiline
                    />
                    <Pressable
                        style={[styles.sendVoice, !input.trim() && styles.sendVoiceDisabled]}
                        onPress={handleSubmitSpeech}
                        disabled={!input.trim() || loading}
                    >
                        <MyIcons name="buttonEnter" size={18} stroke={theme.colors.text.inverse} />
                    </Pressable>
                </View>
            ) : (
                <View style={[styles.controls, { paddingBottom: insets.bottom + moderateScale(20) }]}>
                    <Pressable style={styles.micBtn} onPress={handleMicPress} disabled={loading}>
                        <MyIcons name="callBlue" size={28} stroke={theme.colors.text.inverse} />
                    </Pressable>
                    <TextComp
                        text={mode === 'retell' ? 'Live call — speak now' : 'Tap to type a message'}
                        style={styles.micHint}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0A3D47',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(12),
    },
    endBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(20),
    },
    endText: { color: theme.palette.status.error, fontWeight: '600', fontSize: moderateScale(13) },
    chatLink: { color: 'rgba(255,255,255,0.85)', fontSize: moderateScale(13), fontWeight: '600' },
    callBody: { flex: 1, alignItems: 'center', paddingHorizontal: moderateScale(20) },
    phaseLabel: {
        fontSize: moderateScale(13),
        color: 'rgba(255,255,255,0.75)',
        marginTop: moderateScale(8),
    },
    timer: {
        fontSize: moderateScale(28),
        fontWeight: '300',
        color: theme.colors.text.inverse,
        marginTop: moderateScale(4),
        fontVariant: ['tabular-nums'],
    },
    avatarWrap: { marginTop: moderateScale(28), marginBottom: moderateScale(16) },
    avatar: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: theme.palette.teal.main,
    },
    assistantName: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: theme.colors.text.inverse,
    },
    assistantSub: {
        fontSize: moderateScale(12),
        color: 'rgba(255,255,255,0.65)',
        marginTop: moderateScale(4),
    },
    transcript: {
        width: '100%',
        marginTop: moderateScale(24),
        maxHeight: moderateScale(200),
    },
    transcriptContent: { gap: moderateScale(10), paddingBottom: moderateScale(8) },
    transcriptPlaceholder: {
        fontSize: moderateScale(13),
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
    },
    transcriptLine: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: moderateScale(12),
        padding: moderateScale(10),
    },
    transcriptWho: {
        fontSize: moderateScale(10),
        fontWeight: '700',
        color: theme.palette.teal.main,
        textTransform: 'uppercase',
        marginBottom: moderateScale(4),
    },
    transcriptWhoUser: { color: 'rgba(255,255,255,0.7)' },
    transcriptText: { fontSize: moderateScale(13), color: theme.colors.text.inverse, lineHeight: moderateScale(18) },
    controls: { alignItems: 'center', gap: moderateScale(10) },
    micBtn: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(36),
        backgroundColor: theme.palette.teal.main,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.card,
    },
    micHint: { fontSize: moderateScale(12), color: 'rgba(255,255,255,0.7)' },
    inputDock: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(12),
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    voiceInput: {
        flex: 1,
        minHeight: moderateScale(44),
        maxHeight: moderateScale(80),
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(10),
        backgroundColor: theme.colors.card.background,
        color: theme.colors.text.primary,
        fontSize: moderateScale(14),
    },
    sendVoice: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(22),
        backgroundColor: theme.palette.teal.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendVoiceDisabled: { opacity: 0.4 },
});

export default AiVoiceCallScreen;
