export type RouteStatus = 'in_progress' | 'scheduled' | 'details';

export type DriverStat = {
    id: string;
    value: string;
    label: string;
};

export type RouteItem = {
    id: string;
    name: string;
    status: RouteStatus;
    timeRange?: string;
    path?: string;
    date?: string;
    completedStops?: number;
    totalStops?: number;
    progress?: number;
};

export type RouteActionVariant = 'continue' | 'start' | 'details';
