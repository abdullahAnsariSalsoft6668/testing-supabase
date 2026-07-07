import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import TextComp from './TextComp';
import MyIcons from './MyIcons';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

interface ActionItemCardProps {
    title: string;
    iconBackgroundColor: string;
    iconPlaceholder?: React.ReactNode;
    onPress: () => void;
    style?: ViewStyle;
}

const ActionItemCard: React.FC<ActionItemCardProps> = ({
    title,
    iconBackgroundColor,
    iconPlaceholder,
    onPress,
    style,
}) => (
    <Pressable style={[styles.card, style]} onPress={onPress}>
        <View style={[styles.iconWrap, { backgroundColor: iconBackgroundColor }]}>
            {iconPlaceholder ?? <MyIcons name="setting" size={moderateScale(22)} stroke={Colors.white} />}
        </View>
        <TextComp text={title} style={styles.title} />
        <MyIcons name="rightChevron" size={moderateScale(18)} />
    </Pressable>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        padding: moderateScale(14),
        marginBottom: moderateScale(10),
        gap: moderateScale(14),
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    iconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(22),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: moderateScale(15),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
});

export default React.memo(ActionItemCard);
