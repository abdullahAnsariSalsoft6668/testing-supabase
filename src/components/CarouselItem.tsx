import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TextComp from './TextComp';

type CarouselType = 'default' | 'banner' | 'medication' | 'doctor' | 'product';

interface CarouselItemProps {
    item: any;
    index: number;
    type?: CarouselType;
    onPress?: (item: any, index: number) => void;
    width?: number;
    height?: number;
    showGradient?: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
    item,
    index,
    type = 'default',
    onPress,
    width = moderateScale(300),
    height = moderateScale(210),
    showGradient = false,
}) => {
    const handlePress = () => onPress?.(item, index);

    if (type === 'product') {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity style={[styles.productCard, { width, height }]} onPress={handlePress} activeOpacity={0.9}>
                    <View style={styles.productDualImageWrap}>
                        <Image source={item?.image} style={styles.productMainImage} resizeMode="contain" />
                        <Image source={item?.secondaryImage ?? item?.image} style={styles.productSideImage} resizeMode="contain" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    if (type === 'banner') {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity style={[styles.bannerContainer, { width, height }]} onPress={handlePress} activeOpacity={0.9}>
                    <Image source={item?.image} style={styles.bannerImage} resizeMode="cover" />
                    {showGradient ? (
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.gradient}>
                            <View style={styles.bannerContent}>
                                {item?.title ? <TextComp text={item.title} style={styles.bannerTitle} /> : null}
                                {item?.subtitle ? <TextComp text={item.subtitle} style={styles.bannerSubtitle} /> : null}
                            </View>
                        </LinearGradient>
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    }

    if (type === 'medication') {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity style={[styles.defaultCard, { width, height }]} onPress={handlePress} activeOpacity={0.9}>
                    <TextComp text={item?.name ?? 'Medication'} style={styles.defaultTitle} />
                    <TextComp text={item?.dosage ?? 'Dosage info'} style={styles.defaultDescription} />
                </TouchableOpacity>
            </View>
        );
    }

    if (type === 'doctor') {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity style={[styles.defaultCard, { width, height }]} onPress={handlePress} activeOpacity={0.9}>
                    <Image source={item?.image} style={styles.doctorImage} resizeMode="cover" />
                    <TextComp text={item?.name ?? 'Doctor Name'} style={styles.defaultTitle} />
                    <TextComp text={item?.specialty ?? 'Specialty'} style={styles.defaultDescription} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={[styles.defaultCard, { width, height }]} onPress={handlePress} activeOpacity={0.9}>
                <View style={styles.defaultContent}>
                    <TextComp text={item?.title ?? `Item ${index + 1}`} style={styles.defaultTitle} />
                    {item?.description ? <TextComp text={item.description} style={styles.defaultDescription} /> : null}
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default CarouselItem;

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: {
        borderRadius: moderateScale(16),
        overflow: 'hidden',
        backgroundColor: Colors.white,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        justifyContent: 'flex-end',
    },
    bannerContent: {
        padding: moderateScale(14),
    },
    bannerTitle: {
        marginBottom: moderateScale(4),
        color: Colors.white,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(18),
    },
    bannerSubtitle: {
        color: Colors.white,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        opacity: 0.9,
    },
    productCard: {
        justifyContent: 'center',
    },
    productDualImageWrap: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: moderateScale(8),
    },
    productMainImage: {
        width: moderateScale(150),
        height: moderateScale(190),
    },
    productSideImage: {
        width: moderateScale(96),
        height: moderateScale(150),
    },
    defaultCard: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    defaultContent: {
        alignItems: 'center',
    },
    defaultTitle: {
        marginBottom: moderateScale(8),
        textAlign: 'center',
        color: Colors.text,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(18),
    },
    defaultDescription: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
    },
    doctorImage: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(35),
        marginBottom: moderateScale(10),
    },
});
