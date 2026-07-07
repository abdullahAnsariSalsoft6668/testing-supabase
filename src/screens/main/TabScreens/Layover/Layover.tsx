import { localImages } from '@/assets/images';
import ButtonComp from '@/components/ButtonComp';
import TextComp from '@/components/TextComp';
import {
    CalendarIcon,
    DocumentIcon,
    DocumentUploadZone,
    ExtraWorkFormField,
    LocationIcon,
    SectionTitle,
} from '@/components/extraWorkSubmit';
import {
    ImportantNotice,
    LAYOVER_BG,
    LAYOVER_GRADIENT_GLOW,
    LAYOVER_GRADIENT_MID,
    LayoverHeader,
    ReasonIcon,
    SUBMIT_GRADIENT,
    TimestampBar,
} from '@/components/layoverReport';
import WrapperContainer from '@/components/WrapperContainer';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { Formik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import * as Yup from 'yup';

import styles from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

type LayoverFormValues = {
    routeName: string;
    date: string;
    layoverLocation: string;
    reason: string;
    description: string;
};

const validationSchema = Yup.object().shape({
    routeName: Yup.string().trim().required('Required'),
    date: Yup.string().trim().required('Required'),
    layoverLocation: Yup.string().trim().required('Required'),
    reason: Yup.string().trim().required('Required'),
    description: Yup.string().trim().required('Required'),
});

const initialValues: LayoverFormValues = {
    routeName: '',
    date: '',
    layoverLocation: '',
    reason: '',
    description: '',
};

const formatTimestamp = () =>
    new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

const SubmitFooter: React.FC<{ index: number; children: React.ReactNode }> = ({
    index,
    children,
}) => {
    const animatedStyle = useAuthStagger({ index, baseDelay: 120, step: 50, translateY: 16 });
    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const Layover: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timestamp = useMemo(() => formatTimestamp(), []);

    const handleUpload = useCallback(() => {
        const nextIndex = uploadedFiles.length + 1;
        setUploadedFiles(current => [...current, `document-${nextIndex}.jpg`]);
    }, [uploadedFiles.length]);

    const handleSubmit = useCallback(async (_values: LayoverFormValues) => {
        setIsSubmitting(true);
        try {
            await new Promise<void>(resolve => {
                setTimeout(resolve, 900);
            });
            Alert.alert(
                'Submitted',
                'Your layover report has been sent for admin review.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={LAYOVER_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={LAYOVER_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <LinearGradient
                    colors={['#00050a', LAYOVER_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[LAYOVER_GRADIENT_GLOW, LAYOVER_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />
                    <LayoverHeader avatarSource={localImages.user} />
                </LinearGradient>

                <View style={styles.formPanel}>
                    <ImportantNotice />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit: submitForm,
                            values,
                            errors,
                            touched,
                        }) => (
                            <>
                                <SectionTitle title="Layover Details" index={0} />

                                <ExtraWorkFormField
                                    index={0}
                                    label="Route Name"
                                    required
                                    placeholder="e.g., Route A - Downtown"
                                    leftIcon={<DocumentIcon />}
                                    value={values.routeName}
                                    onChangeText={handleChange('routeName')}
                                    onBlur={handleBlur('routeName')}
                                    error={errors.routeName}
                                    touched={touched.routeName}
                                />

                                <ExtraWorkFormField
                                    index={1}
                                    label="Date"
                                    required
                                    placeholder="MM/DD/YYYY"
                                    leftIcon={<CalendarIcon />}
                                    value={values.date}
                                    onChangeText={handleChange('date')}
                                    onBlur={handleBlur('date')}
                                    error={errors.date}
                                    touched={touched.date}
                                />

                                <ExtraWorkFormField
                                    index={2}
                                    label="Layover Location"
                                    required
                                    placeholder="e.g., Downtown Station"
                                    leftIcon={<LocationIcon />}
                                    value={values.layoverLocation}
                                    onChangeText={handleChange('layoverLocation')}
                                    onBlur={handleBlur('layoverLocation')}
                                    error={errors.layoverLocation}
                                    touched={touched.layoverLocation}
                                />

                                <ExtraWorkFormField
                                    index={3}
                                    label="Reason for Layover"
                                    required
                                    placeholder="e.g., Vehicle breakdown"
                                    leftIcon={<ReasonIcon />}
                                    value={values.reason}
                                    onChangeText={handleChange('reason')}
                                    onBlur={handleBlur('reason')}
                                    error={errors.reason}
                                    touched={touched.reason}
                                />

                                <ExtraWorkFormField
                                    index={4}
                                    label="Detailed Description"
                                    required
                                    placeholder="Provide a detailed explanation of the situation..."
                                    multiline
                                    numberOfLines={5}
                                    value={values.description}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    error={errors.description}
                                    touched={touched.description}
                                    inputContainerStyle={styles.multilineField}
                                    inputStyle={styles.multilineInput}
                                />

                                <TimestampBar timestamp={timestamp} index={5} />

                                <View style={styles.documentsSection}>
                                    <SectionTitle title="Supporting Documents" index={1} />
                                    <DocumentUploadZone
                                        index={6}
                                        files={uploadedFiles}
                                        onPress={handleUpload}
                                    />
                                </View>

                                <SubmitFooter index={7}>
                                    <ButtonComp
                                        title="Submit Layover Report"
                                        onPress={submitForm}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        style={styles.submitButton}
                                        textStyle={styles.submitButtonText}
                                        gradientColors={SUBMIT_GRADIENT}
                                    />
                                    <TextComp
                                        text="All layover reports are available for admin review"
                                        style={styles.disclaimer}
                                    />
                                </SubmitFooter>
                            </>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default Layover;
