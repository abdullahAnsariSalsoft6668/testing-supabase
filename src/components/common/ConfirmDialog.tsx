import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import TextComp from '@/components/TextComp';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

export type ConfirmDialogProps = {
    visible: boolean;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    /** Renders confirm button in red danger style */
    danger?: boolean;
    /** Shows spinner on confirm button while async action runs */
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={onCancel}
    >
        <Pressable style={styles.backdrop} onPress={onCancel}>
            {/* Inner Pressable prevents closing when tapping the card */}
            <Pressable style={styles.card} onPress={() => {}}>
                {/* Icon strip */}
                <View style={[styles.iconStrip, danger ? styles.iconStripDanger : styles.iconStripInfo]}>
                    <TextComp text={danger ? '!' : 'i'} style={styles.iconText} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <TextComp text={title} style={styles.title} />
                    {message ? <TextComp text={message} style={styles.message} /> : null}
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Buttons */}
                <View style={styles.btnRow}>
                    <Pressable style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
                        <TextComp text={cancelText} style={styles.cancelBtnText} />
                    </Pressable>

                    <Pressable
                        style={[styles.confirmBtn, danger ? styles.confirmBtnDanger : styles.confirmBtnPrimary, loading && styles.btnDisabled]}
                        onPress={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <TextComp text={confirmText} style={styles.confirmBtnText} />
                        )}
                    </Pressable>
                </View>
            </Pressable>
        </Pressable>
    </Modal>
);

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: moderateScale(32),
    },
    card: {
        width: '100%',
        backgroundColor: theme.colors.card.background,
        borderRadius: moderateScale(20),
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
    },

    /* Icon strip */
    iconStrip: {
        alignItems: 'center',
        paddingVertical: moderateScale(24),
    },
    iconStripDanger: { backgroundColor: '#FFF1F0' },
    iconStripInfo: { backgroundColor: theme.palette.teal.surface },
    iconText: {
        fontSize: moderateScale(32),
        fontWeight: '700',
        color: theme.palette.teal.main,
    },

    /* Content */
    content: {
        paddingHorizontal: moderateScale(24),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(24),
        alignItems: 'center',
    },
    title: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
    message: {
        fontSize: moderateScale(14),
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginTop: moderateScale(8),
        lineHeight: moderateScale(22),
    },

    divider: { height: 1, backgroundColor: theme.colors.border.default },

    /* Buttons */
    btnRow: {
        flexDirection: 'row',
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: moderateScale(16),
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: theme.colors.border.default,
    },
    cancelBtnText: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: moderateScale(52),
    },
    confirmBtnPrimary: { backgroundColor: theme.palette.teal.main },
    confirmBtnDanger: { backgroundColor: theme.palette.status.error },
    confirmBtnText: { fontSize: moderateScale(15), fontWeight: '700', color: '#fff' },
    btnDisabled: { opacity: 0.7 },
});

export default ConfirmDialog;
