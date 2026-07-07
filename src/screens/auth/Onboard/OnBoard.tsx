import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
    I18nManager,
    ImageBackground,
    Pressable,
    StatusBar,
    useWindowDimensions,
    View,
} from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { AuthStackParamList } from '@/navigation/types';
import { completeOnboardingAction } from '@/redux/actions/auth';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

import AuthGridOverlay from '../shared/AuthGridOverlay';
import AuthLogo from '../shared/AuthLogo';
import OnboardingCtaButton from './OnboardingCtaButton';
import OnboardingProgressBars from './OnboardingProgressBars';
import OnboardingTextBlock from './OnboardingTextBlock';
import { ONBOARDING_SLIDES } from './onboardingSlides';
import styles from './styles';
import { useOnboardingLayout } from './useOnboardingLayout';

const OnBoard = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const layout = useOnboardingLayout({ width: windowWidth, height: windowHeight });
    const carouselRef = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { animatedStyle: skipStyle, onPressIn: skipPressIn, onPressOut: skipPressOut } =
        usePressScale();

    const activeSlide = ONBOARDING_SLIDES[activeIndex];
    const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

    const goLogin = useCallback(async () => {
        await completeOnboardingAction();
        navigation.reset({
            index: 0,
            routes: [{ name: routes.auth.login }],
        });
    }, [navigation]);

    const handleLetsGo = useCallback(() => {
        if (!isLastSlide) {
            carouselRef.current?.scrollTo({ index: activeIndex + 1, animated: true });
            return;
        }

        goLogin();
    }, [activeIndex, goLogin, isLastSlide]);

    const renderSlide = useCallback(
        ({ item }: { item: (typeof ONBOARDING_SLIDES)[number] }) => (
            <ImageBackground
                source={item.image}
                style={styles.slideImage}
                imageStyle={styles.slideImage}
                resizeMode="cover"
            />
        ),
        [],
    );

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={[styles.heroSection, { height: layout.heroHeight }]}>
                <LinearGradient
                    colors={[...theme.gradients.header]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroGradient}
                    pointerEvents="none"
                />
                <AuthGridOverlay />

                <View style={styles.carouselLayer}>
                    <Carousel
                        ref={carouselRef}
                        width={windowWidth}
                        height={layout.heroHeight}
                        data={ONBOARDING_SLIDES}
                        loop={false}
                        pagingEnabled
                        snapEnabled
                        scrollAnimationDuration={420}
                        onSnapToItem={setActiveIndex}
                        renderItem={renderSlide}
                    />
                </View>

                <LinearGradient
                    pointerEvents="none"
                    colors={['transparent', 'rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.95)']}
                    locations={[0, 0.45, 1]}
                    style={styles.heroFade}
                />

                <View
                    style={[styles.skipWrap, { paddingTop: insets.top + moderateScale(6) }]}
                    pointerEvents="box-none"
                >
                    <View style={styles.heroTopRow}>
                        <AuthLogo centered style={styles.heroLogo} />
                        <Animated.View style={skipStyle}>
                            <Pressable
                                onPress={goLogin}
                                onPressIn={skipPressIn}
                                onPressOut={skipPressOut}
                                style={styles.skipButton}
                                accessibilityRole="button"
                                accessibilityLabel="Skip onboarding"
                            >
                                <TextComp text="Skip" style={styles.skipText} />
                                <MyIcons
                                    name="rightChevron"
                                    size={moderateScale(14)}
                                    stroke={palette.neutral.white}
                                    style={I18nManager.isRTL ? styles.ctaIconRtl : undefined}
                                />
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            </View>

            <View
                style={[
                    styles.bottomCard,
                    {
                        marginTop: -layout.cardOverlap,
                        paddingHorizontal: layout.horizontalPadding,
                        paddingTop: layout.panelTopPadding,
                        paddingBottom: layout.panelBottomPadding,
                    },
                ]}
            >
                <View style={styles.bottomContent}>
                    <View style={styles.textBlock}>
                        <OnboardingTextBlock
                            slideKey={activeSlide.id}
                            title={activeSlide.title}
                            description={activeSlide.description}
                            titleSize={layout.titleSize}
                            titleLineHeight={layout.titleLineHeight}
                            descriptionSize={layout.descriptionSize}
                            descriptionLineHeight={layout.descriptionLineHeight}
                        />
                    </View>

                    <View style={styles.footerControls}>
                        <OnboardingProgressBars activeIndex={activeIndex} />
                        <OnboardingCtaButton
                            onPress={handleLetsGo}
                            height={layout.ctaHeight}
                            iconPanelWidth={layout.ctaIconWidth}
                            label={isLastSlide ? 'Get Started' : 'Next'}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default OnBoard;
