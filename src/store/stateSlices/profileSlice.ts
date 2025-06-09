import { User } from '@/types/user'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileState {
    me: User | null
}

const initialState: ProfileState = {
    me: null,
}

export const profileSlice = createSlice({
    name: 'profile-state',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<User | null>) => {
            state.me = action.payload
        },
    },
})

export const { setProfile } = profileSlice.actions
