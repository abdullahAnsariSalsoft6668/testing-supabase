import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type PriceTierDropdownProps = {
    label?: string;
    onPress?: () => void;
};

const ChevronDown = () => (
    <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M6 9l6 6 6-6"
            stroke={Colors.gray500}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const PriceTierDropdown: React.FC<PriceTierDropdownProps> = ({
    label = 'Select Price Tier',
    onPress,
}) => (
    <Pressable
        style={styles.container}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
    >
        <TextComp text={label} style={styles.label} />
        <View style={styles.chevronWrap}>
            <ChevronDown />
        </View>
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(24),
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(10),
        marginBottom: spaces.medium,
        gap: moderateScale(8),
    },
    label: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: Colors.gray500,
    },
    chevronWrap: {
        marginTop: moderateScale(2),
    },
});

export default React.memo(PriceTierDropdown);
