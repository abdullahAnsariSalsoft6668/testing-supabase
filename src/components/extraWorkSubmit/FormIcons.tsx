import MyIcons from '@/components/MyIcons';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';

const FORM_ICON_SIZE = moderateScale(18);
const FORM_ICON_COLOR = Colors.gray500;

export const DocumentIcon = () => (
    <MyIcons name="documentIcon" size={FORM_ICON_SIZE} stroke={FORM_ICON_COLOR} />
);

export const CalendarIcon = () => (
    <MyIcons name="calendar" size={FORM_ICON_SIZE} stroke={FORM_ICON_COLOR} />
);

export const ClockIcon = () => (
    <MyIcons name="timeIcon" size={FORM_ICON_SIZE} stroke={FORM_ICON_COLOR} />
);

export const LocationIcon = () => (
    <MyIcons name="locationIcon" size={FORM_ICON_SIZE} stroke={FORM_ICON_COLOR} />
);

export const CountingIcon = () => (
    <MyIcons name="counting" size={FORM_ICON_SIZE} fill={FORM_ICON_COLOR} />
);

export const UploadIcon = () => (
    <MyIcons name="documentIcon" size={moderateScale(28)} stroke={FORM_ICON_COLOR} />
);
