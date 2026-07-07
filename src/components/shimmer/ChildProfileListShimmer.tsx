import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import AppShimmerBox from './AppShimmerBox';
import ChildProfileRowShimmer from './ChildProfileRowShimmer';

export type ChildProfileListShimmerProps = {
    /** Number of child profile row placeholders */
    rowCount?: number;
    /** Optional dashed “add” card placeholder below rows */
    showAddCard?: boolean;
};

/**
 * Loading skeleton for child profile lists (matches `ChildProfiles` list + add card).
 * Use while `useGetMobileProfileQuery` is in initial loading state.
 */
const ChildProfileListShimmer: React.FC<ChildProfileListShimmerProps> = ({
    rowCount = 4,
    showAddCard = true,
}) => {
    const keys = useMemo(
        () => Array.from({ length: rowCount }, (_, i) => `child-shimmer-${i}`),
        [rowCount],
    );

    return (
        <View style={styles.root} accessibilityLabel="Loading child profiles">
            {keys.map((k) => (
                <ChildProfileRowShimmer key={k} />
            ))}
            {showAddCard ? (
                <View style={styles.addCard}>
                    <AppShimmerBox palette="childProfile" style={styles.addIcon} />
                    <AppShimmerBox palette="onWhite" style={styles.addLabel} />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
    },
    addCard: {
        borderRadius: moderateScale(22),
        borderWidth: moderateScale(2),
        borderColor: 'rgba(0,0,0,0.06)',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(255,255,255,0.65)',
        marginTop: moderateScale(4),
        paddingVertical: moderateScale(28),
        paddingHorizontal: moderateScale(16),
        alignItems: 'center',
        gap: moderateScale(12),
    },
    addIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
    },
    addLabel: {
        height: moderateScale(12),
        width: '48%',
        borderRadius: moderateScale(6),
    },
});

export default ChildProfileListShimmer;
