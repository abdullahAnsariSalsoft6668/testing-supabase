export type StopStatus = 'completed' | 'current' | 'pending';

export type RouteStop = {
    id: string;
    name: string;
    address: string;
    time: string;
    status: StopStatus;
};

export type RouteDetailsData = {
    id: string;
    name: string;
    date: string;
    timeRange: string;
    instructions: string;
    completedStops: number;
    totalStops: number;
    progress: number;
    stops: RouteStop[];
};
