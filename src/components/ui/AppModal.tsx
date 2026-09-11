import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import TextComp from '@/components/TextComp';
import ButtonComp from '@/components/ui/ButtonComp';
import CareChip from '@/components/ui/CareChip';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

type AppModalProps = {
    visible: boolean;
    title: string;
    message?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    onPrimary?: () => void;
    onSecondary?: () => void;
    onClose?: () => void;
    pills?: string[];
    selectedPill?: string;
    onPillSelect?: (pill: string) => void;
};

const AppModal = ({
    visible,
    title,
    message,
    primaryLabel = 'OK',
    secondaryLabel,
    onPrimary,
    onSecondary,
    onClose,
    pills,
    selectedPill,
    onPillSelect,
}: AppModalProps) => {
    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            backdropOpacity={theme.components.modal.backdropOpacity}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={220}
            animationOutTiming={220}
            useNativeDriver
        >
            <View style={styles.card}>
                <TextComp text={title} style={styles.title} />
                {message ? <TextComp text={message} style={styles.message} /> : null}
                {pills?.length ? (
                    <View style={styles.pillRow}>
                        {pills.map((pill) => (
                            <CareChip
                                key={pill}
                                label={pill}
                                selected={pill === selectedPill}
                                onPress={() => onPillSelect?.(pill)}
                            />
                        ))}
                    </View>
                ) : null}
                <View style={styles.actions}>
                    {secondaryLabel ? (
                        <ButtonComp
                            label={secondaryLabel}
                            variant="outline"
                            onPress={onSecondary ?? onClose}
                            style={styles.actionBtn}
                        />
                    ) : null}
                    <ButtonComp label={primaryLabel} onPress={onPrimary ?? onClose} style={styles.actionBtn} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.components.modal.backgroundColor,
        borderRadius: theme.radius.sheet,
        padding: moderateScale(24),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    title: {
        ...typography.h2,
        fontSize: theme.components.modal.titleSize,
        lineHeight: moderateScale(28),
    },
    message: {
        ...typography.body,
        color: theme.colors.text.secondary,
        marginTop: moderateScale(10),
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(8),
        marginTop: moderateScale(16),
    },
    actions: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginTop: moderateScale(20),
    },
    actionBtn: {
        flex: 1,
    },
});

export default AppModal;
