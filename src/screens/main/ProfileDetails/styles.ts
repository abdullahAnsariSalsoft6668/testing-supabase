import { lifeSavers, plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

/** Warm cream from design */
export const SETTINGS_SCREEN_BG = '#FDF8F5';
/** Mauve / lavender icon wells */
export const SETTINGS_ICON_WELL = '#F0E6F0';
export const SETTINGS_ICON_STROKE = '#6B5B7E';
export const SIGN_OUT_TAN = '#B38646';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SETTINGS_SCREEN_BG,
    },
    headerPad: {
        paddingHorizontal: spaces.medium,
    },
    headerTitle: {
        fontFamily: lifeSavers.bold,
        fontSize: moderateScale(20),
        color: Colors.text,
    },
    headerLeftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    headerBackButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerAvatar: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        borderWidth: 2,
        borderColor: Colors.white,
        backgroundColor: Colors.gray100,
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
        borderColor: Colors.white,
    },
    scrollOuter: {
        flex: 1,
        minHeight: 0,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spaces.medium,
        paddingTop: moderateScale(8),
        paddingBottom: moderateScale(120),
    },
    rowCard: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(22),
        minHeight: moderateScale(64),
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        marginBottom: moderateScale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...{
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: moderateScale(8),
    },
    iconWrap: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: SETTINGS_ICON_WELL,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(14),
    },
    rowTitle: {
        fontFamily: lifeSavers.bold,
        fontSize: moderateScale(16),
        color: Colors.text,
        flex: 1,
    },
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: spaces.medium,
        paddingTop: moderateScale(12),
        backgroundColor: SETTINGS_SCREEN_BG,
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: SIGN_OUT_TAN,
        borderRadius: moderateScale(28),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(16),
    },
    signOutSpacer: {
        width: moderateScale(36),
    },
    signOutLabel: {
        flex: 1,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        letterSpacing: moderateScale(0.8),
        color: Colors.white,
        textAlign: 'center',
    },
    signOutArrowWrap: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontFamily: lifeSavers.bold,
        fontSize: moderateScale(18),
        color: Colors.text,
        textAlign: 'center',
        marginBottom: moderateScale(16),
    },
    modalMessage: {
        textAlign: 'center',
        marginBottom: moderateScale(20),
        color: Colors.gray500,
    },
    modalActions: {
        flexDirection: 'row',
        gap: moderateScale(10),
        width: '100%',
    },
});

export default styles;
