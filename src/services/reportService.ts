import { getSupabase } from '@/utils/supabase';
import type { MedicalReport } from '@/types/database';

export async function listPatientReports(patientId: string) {
    const { data, error } = await getSupabase()
        .from('medical_reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as MedicalReport[];
}

export async function createReport(params: {
    patient_id: string;
    uploaded_by: string;
    title?: string;
    report_type?: string;
    report_url: string;
}) {
    const { data, error } = await getSupabase().from('medical_reports').insert(params).select().single();
    if (error) throw error;
    return data as MedicalReport;
}

export async function uploadReportFile(patientId: string, fileUri: string, fileName: string) {
    const path = `${patientId}/${Date.now()}_${fileName}`;
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const { error: uploadError } = await getSupabase().storage.from('medical-reports').upload(path, blob, {
        contentType: blob.type || 'application/octet-stream',
        upsert: false,
    });
    if (uploadError) throw uploadError;
    const { data } = getSupabase().storage.from('medical-reports').getPublicUrl(path);
    return data.publicUrl;
}

export async function uploadProfileImage(userId: string, fileUri: string) {
    const path = `${userId}/avatar.jpg`;
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const { error } = await getSupabase().storage.from('profile-images').upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: true,
    });
    if (error) throw error;
    const { data } = getSupabase().storage.from('profile-images').getPublicUrl(path);
    return data.publicUrl;
}
