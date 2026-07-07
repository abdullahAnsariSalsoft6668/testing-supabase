import { localImages } from '@/assets/images';
import {
    CompleteRouteFooter,
    NeedHelpCard,
    ROUTE_DETAILS_BG,
    ROUTE_GRADIENT_GLOW,
    ROUTE_GRADIENT_MID,
    RouteDetailsHeader,
    RouteInstructionsSection,
    RouteProgressSection,
    StopListItem,
    StopsSectionHeader,
    computeRouteProgress,
    getRouteDetailsById,
    isRouteFullyCompleted,
    markStopCompleted,
} from '@/components/routeDetails';
import type { RouteStop } from '@/components/routeDetails';
import WrapperContainer from '@/components/WrapperContainer';
import { MainStackParamList } from '@/navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, ListRenderItem, StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

type RouteDetailsScreenRoute = RouteProp<MainStackParamList, 'RouteDetails'>;

const RouteDetails: React.FC = () => {
    const navigation = useNavigation();
    const { params } = useRoute<RouteDetailsScreenRoute>();
    const routeId = params?.routeId ?? 'route-a';

    const routeData = useMemo(() => getRouteDetailsById(routeId), [routeId]);
    const [stops, setStops] = useState<RouteStop[]>(routeData.stops);

    useEffect(() => {
        setStops(getRouteDetailsById(routeId).stops);
    }, [routeId]);

    const { completedStops, totalStops, progress } = useMemo(
        () => computeRouteProgress(stops),
        [stops],
    );

    const routeComplete = useMemo(() => isRouteFullyCompleted(stops), [stops]);

    const handleMarkStopComplete = useCallback((stopId: string) => {
        setStops(current => markStopCompleted(current, stopId));
    }, []);

    const handleCompleteRoute = useCallback(() => {
        if (!routeComplete) {
            Alert.alert(
                'Route incomplete',
                'Please mark all stops as completed before finishing this route.',
            );
            return;
        }

        Alert.alert('Route completed', `${routeData.name} has been marked as complete.`, [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    }, [navigation, routeComplete, routeData.name]);

    const listHeader = useMemo(
        () => (
            <View style={styles.listHeader}>
                <RouteProgressSection
                    completedStops={completedStops}
                    totalStops={totalStops}
                    progress={progress}
                />
                <RouteInstructionsSection instructions={routeData.instructions} />
                <StopsSectionHeader totalStops={totalStops} />
            </View>
        ),
        [completedStops, progress, routeData.instructions, totalStops],
    );

    const listFooter = useMemo(() => <NeedHelpCard />, []);

    const renderStop: ListRenderItem<RouteStop> = useCallback(
        ({ item, index }) => (
            <View style={styles.stopItem}>
                <StopListItem
                    stop={item}
                    index={index}
                    isLast={index === stops.length - 1}
                    onMarkComplete={handleMarkStopComplete}
                />
            </View>
        ),
        [handleMarkStopComplete, stops.length],
    );

    const keyExtractor = useCallback((item: RouteStop) => item.id, []);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={ROUTE_DETAILS_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={ROUTE_DETAILS_BG} />
            <View style={styles.screen}>
                <LinearGradient
                    colors={['#00050a', ROUTE_DETAILS_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[ROUTE_GRADIENT_GLOW, ROUTE_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />
                    <RouteDetailsHeader
                        routeName={routeData.name}
                        date={routeData.date}
                        timeRange={routeData.timeRange}
                        avatarSource={localImages.user}
                    />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <FlatList
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        data={stops}
                        keyExtractor={keyExtractor}
                        renderItem={renderStop}
                        ListHeaderComponent={listHeader}
                        ListFooterComponent={listFooter}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={6}
                        maxToRenderPerBatch={4}
                        windowSize={8}
                        removeClippedSubviews
                    />
                </View>

                <CompleteRouteFooter onPress={handleCompleteRoute} disabled={!routeComplete} />
            </View>
        </WrapperContainer>
    );
};

export default RouteDetails;
