import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type RouteProgressBarProps = {
    progress: number;
    delay?: number;
    fillColors?: readonly [string, string];
};

const RouteProgressBar: React.FC<RouteProgressBarProps> = ({
    progress,
    fillColors = ['#A30000', '#5C0000'],
}) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    return (
        <View style={styles.track}>
            <View style={[styles.fill, { width: `${clampedProgress * 100}%` }]}>
                <LinearGradient
                    colors={[...fillColors]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.fillGradient}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        height: moderateScale(6),
        borderRadius: moderateScale(6),
        backgroundColor: Colors.gray100,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: moderateScale(6),
        overflow: 'hidden',
    },
    fillGradient: {
        flex: 1,
        borderRadius: moderateScale(6),
    },
});

export default React.memo(RouteProgressBar);
