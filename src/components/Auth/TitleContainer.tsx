import { I18nManager, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import TextComp from '../TextComp'
import { spaces } from '@/styles/sizes'
import { heights } from '@/styles/sizes'
import { moderateScale } from '@/styles/scaling'
import { lifeSavers, plusJakarta, nasalization } from '@/assets/fonts'
import { Colors } from '@/styles/colors'

type Props = {
    title: string;
    subtitle: string;
    darkTheme?: boolean;
    titleStyle?: TextStyle;
    subtitleStyle?: TextStyle;
    containerStyle?: ViewStyle;
}

const TitleContainer = (props: Props) => {

    const { title, subtitle, darkTheme = false, titleStyle, subtitleStyle, containerStyle } = props;
    return (
        <View style={[styles.titleContainer, containerStyle]}>
            <View style={styles.titleRow}>
                <TextComp 
                    text={title} 
                    style={[
                        darkTheme ? styles.titleMainDark : styles.titleMain,
                        titleStyle
                    ]} 
                />
            </View>
            <TextComp 
                text={subtitle} 
                style={[
                    darkTheme ? styles.subtitleDark : styles.subtitle,
                    subtitleStyle
                ]} 
            />
        </View>
    )
}

export default TitleContainer

const styles = StyleSheet.create({
    titleContainer: {
        height: heights.loginCard,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingHorizontal: spaces.small,
        paddingBottom: spaces.xxl,
    },

    titleRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        flexWrap: 'wrap',
        marginBottom: spaces.small,
    },
    titleAccent: {
        fontSize: moderateScale(32),
        fontFamily: lifeSavers.regular,
        color: Colors.primary,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    titleMain: {
        fontSize: moderateScale(32),
        fontFamily: lifeSavers.bold,
        color: Colors.black,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    titleMainDark: {
        fontSize: moderateScale(28),
        fontFamily: nasalization.regular,
        color: Colors.white,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        letterSpacing: 1.5,
    },
    subtitle: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        opacity: 0.95,
    },
    subtitleDark: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.gray200,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        opacity: 0.8,
    },
})