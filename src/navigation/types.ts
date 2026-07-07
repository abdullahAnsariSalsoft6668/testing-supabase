export type RootStackParamList = {
    Auth: undefined;
    Patient: undefined;
    Doctor: undefined;
    Admin: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Onboarding: undefined;
    Register: undefined;
    Forgot: undefined;
    ForgotVerifyOtp: { email: string };
    ForgotResetPassword: { email: string; otp: string };
    CompleteProfile: undefined;
    PendingApproval: undefined;
};

export type PatientTabParamList = {
    PatientHome: undefined;
    PatientExplore: undefined;
    PatientAppointments: undefined;
    PatientReports: undefined;
    PatientProfile: undefined;
};

export type PatientStackParamList = PatientTabParamList & {
    PatientTabs: undefined;
    HospitalDepartments: { hospitalId: string; hospitalName: string };
    DepartmentDoctors: { departmentId: string; departmentName: string; hospitalId: string };
    DoctorDetail: { doctorId: string };
    BookAppointment: { doctorId: string; doctorName: string };
    AppointmentDetail: { appointmentId: string };
};

export type DoctorTabParamList = {
    DoctorDashboard: undefined;
    DoctorSchedule: undefined;
    DoctorAppointments: undefined;
    DoctorProfile: undefined;
};

export type DoctorStackParamList = DoctorTabParamList & {
    DoctorTabs: undefined;
    SlotForm: { date?: string } | undefined;
    DoctorAppointmentDetail: { appointmentId: string };
    DoctorPendingApproval: undefined;
};

export type AdminTabParamList = {
    AdminDashboard: undefined;
    AdminHospitals: undefined;
    AdminDepartments: undefined;
    AdminDoctors: undefined;
    AdminMenu: undefined;
};

export type AdminStackParamList = AdminTabParamList & {
    AdminTabs: undefined;
    HospitalForm: { hospitalId?: string } | undefined;
    DepartmentForm: { departmentId?: string; hospitalId?: string } | undefined;
    DoctorDetailAdmin: { doctorId: string };
};

/** @deprecated Legacy grocery stack types */
export type MainStackParamList = Record<string, object | undefined>;
