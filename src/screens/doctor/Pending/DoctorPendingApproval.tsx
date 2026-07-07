import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

const DoctorPendingApproval = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            void syncAuthFromSupabase();
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Awaiting Approval" subtitle="Your profile is under review" />
            <View style={[healthScreenStyles.body, { flex: 1 }]}>
                <View style={healthScreenStyles.card}>
                    <TextComp
                        text="An administrator will review your credentials shortly. You'll gain access once approved."
                        style={healthScreenStyles.cardMeta}
                    />
                </View>
                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => syncAuthFromSupabase()}>
                    <TextComp text="Check Status" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => clearDataAction()}>
                    <TextComp text="Sign Out" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
            </View>
        </View>
    );
};

export default DoctorPendingApproval;
