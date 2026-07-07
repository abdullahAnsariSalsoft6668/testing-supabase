import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import MyIcons from '@/components/MyIcons';
import {
    CategoryChips,
    GrocerySearchRow,
    SectionHeader,
    TabBodySheet,
    TabScreenHeader,
} from '@/components/grocery';
import {
    DEAL_CATEGORIES,
    DEALS_COUNT,
    DealCardRow,
    FEATURED_DEALS,
    HIGHEST_SAVINGS_DEALS,
    TOP_DISCOUNT_DEALS,
    TopDiscountRow,
} from '@/components/deals';
import type { DealItem } from '@/components/grocery/types';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { navigateMainStack } from '@/navigation/navigateMainStack';
import { Colors } from '@/styles/colors';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

const Deals: React.FC = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<string>(DEAL_CATEGORIES[0]);

    const openProductDetails = useCallback(
        (deal: DealItem) => {
            navigateMainStack(navigation, routes.main.productDetails, { dealId: deal.id });
        },
        [navigation],
    );

    const filteredFeatured = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query && category === 'All') return FEATURED_DEALS;
        return FEATURED_DEALS.filter(
            deal =>
                (category === 'All' || deal.title.toLowerCase().includes(category.toLowerCase())) &&
                (!query ||
                    deal.title.toLowerCase().includes(query) ||
                    deal.store.name.toLowerCase().includes(query)),
        );
    }, [category, search]);

    const handleFilterPress = useCallback(() => {}, []);

    return (
        <WrapperContainer style={tabScreenStyles.screen} edges={[]} innerBackgroundColor={theme.colors.background.primary}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
            <ScrollView
                style={tabScreenStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tabScreenStyles.scrollContent}
            >
                <TabScreenHeader
                    title="Today's Deals"
                    subtitle={`${DEALS_COUNT} Discounts Available!`}
                    rightAction={
                        <MyIcons
                            name="fire"
                            size={moderateScale(18)}
                            stroke={Colors.white}
                            style={tabScreenStyles.heroActionIcon}
                        />
                    }
                >
                    <GrocerySearchRow
                        value={search}
                        onChangeText={setSearch}
                        onFilterPress={handleFilterPress}
                    />
                </TabScreenHeader>

                <TabBodySheet>
                    <CategoryChips
                        categories={[...DEAL_CATEGORIES]}
                        selected={category}
                        onSelect={setCategory}
                    />

                    <SectionHeader title="⭐ Featured Deals" onSeeAll={() => {}} />
                    <DealCardRow
                        deals={filteredFeatured.length ? filteredFeatured : FEATURED_DEALS}
                        onDealPress={openProductDetails}
                    />

                    <SectionHeader title="💰 Highest Savings" onSeeAll={() => {}} />
                    <DealCardRow deals={HIGHEST_SAVINGS_DEALS} onDealPress={openProductDetails} />

                    <SectionHeader title="🔥 Today's Top Discount" onSeeAll={() => {}} />
                    {TOP_DISCOUNT_DEALS.map(deal => (
                        <TopDiscountRow key={deal.id} deal={deal} onPress={openProductDetails} />
                    ))}
                </TabBodySheet>
            </ScrollView>
        </WrapperContainer>
    );
};

export default Deals;
