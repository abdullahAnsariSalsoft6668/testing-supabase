import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import MyIcons from '../MyIcons';

const SEAL_PATH =
    'M48 8 L52.8 22.4 L68 22.4 L56 31.6 L60.8 46 L48 37.6 L35.2 46 L40 31.6 L28 22.4 L43.2 22.4 Z';

const SuccessSeal: React.FC = () => (
    <View style={styles.wrap}>
     <MyIcons name="checkVerified" size={moderateScale(60)} />
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        alignSelf: 'center',
        marginBottom: moderateScale(16),
    },
});

export default SuccessSeal;
