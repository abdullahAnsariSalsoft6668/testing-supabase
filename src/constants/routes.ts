import * as Screens from '@/screens';

const routes = {
    auth: {
        login: 'Login',
        forgot: 'Forgot',
        forgotVerifyOtp: 'ForgotVerifyOtp',
        forgotResetPassword: 'ForgotResetPassword',
        onboarding: 'Onboarding',
        register: 'Register',
        completeProfile: 'CompleteProfile',
        pendingApproval: 'PendingApproval',
    },
    patient: {
        tab: {
            home: 'PatientHome',
            explore: 'PatientExplore',
            appointments: 'PatientAppointments',
            reports: 'PatientReports',
            profile: 'PatientProfile',
        },
        hospitalDepartments: 'HospitalDepartments',
        departmentDoctors: 'DepartmentDoctors',
        doctorDetail: 'DoctorDetail',
        bookAppointment: 'BookAppointment',
        appointmentDetail: 'AppointmentDetail',
        aiAssistantHub: 'AiAssistantHub',
        aiChat: 'AiChat',
        aiVoiceCall: 'AiVoiceCall',
    },
    doctor: {
        tab: {
            dashboard: 'DoctorDashboard',
            schedule: 'DoctorSchedule',
            appointments: 'DoctorAppointments',
            profile: 'DoctorProfile',
        },
        slotForm: 'SlotForm',
        appointmentDetail: 'DoctorAppointmentDetail',
        pendingApproval: 'DoctorPendingApproval',
    },
    admin: {
        tab: {
            dashboard: 'AdminDashboard',
            hospitals: 'AdminHospitals',
            departments: 'AdminDepartments',
            doctors: 'AdminDoctors',
            menu: 'AdminMenu',
        },
        hospitalForm: 'HospitalForm',
        departmentForm: 'DepartmentForm',
        doctorDetailAdmin: 'DoctorDetailAdmin',
    },
    navigator: {
        auth: 'Auth',
        patient: 'Patient',
        doctor: 'Doctor',
        admin: 'Admin',
        patientTab: 'PatientTabs',
        doctorTab: 'DoctorTabs',
        adminTab: 'AdminTabs',
    },
} as const;

export const authRoutes = {
    [routes.auth.login]: Screens.Login,
    [routes.auth.forgot]: Screens.Forgot,
    [routes.auth.forgotVerifyOtp]: Screens.ForgotVerifyOtp,
    [routes.auth.forgotResetPassword]: Screens.ForgotResetPassword,
    [routes.auth.onboarding]: Screens.Onboard,
    [routes.auth.register]: Screens.Register,
    [routes.auth.completeProfile]: Screens.CompleteProfile,
    [routes.auth.pendingApproval]: Screens.DoctorPendingApproval,
};

export const patientTabRoutes = {
    [routes.patient.tab.home]: Screens.PatientHome,
    [routes.patient.tab.explore]: Screens.PatientExplore,
    [routes.patient.tab.appointments]: Screens.PatientAppointments,
    [routes.patient.tab.reports]: Screens.PatientReports,
    [routes.patient.tab.profile]: Screens.PatientProfile,
};

export const doctorTabRoutes = {
    [routes.doctor.tab.dashboard]: Screens.DoctorDashboard,
    [routes.doctor.tab.schedule]: Screens.DoctorSchedule,
    [routes.doctor.tab.appointments]: Screens.DoctorAppointments,
    [routes.doctor.tab.profile]: Screens.DoctorProfile,
};

export const adminTabRoutes = {
    [routes.admin.tab.dashboard]: Screens.AdminDashboard,
    [routes.admin.tab.hospitals]: Screens.AdminHospitals,
    [routes.admin.tab.departments]: Screens.AdminDepartments,
    [routes.admin.tab.doctors]: Screens.AdminDoctors,
    [routes.admin.tab.menu]: Screens.AdminMenu,
};

export default routes;
