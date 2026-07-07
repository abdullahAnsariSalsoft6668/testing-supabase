import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

const AdminMenu = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Menu" subtitle={user.email} />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <View style={healthScreenStyles.card}>
                    <TextComp text={user.full_name} style={healthScreenStyles.cardTitle} />
                    <TextComp text={`Role: ${user.role ?? 'unknown'}`} style={healthScreenStyles.cardMeta} />
                    <TextComp text={user.email} style={healthScreenStyles.cardMeta} />
                </View>
                <Pressable
                    style={healthScreenStyles.secondaryBtn}
                    onPress={async () => {
                        await syncAuthFromSupabase();
                    }}
                >
                    <TextComp text="Refresh session / role" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => clearDataAction()}>
                    <TextComp text="Sign Out" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default AdminMenu;
