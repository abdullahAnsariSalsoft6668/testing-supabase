import { nasalization } from '@/assets/fonts';
import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type SummaryRow = {
    label: string;
    value: string;
};

const SUMMARY_ROWS: SummaryRow[] = [
    { label: 'Price per Square', value: '$05' },
    { label: 'Number of Square', value: '03' },
    { label: 'Subtotal', value: '$15.00' },
    { label: 'Estimated Tax', value: '$00' },
    { label: 'Other Fees', value: '$00' },
];

const CheckoutSummary: React.FC = () => (
    <View style={styles.card}>
        <TextComp text="SUMMARY" style={styles.title} />
        {SUMMARY_ROWS.map(row => (
            <View key={row.label} style={styles.row}>
                <TextComp text={row.label} style={styles.rowLabel} />
                <TextComp text={row.value} style={styles.rowValue} />
            </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.row}>
            <TextComp text="Total" style={styles.totalLabel} />
            <TextComp text="$15.00" style={styles.totalValue} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(28),
        paddingHorizontal: spaces.medium,
        paddingTop: moderateScale(24),
        paddingBottom: moderateScale(32),
    },
    title: {
        fontFamily: nasalization.regular,
        fontSize: moderateScale(18),
        color: Colors.black,
        letterSpacing: moderateScale(0.8),
        marginBottom: moderateScale(20),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(14),
    },
    rowLabel: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        color: Colors.gray500,
    },
    rowValue: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        color: Colors.gray500,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray200,
        marginBottom: moderateScale(14),
    },
    totalLabel: {
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(16),
        color: Colors.black,
    },
    totalValue: {
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(16),
        color: Colors.black,
    },
});

export default React.memo(CheckoutSummary);
