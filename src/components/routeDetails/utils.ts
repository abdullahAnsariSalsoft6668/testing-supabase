import type { RouteStop } from './types';

export const markStopCompleted = (stops: RouteStop[], stopId: string): RouteStop[] => {
    const updated = stops.map(stop => ({ ...stop }));
    const target = updated.find(stop => stop.id === stopId);

    if (!target || target.status === 'completed') {
        return stops;
    }

    const wasCurrent = target.status === 'current';
    target.status = 'completed';

    if (wasCurrent) {
        const nextPending = updated.find(stop => stop.status === 'pending');
        if (nextPending) {
            nextPending.status = 'current';
        }
    } else {
        const hasCurrent = updated.some(stop => stop.status === 'current');
        if (!hasCurrent) {
            const firstPending = updated.find(stop => stop.status === 'pending');
            if (firstPending) {
                firstPending.status = 'current';
            }
        }
    }

    return updated;
};

export const computeRouteProgress = (stops: RouteStop[]) => {
    const completedStops = stops.filter(stop => stop.status === 'completed').length;
    const totalStops = stops.length;

    return {
        completedStops,
        totalStops,
        progress: totalStops ? completedStops / totalStops : 0,
    };
};

export const isRouteFullyCompleted = (stops: RouteStop[]) =>
    stops.length > 0 && stops.every(stop => stop.status === 'completed');
