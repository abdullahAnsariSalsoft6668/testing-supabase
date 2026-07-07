/* eslint-disable */
import type { AuthUser, SelectedChildUser } from '@/models/auth.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    userData: AuthUser;
    isFirstTime: boolean;
    auth_token: string;
    refresh_token: string;
    selectedChild: SelectedChildUser | null;
    /** Active child profile id (`_id` / `id` from API). */
    selectedChildId: string | null;
}

const initialState: AuthState = {
    userData: {},
    isFirstTime: false,
    auth_token: '',
    refresh_token: '',
    selectedChild: null,
    selectedChildId: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        saveUserData: (state, action: PayloadAction<AuthUser>) => {
            state.userData = action.payload;
        },
        changeFirstTime: (state, action: PayloadAction<boolean>) => {
            state.isFirstTime = action.payload;
        },
        saveAuthToken: (state, action: PayloadAction<string>) => {
            state.auth_token = action.payload;
        },
        saveRefreshToken: (state, action: PayloadAction<string>) => {
            state.refresh_token = action.payload;
        },
        setSelectedChild: (state, action: PayloadAction<SelectedChildUser | null>) => {
            state.selectedChild = action.payload;
            if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
                const id = String(action.payload._id ?? action.payload.id ?? '').trim();
                state.selectedChildId = id || null;
            } else {
                state.selectedChildId = null;
            }
        },
        setSelectedChildId: (state, action: PayloadAction<string | null>) => {
            const v = action.payload != null ? String(action.payload).trim() : '';
            state.selectedChildId = v || null;
        },
        hydrateAuth: (
            state,
            action: PayloadAction<{
                userData?: AuthUser;
                auth_token?: string;
                refresh_token?: string;
                selectedChild?: SelectedChildUser | null;
                selectedChildId?: string | null;
            }>,
        ) => {
            const p = action.payload;
            if (p.userData !== undefined) {
                state.userData = p.userData;
            }
            if (p.auth_token !== undefined) {
                state.auth_token = p.auth_token;
            }
            if (p.refresh_token !== undefined) {
                state.refresh_token = p.refresh_token;
            }
            if (p.selectedChild !== undefined) {
                state.selectedChild = p.selectedChild;
            }
            if (p.selectedChildId !== undefined) {
                state.selectedChildId = p.selectedChildId;
            }
        },
        clearData: (state) => {
            state.userData = {};
            state.isFirstTime = false;
            state.auth_token = '';
            state.refresh_token = '';
            state.selectedChild = null;
            state.selectedChildId = null;
        },
    },
});

export const {
    changeFirstTime,
    saveUserData,
    saveAuthToken,
    saveRefreshToken,
    setSelectedChild,
    setSelectedChildId,
    hydrateAuth,
    clearData,
} = authSlice.actions;

export default authSlice.reducer;
