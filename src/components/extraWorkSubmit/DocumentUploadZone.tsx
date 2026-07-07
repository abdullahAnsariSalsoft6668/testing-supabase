import TextComp from '@/components/TextComp';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { FORM_STAGGER_BASE, FORM_STAGGER_STEP } from './constants';
import { UploadIcon } from './FormIcons';

type DocumentUploadZoneProps = {
    index: number;
    files: string[];
    onPress: () => void;
};

const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({ index, files, onPress }) => {
    const animatedStyle = useAuthStagger({
        index,
        baseDelay: FORM_STAGGER_BASE,
        step: FORM_STAGGER_STEP,
        translateY: 16,
    });
    const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();

    const handlePress = useCallback(() => {
        onPress();
    }, [onPress]);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                accessibilityRole="button"
                accessibilityLabel="Upload supporting documents"
            >
                <Animated.View style={[styles.zone, pressStyle]}>
                    <UploadIcon />
                    <TextComp text="Click to upload files" style={styles.title} />
                    <TextComp text="Images or documents" style={styles.subtitle} />
                    {files.length > 0 ? (
                        <View style={styles.fileList}>
                            {files.map(file => (
                                <TextComp key={file} text={file} style={styles.fileName} />
                            ))}
                        </View>
                    ) : null}
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    zone: {
        minHeight: moderateScale(140),
        borderRadius: moderateScale(14),
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: Colors.gray300,
        backgroundColor: Colors.inputBackgroundApp,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(24),
        gap: moderateScale(6),
    },
    title: {
        marginTop: moderateScale(8),
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    subtitle: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
    fileList: {
        marginTop: moderateScale(10),
        alignItems: 'center',
        gap: moderateScale(4),
    },
    fileName: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.bold,
        color: Colors.secondary,
    },
});

export default React.memo(DocumentUploadZone);
