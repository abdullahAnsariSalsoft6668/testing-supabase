import { width as screenWidth } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import type { PanGesture } from 'react-native-gesture-handler';
import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

type AnimationType = 'scale-fade' | 'parallax' | 'stack' | 'cube';

interface CustomAnimatedCarouselProps {
    data: any[];
    renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
    width?: number;
    height?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    loop?: boolean;
    pagingEnabled?: boolean;
    snapEnabled?: boolean;
    vertical?: boolean;
    animationType?: AnimationType;
    containerStyle?: object;
    carouselStyle?: object;
    onSnapToItem?: (index: number) => void;
    scrollAnimationDuration?: number;
    /**
     * Forwarded to the carousel pan gesture. Defaults nest cleanly in a vertical ScrollView:
     * small horizontal movement claims the carousel; we intentionally do NOT use failOffsetY so
     * slight diagonal motion does not cancel the pan (that was forcing huge swipes to change slide).
     */
    onConfigurePanGesture?: (panGesture: PanGesture) => void;
}

const CustomAnimatedCarousel: React.FC<CustomAnimatedCarouselProps> = ({
    data = [],
    renderItem,
    width = screenWidth,
    height = 220,
    autoPlay = false,
    autoPlayInterval = 3000,
    loop = true,
    pagingEnabled = true,
    snapEnabled = true,
    vertical = false,
    animationType = 'scale-fade',
    containerStyle,
    carouselStyle,
    onSnapToItem,
    scrollAnimationDuration = 500,
    onConfigurePanGesture: onConfigurePanGestureProp,
}) => {
    const onConfigurePanGesture = useCallback(
        (g: PanGesture) => {
            if (onConfigurePanGestureProp) {
                onConfigurePanGestureProp(g);
                return;
            }
            if (vertical) {
                g.activeOffsetY([-3, 3]);
            } else {
                g.activeOffsetX([-3, 3]);
            }
        },
        [onConfigurePanGestureProp, vertical],
    );
    const scaleFadeAnimation = useCallback((value: number) => {
        'worklet';
        const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
        const scale = interpolate(value, [-1, 0, 1], [0.82, 1, 0.82]);
        const opacity = interpolate(value, [-1, 0, 1], [0.45, 1, 0.45]);
        return { transform: [{ scale }], zIndex, opacity };
    }, []);

    const parallaxAnimation = useCallback((value: number) => {
        'worklet';
        const translateX = interpolate(value, [-1, 0, 1], [-width * 0.25, 0, width * 0.25]);
        const opacity = interpolate(value, [-1, 0, 1], [0.5, 1, 0.5]);
        const scale = interpolate(value, [-1, 0, 1], [0.88, 1, 0.88]);
        return { transform: [{ translateX }, { scale }], opacity };
    }, [width]);

    const stackAnimation = useCallback((value: number) => {
        'worklet';
        const translateY = interpolate(value, [-1, 0, 1], [0, 0, 10]);
        const scale = interpolate(value, [-1, 0, 1], [0.9, 1, 1.04]);
        const opacity = interpolate(value, [-1, 0, 1], [0.65, 1, 0]);
        return { transform: [{ translateY }, { scale }], opacity };
    }, []);

    const cubeAnimation = useCallback((value: number) => {
        'worklet';
        const rotateY = interpolate(value, [-1, 0, 1], [-90, 0, 90]);
        const opacity = interpolate(value, [-1, 0, 1], [0, 1, 0]);
        return { transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }], opacity };
    }, []);

    const getAnimation = () => {
        switch (animationType) {
            case 'parallax':
                return parallaxAnimation;
            case 'stack':
                return stackAnimation;
            case 'cube':
                return cubeAnimation;
            case 'scale-fade':
            default:
                return scaleFadeAnimation;
        }
    };

    if (!data?.length) return null;

    return (
        <View style={[styles.container, { width, height }, containerStyle]}>
            <Carousel
                loop={loop}
                width={width}
                height={height}
                autoPlay={autoPlay}
                autoPlayInterval={autoPlayInterval}
                data={data}
                scrollAnimationDuration={scrollAnimationDuration}
                pagingEnabled={pagingEnabled}
                snapEnabled={snapEnabled}
                vertical={vertical}
                onConfigurePanGesture={onConfigurePanGesture}
                onSnapToItem={onSnapToItem}
                renderItem={renderItem}
                customAnimation={getAnimation()}
                style={[styles.carousel, { width, height }, carouselStyle]}
            />
        </View>
    );
};

export default CustomAnimatedCarousel;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    carousel: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
