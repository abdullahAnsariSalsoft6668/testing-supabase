import React, { useCallback, useMemo } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    getDefaultProductDetail,
    getProductDetail,
    ProductDetailsContent,
    ProductDetailsHero,
} from '@/components/productDetails';
import WrapperContainer from '@/components/WrapperContainer';
import AuthYellowButton from '@/screens/auth/shared/AuthYellowButton';
import routes from '@/constants/routes';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import type { MainStackParamList } from '@/navigation/types';

type ProductDetailsRoute = RouteProp<MainStackParamList, 'ProductDetails'>;
type ProductDetailsNavigation = NativeStackNavigationProp<
    MainStackParamList,
    typeof routes.main.productDetails
>;

const ProductDetails: React.FC = () => {
    const navigation = useNavigation<ProductDetailsNavigation>();
    const route = useRoute<ProductDetailsRoute>();
    const insets = useSafeAreaInsets();

    const product = useMemo(() => {
        const detail = getProductDetail(route.params?.dealId ?? '');
        return detail ?? getDefaultProductDetail();
    }, [route.params?.dealId]);

    const handleGenerateBarcode = useCallback(() => {
        navigation.navigate(routes.main.savingBarcode, {
            dealId: route.params?.dealId ?? product.id,
        });
    }, [navigation, product.id, route.params?.dealId]);

    return (
        <WrapperContainer
            style={styles.screen}
            edges={[]}
            innerBackgroundColor={theme.colors.background.primary}
        >
            <StatusBar barStyle="dark-content" backgroundColor={product.imageBg} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: moderateScale(140) + insets.bottom },
                ]}
            >
                <ProductDetailsHero product={product} />
                <ProductDetailsContent product={product} />
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spaces.small) }]}>
                <AuthYellowButton
                    title="Generate Saving Barcode"
                    onPress={handleGenerateBarcode}
                    helperText="Show the barcode to the cashier at checkout"
                />
            </View>
        </WrapperContainer>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: theme.colors.card.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.border.default,
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.medium,
        ...theme.shadows.card,
    },
});

export default ProductDetails;
