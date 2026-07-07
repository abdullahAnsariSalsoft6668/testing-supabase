import { palette } from '@/styles/palette';
import type { AppointmentStatus, DoctorStatus, SlotStatus } from '@/types/database';

type StatusStyle = { background: string; text: string; label: string };

export const appointmentStatusStyles: Record<AppointmentStatus, StatusStyle> = {
    PENDING: { background: '#FFF4E6', text: palette.status.pending, label: 'Pending' },
    CONFIRMED: { background: palette.green.surface, text: palette.status.confirmed, label: 'Confirmed' },
    COMPLETED: { background: palette.sky.main, text: palette.status.completed, label: 'Completed' },
    CANCELLED: { background: '#FFE3E3', text: palette.status.cancelled, label: 'Cancelled' },
    NO_SHOW: { background: palette.neutral.gray100, text: palette.status.noShow, label: 'No Show' },
};

export const doctorStatusStyles: Record<DoctorStatus, StatusStyle> = {
    PENDING: { background: '#FFF4E6', text: palette.status.pending, label: 'Pending Approval' },
    APPROVED: { background: palette.green.surface, text: palette.status.confirmed, label: 'Approved' },
    REJECTED: { background: '#FFE3E3', text: palette.status.cancelled, label: 'Rejected' },
    SUSPENDED: { background: palette.neutral.gray100, text: palette.status.noShow, label: 'Suspended' },
};

export const slotStatusStyles: Record<SlotStatus, StatusStyle> = {
    AVAILABLE: { background: palette.green.surface, text: palette.status.confirmed, label: 'Available' },
    BOOKED: { background: palette.sky.main, text: palette.status.completed, label: 'Booked' },
    BLOCKED: { background: palette.neutral.gray100, text: palette.status.noShow, label: 'Blocked' },
};
