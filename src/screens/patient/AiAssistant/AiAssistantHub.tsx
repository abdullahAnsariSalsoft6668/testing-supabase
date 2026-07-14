import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { PatientStackParamList } from '@/navigation/types';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

const AiAssistantHub = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const insets = useSafeAreaInsets();

    const options = [
        {
            key: 'voice',
            title: 'Talk to AI',
            subtitle: 'Voice call — speak to book appointments',
            icon: 'callBlue' as const,
            route: routes.patient.aiVoiceCall,
            accent: theme.palette.sky.accent,
            surface: theme.palette.sky.main,
        },
        {
            key: 'chat',
            title: 'Chat with AI',
            subtitle: 'Type to book appointments and ask questions',
            icon: 'messageBlue' as const,
            route: routes.patient.aiChat,
            accent: theme.palette.teal.main,
            surface: theme.palette.teal.surface,
        },
    ];

    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={[...theme.gradients.header]}
                style={[styles.hero, { paddingTop: insets.top + moderateScale(16) }]}
            >
                <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <View style={styles.backIcon}>
                        <MyIcons name="arrowChevron" size={16} stroke={theme.colors.text.inverse} />
                    </View>
                    <TextComp text="Back" style={styles.backText} />
                </Pressable>

                <View style={styles.heroBody}>
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <MyIcons name="healthTabUser" size={32} stroke={theme.palette.teal.main} />
                        </View>
                        <View style={styles.onlineDot} />
                    </View>
                    <TextComp text="AI Health Assistant" style={styles.heroTitle} />
                    <TextComp
                        text="Book appointments, check visits, and get help — by chat or voice."
                        style={styles.heroSub}
                    />
                    <View style={styles.alphaBadge}>
                        <TextComp text="ALPHA" style={styles.alphaText} />
                    </View>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                <TextComp text="Choose how to connect" style={styles.sectionTitle} />

                {options.map((opt) => (
                    <Pressable
                        key={opt.key}
                        style={styles.optionCard}
                        onPress={() => navigation.navigate(opt.route)}
                    >
                        <View style={[styles.optionIcon, { backgroundColor: opt.surface }]}>
                            <MyIcons name={opt.icon} size={24} stroke={opt.accent} />
                        </View>
                        <View style={styles.optionText}>
                            <TextComp text={opt.title} style={styles.optionTitle} />
                            <TextComp text={opt.subtitle} style={styles.optionSub} />
                        </View>
                        <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.muted} />
                    </Pressable>
                ))}

                <View style={styles.tipCard}>
                    <MyIcons name="healthTabHome" size={18} stroke={theme.palette.teal.main} />
                    <TextComp
                        text="Alpha assistant runs in the app and uses your Supabase doctors, slots, and appointments."
                        style={styles.tipText}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
    hero: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(28),
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(8), marginBottom: moderateScale(16) },
    backIcon: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(10),
        backgroundColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: { color: theme.colors.text.inverse, fontSize: moderateScale(14), fontWeight: '600' },
    heroBody: { alignItems: 'center' },
    avatarRing: { position: 'relative', marginBottom: moderateScale(14) },
    avatar: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(36),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    onlineDot: {
        position: 'absolute',
        right: moderateScale(4),
        bottom: moderateScale(4),
        width: moderateScale(14),
        height: moderateScale(14),
        borderRadius: moderateScale(7),
        backgroundColor: theme.palette.green.main,
        borderWidth: 2,
        borderColor: theme.colors.card.background,
    },
    heroTitle: {
        fontSize: moderateScale(22),
        fontWeight: '800',
        color: theme.colors.text.inverse,
        textAlign: 'center',
    },
    heroSub: {
        fontSize: moderateScale(13),
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginTop: moderateScale(8),
        lineHeight: moderateScale(19),
        paddingHorizontal: moderateScale(12),
    },
    alphaBadge: {
        marginTop: moderateScale(12),
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
    },
    alphaText: {
        fontSize: moderateScale(10),
        fontWeight: '800',
        color: theme.colors.text.inverse,
        letterSpacing: 1,
    },
    body: {
        padding: moderateScale(16),
        paddingBottom: moderateScale(40),
        gap: moderateScale(12),
    },
    sectionTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: moderateScale(4),
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(14),
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    optionIcon: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: { flex: 1 },
    optionTitle: { fontSize: moderateScale(16), fontWeight: '700', color: theme.colors.text.primary },
    optionSub: { fontSize: moderateScale(12), color: theme.colors.text.secondary, marginTop: moderateScale(4) },
    tipCard: {
        flexDirection: 'row',
        gap: moderateScale(10),
        backgroundColor: theme.palette.teal.surface,
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
        marginTop: moderateScale(8),
    },
    tipText: { flex: 1, fontSize: moderateScale(12), color: theme.palette.teal.dark, lineHeight: moderateScale(18) },
});

export default AiAssistantHub;
