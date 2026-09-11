import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Respects OS Reduce Motion — gate decorative loops and springs. */
export function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        let mounted = true;

        AccessibilityInfo.isReduceMotionEnabled()
            .then((value) => {
                if (mounted) setReduced(value);
            })
            .catch(() => undefined);

        const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
            setReduced(value);
        });

        return () => {
            mounted = false;
            sub.remove();
        };
    }, []);

    return reduced;
}
