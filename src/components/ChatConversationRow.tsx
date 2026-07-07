import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    I18nManager,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export type ChatListPeer = {
    _id: string;
    firstName: string;
    lastName: string;
    image?: string | null;
    localImage?: ImageSourcePropType;
    online?: boolean;
};

export type ChatMessageType = 'text' | 'voice' | 'photo' | 'reaction' | 'deleted';

export type ChatListItem = {
    _id: string;
    reciever_Id: ChatListPeer;
    sender_Id: ChatListPeer;
    lastmessage: string;
    totalunread: number;
    updatedAt: string;
    messageType: ChatMessageType;
    hasNotification?: boolean;
    isImportant?: boolean;
    hasMention?: boolean;
    isTyping?: boolean;
    isMuted?: boolean;
    showClock?: boolean;
    readReceipt?: boolean;
    /** Appended to name, e.g. "(Photographer)" */
    roleLabel?: string;
};

export interface ChatConversationRowProps {
    item: ChatListItem;
    peer: ChatListPeer;
    displayName: string;
    timeLabel: string;
    isEditMode: boolean;
    isSelected: boolean;
    onPress: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
}

function initials(first: string, last: string): string {
    const a = first?.trim()?.charAt(0) ?? '';
    const b = last?.trim()?.charAt(0) ?? '';
    return `${a}${b}`.toUpperCase() || '?';
}

const ChatConversationRow: React.FC<ChatConversationRowProps> = ({
    item,
    peer,
    displayName,
    timeLabel,
    isEditMode,
    isSelected,
    onPress,
    onLongPress,
    style,
}) => {
    const isUnread = item.totalunread > 0;
    const preview = item.isTyping ? 'Typing...' : item.lastmessage ?? '';
    const previewStyle = item.isTyping ? styles.previewTyping : isUnread ? styles.previewUnread : styles.previewRead;

    const imageSource =
        peer.localImage ?? (peer.image ? ({ uri: peer.image } as const) : null);

    return (
        <TouchableOpacity
            style={[styles.wrap, isSelected && styles.wrapSelected, style]}
            activeOpacity={0.85}
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={350}
        >
            {isEditMode ? (
                <View style={styles.checkboxCol}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxOn]}>
                        {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
                    </View>
                </View>
            ) : null}

            <View style={styles.avatarCol}>
                {imageSource ? (
                    <Image source={imageSource} style={styles.avatarImg} resizeMode="cover" />
                ) : (
                    <View
                        style={[
                            styles.avatarFallback,
                            { backgroundColor: peer.online ? Colors.success : Colors.onboardingNavy },
                        ]}
                    >
                        <TextComp text={initials(peer.firstName, peer.lastName)} style={styles.avatarInitials} />
                    </View>
                )}
                {peer.online ? <View style={styles.onlineDot} /> : null}
            </View>

            <View style={styles.body}>
                <View style={styles.topRow}>
                    <View style={styles.nameCluster}>
                        <TextComp text={displayName} style={styles.name} numberOfLines={1} />
                        {item.hasNotification ? <Text style={styles.nameGlyph}>♡</Text> : null}
                        {item.isImportant ? <Text style={styles.importantGlyph}>!</Text> : null}
                    </View>
                    <View style={styles.metaRight}>
                        {item.isMuted ? <Text style={styles.metaIcon}>🔕</Text> : null}
                        {item.showClock ? (
                            <MyIcons name="time" size={moderateScale(14)} stroke={Colors.gray400} />
                        ) : null}
                        {item.readReceipt ? <Text style={styles.readReceipt}>✓✓</Text> : null}
                        <TextComp text={timeLabel} style={isUnread ? styles.timeUnread : styles.timeRead} />
                    </View>
                </View>

                <View style={styles.bottomRow}>
                    <TextComp text={preview} style={[styles.preview, previewStyle]} numberOfLines={1} />
                    <View style={styles.badges}>
                        {item.hasMention ? (
                            <View style={styles.mentionBadge}>
                                <TextComp text="@" style={styles.mentionText} />
                            </View>
                        ) : null}
                        {isUnread ? (
                            <View style={styles.unreadBadge}>
                                <TextComp
                                    text={item.totalunread > 99 ? '99+' : String(item.totalunread)}
                                    style={styles.unreadText}
                                />
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrap: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(12),
        paddingHorizontal: spaces.medium,
        backgroundColor: Colors.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.inputBorder,
    },
    wrapSelected: {
        backgroundColor: 'rgba(92, 43, 126, 0.08)',
    },
    checkboxCol: {
        marginRight: I18nManager.isRTL ? 0 : moderateScale(10),
        marginLeft: I18nManager.isRTL ? moderateScale(10) : 0,
    },
    checkbox: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(6),
        borderWidth: 2,
        borderColor: Colors.gray300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxOn: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkMark: {
        color: Colors.white,
        fontSize: moderateScale(12),
        fontWeight: '800',
    },
    avatarCol: {
        position: 'relative',
        marginRight: I18nManager.isRTL ? 0 : moderateScale(12),
        marginLeft: I18nManager.isRTL ? moderateScale(12) : 0,
    },
    avatarImg: {
        width: moderateScale(54),
        height: moderateScale(54),
        borderRadius: moderateScale(27),
        backgroundColor: Colors.gray200,
    },
    avatarFallback: {
        width: moderateScale(54),
        height: moderateScale(54),
        borderRadius: moderateScale(27),
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        color: Colors.white,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(16),
    },
    onlineDot: {
        position: 'absolute',
        bottom: moderateScale(2),
        right: I18nManager.isRTL ? undefined : moderateScale(2),
        left: I18nManager.isRTL ? moderateScale(2) : undefined,
        width: moderateScale(12),
        height: moderateScale(12),
        borderRadius: moderateScale(6),
        backgroundColor: Colors.success,
        borderWidth: 2,
        borderColor: Colors.surface,
    },
    body: {
        flex: 1,
        minWidth: 0,
    },
    topRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: moderateScale(8),
    },
    nameCluster: {
        flex: 1,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        minWidth: 0,
    },
    name: {
        flexShrink: 1,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(15),
        color: Colors.text,
    },
    nameGlyph: {
        fontSize: moderateScale(12),
        color: Colors.gray400,
    },
    importantGlyph: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        color: Colors.error,
    },
    metaRight: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        flexShrink: 0,
    },
    metaIcon: {
        fontSize: moderateScale(12),
    },
    readReceipt: {
        fontSize: moderateScale(11),
        color: Colors.primary,
        fontWeight: '700',
    },
    timeRead: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.regular,
        color: Colors.gray400,
    },
    timeUnread: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
    bottomRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        marginTop: moderateScale(4),
        gap: moderateScale(8),
    },
    preview: {
        flex: 1,
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        minWidth: 0,
    },
    previewRead: {
        color: Colors.textSecondary,
    },
    previewUnread: {
        color: Colors.text,
        fontFamily: fontFamily.bold,
    },
    previewTyping: {
        color: Colors.success,
        fontFamily: fontFamily.bold,
    },
    badges: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    unreadBadge: {
        minWidth: moderateScale(20),
        height: moderateScale(20),
        paddingHorizontal: moderateScale(6),
        borderRadius: moderateScale(10),
        backgroundColor: Colors.error,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadText: {
        color: Colors.white,
        fontSize: moderateScale(10),
        fontFamily: fontFamily.bold,
    },
    mentionBadge: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(10),
        backgroundColor: Colors.error,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mentionText: {
        color: Colors.white,
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
    },
});

export default ChatConversationRow;
