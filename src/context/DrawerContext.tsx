import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    SharedValue,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

interface DrawerContextType {
    isOpen: boolean;
    progress: SharedValue<number>;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const TIMING_CONFIG = { duration: 0 };

const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = () => {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
    return ctx;
};

export const useDrawerSafe = () => useContext(DrawerContext);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const progress = useSharedValue(0);

    const open = useCallback(() => {
        setIsOpen(true);
        progress.value = withTiming(1, TIMING_CONFIG);
    }, []);

    const close = useCallback(() => {
        progress.value = withTiming(0, TIMING_CONFIG, (finished) => {
            if (finished) runOnJS(setIsOpen)(false);
        });
    }, []);

    const toggle = useCallback(() => {
        if (isOpen) close();
        else open();
    }, [isOpen, open, close]);

    return (
        <DrawerContext.Provider value={{ isOpen, progress, open, close, toggle }}>
            {children}
        </DrawerContext.Provider>
    );
};
