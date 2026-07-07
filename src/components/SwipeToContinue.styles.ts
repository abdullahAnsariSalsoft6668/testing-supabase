import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { StyleSheet } from 'react-native';

const SLIDER_TRACK_HEIGHT = moderateScale(56);
const SLIDER_THUMB_SIZE = moderateScale(56);

const styles = StyleSheet.create({
    sliderLabel: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: Colors.white,
        textAlign: 'center',
        marginTop: moderateScale(10),
    },
    sliderTrack: {
        height: SLIDER_TRACK_HEIGHT,
        borderRadius: SLIDER_TRACK_HEIGHT / 2,
        backgroundColor: Colors.onboardingGlass,
        borderWidth: 1,
        borderColor: Colors.onboardingGlassBorder,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    sliderThumb: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: moderateScale(120),
        height: SLIDER_THUMB_SIZE,
        borderRadius: SLIDER_THUMB_SIZE / 2,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    sliderThumbText: {
        fontSize: moderateScale(15),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    sliderChevrons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SLIDER_THUMB_SIZE + moderateScale(8),
    },
    sliderCheckWrap: {
        position: 'absolute',
        right: moderateScale(8),
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: 20,
        backgroundColor: Colors.onboardingDotInactive,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderCheckMark: {
        fontSize: moderateScale(18),
        color: Colors.white,
        fontWeight: '700',
    },
});

export default styles;
export { SLIDER_TRACK_HEIGHT, SLIDER_THUMB_SIZE };
