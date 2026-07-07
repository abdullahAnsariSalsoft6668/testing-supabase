import { localImages } from '@/assets/images';
import ButtonComp from '@/components/ButtonComp';
import TextComp from '@/components/TextComp';
import {
    CalendarIcon,
    ClockIcon,
    CountingIcon,
    DocumentIcon,
    DocumentUploadZone,
    EXTRA_WORK_BG,
    EXTRA_WORK_GRADIENT_GLOW,
    EXTRA_WORK_GRADIENT_MID,
    ExtraWorkFormField,
    ExtraWorkHeader,
    LocationIcon,
    SectionTitle,
    SUBMIT_GRADIENT,
} from '@/components/extraWorkSubmit';
import WrapperContainer from '@/components/WrapperContainer';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
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

type ExtraWorkFormValues = {
    routeName: string;
    date: string;
    totalStops: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
};

const validationSchema = Yup.object().shape({
    routeName: Yup.string().trim().required('Required'),
    date: Yup.string().trim().required('Required'),
    totalStops: Yup.string()
        .trim()
        .required('Required')
        .matches(/^\d+$/, 'Enter a valid number'),
    startTime: Yup.string().trim().required('Required'),
    endTime: Yup.string().trim().required('Required'),
    startLocation: Yup.string().trim().required('Required'),
    endLocation: Yup.string().trim().required('Required'),
});

const initialValues: ExtraWorkFormValues = {
    routeName: '',
    date: '',
    totalStops: '',
    startTime: '',
    endTime: '',
    startLocation: '',
    endLocation: '',
};

const SubmitFooter: React.FC<{ index: number; children: React.ReactNode }> = ({
    index,
    children,
}) => {
    const animatedStyle = useAuthStagger({ index, baseDelay: 120, step: 50, translateY: 16 });
    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const ExtraWork: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpload = useCallback(() => {
        const nextIndex = uploadedFiles.length + 1;
        setUploadedFiles(current => [...current, `document-${nextIndex}.jpg`]);
    }, [uploadedFiles.length]);

    const handleSubmit = useCallback(async (_values: ExtraWorkFormValues) => {
        setIsSubmitting(true);
        try {
            await new Promise<void>(resolve => {
                setTimeout(resolve, 900);
            });
            Alert.alert(
                'Submitted',
                'Your extra work route has been sent for admin review.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={EXTRA_WORK_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={EXTRA_WORK_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <LinearGradient
                    colors={['#00050a', EXTRA_WORK_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[EXTRA_WORK_GRADIENT_GLOW, EXTRA_WORK_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />
                    <ExtraWorkHeader avatarSource={localImages.user} />
                </LinearGradient>

                <View style={styles.formPanel}>
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
                                <SectionTitle title="Route Information" index={0} />

                                <ExtraWorkFormField
                                    index={0}
                                    label="Route Name"
                                    required
                                    placeholder="e.g., Extra Route Downtown"
                                    leftIcon={<DocumentIcon />}
                                    value={values.routeName}
                                    onChangeText={handleChange('routeName')}
                                    onBlur={handleBlur('routeName')}
                                    error={errors.routeName}
                                    touched={touched.routeName}
                                />

                                <View style={styles.formRow}>
                                    <View style={styles.formRowItem}>
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
                                    </View>
                                    <View style={styles.formRowItem}>
                                        <ExtraWorkFormField
                                            index={2}
                                            label="Total Stops"
                                            required
                                            placeholder="0"
                                            leftIcon={<CountingIcon />}
                                            keyboardType="number-pad"
                                            value={values.totalStops}
                                            onChangeText={handleChange('totalStops')}
                                            onBlur={handleBlur('totalStops')}
                                            error={errors.totalStops}
                                            touched={touched.totalStops}
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={styles.formRowItem}>
                                        <ExtraWorkFormField
                                            index={3}
                                            label="Start Time"
                                            required
                                            placeholder="06:00 AM"
                                            leftIcon={<ClockIcon />}
                                            value={values.startTime}
                                            onChangeText={handleChange('startTime')}
                                            onBlur={handleBlur('startTime')}
                                            error={errors.startTime}
                                            touched={touched.startTime}
                                        />
                                    </View>
                                    <View style={styles.formRowItem}>
                                        <ExtraWorkFormField
                                            index={4}
                                            label="End Time"
                                            required
                                            placeholder="02:00 PM"
                                            leftIcon={<ClockIcon />}
                                            value={values.endTime}
                                            onChangeText={handleChange('endTime')}
                                            onBlur={handleBlur('endTime')}
                                            error={errors.endTime}
                                            touched={touched.endTime}
                                        />
                                    </View>
                                </View>

                                <ExtraWorkFormField
                                    index={5}
                                    label="Start Location"
                                    required
                                    placeholder="e.g., Central Hub"
                                    leftIcon={<LocationIcon />}
                                    value={values.startLocation}
                                    onChangeText={handleChange('startLocation')}
                                    onBlur={handleBlur('startLocation')}
                                    error={errors.startLocation}
                                    touched={touched.startLocation}
                                />

                                <ExtraWorkFormField
                                    index={6}
                                    label="End Location"
                                    required
                                    placeholder="e.g., Airport Hub"
                                    leftIcon={<LocationIcon />}
                                    value={values.endLocation}
                                    onChangeText={handleChange('endLocation')}
                                    onBlur={handleBlur('endLocation')}
                                    error={errors.endLocation}
                                    touched={touched.endLocation}
                                />

                                <View style={styles.documentsSection}>
                                    <SectionTitle title="Supporting Documents" index={1} />
                                    <DocumentUploadZone
                                        index={7}
                                        files={uploadedFiles}
                                        onPress={handleUpload}
                                    />
                                </View>

                                <SubmitFooter index={8}>
                                    <ButtonComp
                                        title="Submit Extra Work"
                                        onPress={submitForm}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        style={styles.submitButton}
                                        textStyle={styles.submitButtonText}
                                        gradientColors={SUBMIT_GRADIENT}
                                    />
                                    <TextComp
                                        text="All submissions will be reviewed by admin before approval."
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

export default ExtraWork;
