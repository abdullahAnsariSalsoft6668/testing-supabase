import { lifeSavers, plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { I18nManager, Platform, StyleSheet } from 'react-native';

export const SUPPORT_SCREEN_BG = '#FDF8F5';
const AGENT_BUBBLE = '#E8E8EA';
const USER_PEACH = '#FFDCC8';
const USER_BLUE = '#D4E4FF';
const USER_DELETED_BLUE = '#B8CCE8';
const SEND_TAN = '#B38646';
const READ_BLUE = '#2B8CFF';
const bubbleMaxWidth = '78%';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SUPPORT_SCREEN_BG,
    },
    headerPad: {
        paddingHorizontal: spaces.medium,
    },
    headerTitle: {
        fontFamily: lifeSavers.bold,
        fontSize: moderateScale(20),
        color: Colors.text,
    },
    headerBackBtn: {
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bellWrap: {
        position: 'relative',
    },
    bellButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: moderateScale(40),
        height: moderateScale(40),
    },
    notificationDot: {
        position: 'absolute',
        top: moderateScale(6),
        right: moderateScale(6),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.error,
        borderWidth: 1.5,
        borderColor: SUPPORT_SCREEN_BG,
    },
    keyboardView: {
        flex: 1,
    },
    chatArea: {
        flex: 1,
        paddingHorizontal: spaces.medium,
    },
    flatListContent: {
        flexGrow: 1,
        paddingVertical: moderateScale(16),
    },

    dateSeparatorWrap: {
        alignItems: 'center',
        marginBottom: moderateScale(20),
    },
    datePill: {
        backgroundColor: Colors.primary,
        paddingHorizontal: moderateScale(18),
        paddingVertical: moderateScale(7),
        borderRadius: moderateScale(20),
    },
    datePillText: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },

    sentWrapper: {
        alignItems: 'flex-end',
        marginBottom: moderateScale(14),
    },
    sentBubble: {
        borderTopRightRadius: moderateScale(6),
        borderBottomRightRadius: moderateScale(6),
        borderBottomLeftRadius: moderateScale(18),
        borderTopLeftRadius: moderateScale(18),
        alignSelf: 'flex-end',
        maxWidth: bubbleMaxWidth,
        paddingBottom: moderateScale(8),
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
            },
            android: { elevation: 2 },
        }),
    },
    sentBubblePeach: {
        backgroundColor: USER_PEACH,
    },
    sentBubbleBlue: {
        backgroundColor: USER_BLUE,
    },
    sentBubbleDeleted: {
        backgroundColor: USER_DELETED_BLUE,
    },
    sentBubbleFooter: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: moderateScale(6),
        gap: moderateScale(4),
    },
    timestamp: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.regular,
        color: Colors.gray400,
    },
    readChecks: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.bold,
        color: READ_BLUE,
        letterSpacing: -2,
    },

    receivedWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: moderateScale(14),
    },
    avatarWrap: {
        marginEnd: moderateScale(10),
        marginBottom: moderateScale(4),
    },
    avatarImg: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: Colors.gray100,
    },
    receivedContent: {
        flex: 1,
        maxWidth: bubbleMaxWidth,
    },
    receivedBubble: {
        backgroundColor: AGENT_BUBBLE,
        borderTopLeftRadius: moderateScale(6),
        borderBottomLeftRadius: moderateScale(6),
        borderBottomRightRadius: moderateScale(18),
        borderTopRightRadius: moderateScale(18),
        alignSelf: 'flex-start',
        position: 'relative',
        overflow: 'visible',
        paddingBottom: moderateScale(8),
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
            },
            android: { elevation: 2 },
        }),
    },
    nameInBubble: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(4),
    },
    bubbleText: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.text,
        lineHeight: moderateScale(20),
    },
    deletedText: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        fontStyle: 'italic',
        color: Colors.gray500,
    },
    receivedBubbleFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: moderateScale(6),
    },
    timestampInBubble: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.regular,
        color: Colors.gray400,
    },
    reactionBadge: {
        position: 'absolute',
        bottom: moderateScale(-6),
        start: moderateScale(6),
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        paddingHorizontal: moderateScale(6),
        paddingVertical: moderateScale(2),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.gray100,
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
            },
            android: { elevation: 2 },
        }),
    },
    reactionEmoji: {
        fontSize: moderateScale(14),
    },
    bubble: {
        paddingHorizontal: moderateScale(14),
        paddingTop: moderateScale(10),
    },

    inputArea: {
        paddingTop: moderateScale(8),
        paddingHorizontal: spaces.medium,
        backgroundColor: SUPPORT_SCREEN_BG,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(28),
        paddingLeft: moderateScale(18),
        paddingRight: moderateScale(8),
        paddingVertical: moderateScale(8),
        minHeight: moderateScale(52),
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: { elevation: 4 },
        }),
    },
    input: {
        flex: 1,
        fontSize: moderateScale(15),
        fontFamily: fontFamily.regular,
        color: Colors.text,
        paddingVertical: moderateScale(6),
        paddingHorizontal: moderateScale(4),
        maxHeight: moderateScale(100),
    },
    sendButton: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: SEND_TAN,
        justifyContent: 'center',
        alignItems: 'center',
        marginStart: moderateScale(8),
    },
    sendGlyph: {
        color: Colors.white,
        fontSize: moderateScale(18),
        fontWeight: '700',
        transform: [{ translateX: I18nManager.isRTL ? -1 : 1 }],
    },
});
