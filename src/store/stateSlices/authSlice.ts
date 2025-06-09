import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    refreshFailed?: boolean
    timestamp: string | null
}

const initialState: AuthState = {
    refreshFailed: false,
    timestamp: null,
}

export const authSlice = createSlice({
    name: 'auth-state',
    initialState,
    reducers: {
        updateAuthState(state, action: PayloadAction<AuthState>) {
            state.timestamp = action.payload.timestamp
            state.refreshFailed = action.payload.refreshFailed
        },
    },
})

export const { updateAuthState } = authSlice.actions
