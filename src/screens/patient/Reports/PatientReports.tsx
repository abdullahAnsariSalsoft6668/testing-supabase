import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { createReport, listPatientReports, uploadReportFile } from '@/services/reportService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { MedicalReport } from '@/types/database';

const PatientReports = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const load = () => {
        if (!user.patient_id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        listPatientReports(user.patient_id)
            .then(setReports)
            .finally(() => setLoading(false));
    };

    useFocusEffect(useCallback(() => { load(); }, [user.patient_id]));

    const handleUpload = async () => {
        if (!user.patient_id || !user.id) return;
        const result = await launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1 });
        if (result.didCancel || !result.assets?.[0]?.uri) return;
        const asset = result.assets[0];
        const uri = asset.uri;
        if (!uri) return;
        setUploading(true);
        try {
            const url = await uploadReportFile(user.patient_id, uri, asset.fileName ?? 'report.jpg');
            await createReport({
                patient_id: user.patient_id,
                uploaded_by: user.id,
                title: asset.fileName ?? 'Medical Report',
                report_type: asset.type ?? 'image',
                report_url: url,
            });
            Toast.show({ type: 'success', text1: 'Report uploaded' });
            load();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Upload failed', text2: String(e) });
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Medical Reports" subtitle="Your health documents" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <Pressable style={healthScreenStyles.primaryBtn} onPress={handleUpload} disabled={uploading}>
                    <TextComp
                        text={uploading ? 'Uploading...' : 'Upload Report'}
                        style={healthScreenStyles.primaryBtnText}
                    />
                </Pressable>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : reports.length === 0 ? (
                    <EmptyState title="No reports yet" message="Upload lab results or prescriptions." />
                ) : (
                    reports.map((r) => (
                        <Pressable
                            key={r.id}
                            style={healthScreenStyles.card}
                            onPress={() => Linking.openURL(r.report_url)}
                        >
                            <TextComp text={r.title ?? 'Report'} style={healthScreenStyles.cardTitle} />
                            <TextComp text={r.report_type ?? ''} style={healthScreenStyles.cardMeta} />
                            <TextComp text={new Date(r.created_at).toLocaleDateString()} style={healthScreenStyles.cardMeta} />
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default PatientReports;
