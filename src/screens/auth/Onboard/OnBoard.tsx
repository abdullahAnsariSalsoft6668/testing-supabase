import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import { StatusBar, useWindowDimensions, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AuthStackParamList } from '@/navigation/types';
import { completeOnboardingAction } from '@/redux/actions/auth';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';

import OnboardingCtaButton from './OnboardingCtaButton';
import OnboardingIllustration from './OnboardingIllustration';
import OnboardingProgressBars from './OnboardingProgressBars';
import OnboardingSkipButton from './OnboardingSkipButton';
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

    const activeSlide = ONBOARDING_SLIDES[activeIndex];
    const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;
    const cardWidth = windowWidth - moderateScale(40);

    const goLogin = useCallback(async () => {
        await completeOnboardingAction();
        navigation.reset({
            index: 0,
            routes: [{ name: routes.auth.login }],
        });
    }, [navigation]);

    const handleNext = useCallback(() => {
        if (!isLastSlide) {
            carouselRef.current?.scrollTo({ index: activeIndex + 1, animated: true });
            return;
        }
        goLogin();
    }, [activeIndex, goLogin, isLastSlide]);

    const renderSlide = useCallback(
        ({ item }: { item: (typeof ONBOARDING_SLIDES)[number] }) => (
            <View style={[styles.slideCard, { width: cardWidth }]}>
                <View style={styles.illustrationArea}>
                    <OnboardingIllustration role={item.role} />
                </View>
            </View>
        ),
        [cardWidth],
    );

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={[palette.teal.dark, palette.teal.main, palette.teal.light]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBg}
            />

            <View
                style={[
                    styles.screenBody,
                    {
                        paddingTop: insets.top + moderateScale(12),
                        paddingBottom: insets.bottom + moderateScale(8),
                    },
                ]}
            >
                <View style={styles.topBar}>
                    <View style={styles.brandWrap}>
                        <TextComp text="HealthCare" style={styles.brandTitle} />
                        <TextComp text="Hospital Management" style={styles.brandSubtitle} />
                    </View>
                    <OnboardingSkipButton onPress={goLogin} />
                </View>

                <View style={[styles.mainCard, { width: cardWidth, alignSelf: 'center' }]}>
                    <Carousel
                        ref={carouselRef}
                        width={cardWidth}
                        height={windowHeight * 0.42}
                        data={ONBOARDING_SLIDES}
                        loop={false}
                        pagingEnabled
                        snapEnabled
                        scrollAnimationDuration={450}
                        onSnapToItem={setActiveIndex}
                        renderItem={renderSlide}
                    />

                    <View style={styles.cardContent}>
                        <OnboardingTextBlock
                            slideKey={activeSlide.id}
                            role={activeSlide.role}
                            title={activeSlide.title}
                            description={activeSlide.description}
                            titleSize={layout.titleSize}
                            titleLineHeight={layout.titleLineHeight}
                            descriptionSize={layout.descriptionSize}
                        />

                        <View style={styles.footerControls}>
                            <OnboardingProgressBars activeIndex={activeIndex} />
                            <OnboardingCtaButton
                                onPress={handleNext}
                                height={layout.ctaHeight}
                                label={isLastSlide ? 'Get Started' : 'Next'}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default OnBoard;
