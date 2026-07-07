import type { DriverStat, RouteItem } from './types';

export const HOME_HEADER_BG = '#001533';
export const HOME_GRADIENT_GLOW = '#003380';
export const HOME_GRADIENT_MID = '#002366';

export const ROUTE_CONTINUE_GRADIENT = ['#A30000', '#5C0000'] as const;
export const ROUTE_START_GRADIENT = ['#1B6B45', '#0D3D28'] as const;

export const HOME_ENTRANCE_BASE = 50;
export const HOME_ENTRANCE_STEP = 36;

export const MOCK_DRIVER_STATS: DriverStat[] = [
    { id: 'loads', value: '12/35', label: 'Completed Loads' },
    { id: 'routes', value: '02', label: 'Routes Today' },
    { id: 'ontime', value: '98%', label: 'On Time' },
];

export const MOCK_TODAY_ROUTES: RouteItem[] = [
    {
        id: 'route-a',
        name: 'Route A - Downtown',
        status: 'in_progress',
        timeRange: '06:00 AM - 02:00 PM',
        path: 'Central Hub → North Terminal',
        completedStops: 12,
        totalStops: 20,
        progress: 0.6,
    },
    {
        id: 'route-b',
        name: 'Route B - Suburbs',
        status: 'scheduled',
        timeRange: '02:30 PM - 08:00 PM',
        path: 'South Depot → West District',
        completedStops: 0,
        totalStops: 15,
        progress: 0,
    },
    {
        id: 'route-c',
        name: 'Route C - Industrial',
        status: 'details',
        timeRange: '06:00 AM - 12:00 PM',
        date: 'Apr 28',
        path: 'East Warehouse → Port Zone',
    },
];
