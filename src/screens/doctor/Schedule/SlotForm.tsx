import React from 'react';
import { View } from 'react-native';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

/** Placeholder for SlotForm route — schedule screen handles slot creation inline. */
const SlotForm = () => (
    <View style={healthScreenStyles.screen}>
        <HealthScreenHeader title="Add Slot" subtitle="Use the Schedule tab to manage slots" />
        <View style={healthScreenStyles.body}>
            <TextComp text="Go to Schedule tab to add availability." style={healthScreenStyles.cardMeta} />
        </View>
    </View>
);

export default SlotForm;
