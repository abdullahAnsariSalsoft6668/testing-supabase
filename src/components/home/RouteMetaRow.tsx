import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type RouteMetaRowProps = {
    icon: IconName;
    text: string;
};

const RouteMetaRow: React.FC<RouteMetaRowProps> = ({ icon, text }) => (
    <View style={styles.row}>
        <MyIcons name={icon} size={moderateScale(16)} />
        <TextComp text={text} style={styles.text} />
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: moderateScale(8),
    },
    text: {
        flex: 1,
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
});

export default React.memo(RouteMetaRow);
