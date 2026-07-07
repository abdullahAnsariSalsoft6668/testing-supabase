import type { RouteDetailsData } from './types';

export const ROUTE_DETAILS_BG = '#001533';
export const ROUTE_GRADIENT_GLOW = '#003380';
export const ROUTE_GRADIENT_MID = '#002366';

export const MARK_COMPLETE_GRADIENT = ['#1B6B45', '#0D3D28'] as const;
export const COMPLETE_ROUTE_GRADIENT = ['#145C38', '#0A3A24'] as const;
export const ROUTE_PROGRESS_GRADIENT = ['#A30000', '#5C0000'] as const;

export const ENTRANCE_BASE = 50;
export const ENTRANCE_STEP = 36;

export const MOCK_ROUTE_DETAILS: RouteDetailsData = {
    id: 'route-a',
    name: 'Route A - Downtown',
    date: '4/27/2026',
    timeRange: '06:00 AM - 02:00 PM',
    instructions:
        'Priority delivery route. Handle packages with care. Contact dispatch for any delays.',
    completedStops: 3,
    totalStops: 6,
    progress: 0.5,
    stops: [
        {
            id: 'stop-1',
            name: 'Central Hub',
            address: '123 Main Street, Downtown',
            time: '06:00 AM',
            status: 'completed',
        },
        {
            id: 'stop-2',
            name: 'North Terminal',
            address: '456 Oak Avenue, North District',
            time: '08:30 AM',
            status: 'completed',
        },
        {
            id: 'stop-3',
            name: 'Plaza Building',
            address: '789 Commerce Blvd, Downtown',
            time: '10:15 AM',
            status: 'current',
        },
        {
            id: 'stop-4',
            name: 'City Center',
            address: '321 Market Street, Downtown',
            time: '12:00 PM',
            status: 'pending',
        },
        {
            id: 'stop-5',
            name: 'East Warehouse',
            address: '654 Industrial Way, East Side',
            time: '02:00 PM',
            status: 'pending',
        },
        {
            id: 'stop-6',
            name: 'South Depot',
            address: '987 Logistics Lane, South District',
            time: '04:30 PM',
            status: 'pending',
        },
    ],
};

export const MOCK_ROUTE_B: RouteDetailsData = {
    id: 'route-b',
    name: 'Route B - Suburbs',
    date: '4/27/2026',
    timeRange: '02:30 PM - 08:00 PM',
    instructions:
        'Suburban delivery route. Verify signatures at each residential stop and contact dispatch for access issues.',
    completedStops: 0,
    totalStops: 5,
    progress: 0,
    stops: [
        {
            id: 'stop-b-1',
            name: 'South Depot',
            address: '987 Logistics Lane, South District',
            time: '02:30 PM',
            status: 'current',
        },
        {
            id: 'stop-b-2',
            name: 'Maple Grove',
            address: '120 Maple Street, West Hills',
            time: '03:45 PM',
            status: 'pending',
        },
        {
            id: 'stop-b-3',
            name: 'Oak Park',
            address: '88 Oak Park Drive, Suburbs',
            time: '05:00 PM',
            status: 'pending',
        },
        {
            id: 'stop-b-4',
            name: 'West District Hub',
            address: '450 West Avenue, West District',
            time: '06:30 PM',
            status: 'pending',
        },
        {
            id: 'stop-b-5',
            name: 'Riverside Plaza',
            address: '22 River Road, Suburbs',
            time: '08:00 PM',
            status: 'pending',
        },
    ],
};

export const MOCK_ROUTE_C: RouteDetailsData = {
    id: 'route-c',
    name: 'Route C - Industrial',
    date: '4/28/2026',
    timeRange: '06:00 AM - 12:00 PM',
    instructions:
        'Industrial zone deliveries. Safety vest required at all warehouse stops. Check in at security before unloading.',
    completedStops: 4,
    totalStops: 4,
    progress: 1,
    stops: [
        {
            id: 'stop-c-1',
            name: 'East Warehouse',
            address: '654 Industrial Way, East Side',
            time: '06:00 AM',
            status: 'completed',
        },
        {
            id: 'stop-c-2',
            name: 'Port Zone Gate',
            address: '900 Harbor Drive, Port Zone',
            time: '08:00 AM',
            status: 'completed',
        },
        {
            id: 'stop-c-3',
            name: 'Steel Works',
            address: '300 Foundry Road, Industrial Park',
            time: '10:00 AM',
            status: 'completed',
        },
        {
            id: 'stop-c-4',
            name: 'North Logistics',
            address: '112 Freight Lane, North District',
            time: '12:00 PM',
            status: 'completed',
        },
    ],
};

const ROUTE_DETAILS_BY_ID: Record<string, RouteDetailsData> = {
    'route-a': MOCK_ROUTE_DETAILS,
    'route-b': MOCK_ROUTE_B,
    'route-c': MOCK_ROUTE_C,
};

export const getRouteDetailsById = (id: string): RouteDetailsData =>
    ROUTE_DETAILS_BY_ID[id] ?? MOCK_ROUTE_DETAILS;
