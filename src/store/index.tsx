import { configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { headerSlice } from './stateSlices/headerSlice'
import { authSlice } from './stateSlices/authSlice'
import { profileSlice } from './stateSlices/profileSlice'
import { authSlice as authPublicSlice } from './apiSlices/public/authSlice'
import { userSlice as userPublicSlice } from './apiSlices/public/userSlice'
import { userSlice as userPrivateSlice } from './apiSlices/private/userSlice'

const profilePersistConfig = {
    key: 'profile',
    storage,
    whitelist: ['hasOpenedConnectClient'],
}

const persistedProfileReducer = persistReducer(
    profilePersistConfig,
    profileSlice.reducer,
)

const timestampPersistConfig = {
    key: 'auth-state',
    storage,
}

const persistedTimestampReducer = persistReducer(
    timestampPersistConfig,
    authSlice.reducer,
)

const store = configureStore({
    reducer: {
        // States
        [headerSlice.reducerPath]: headerSlice.reducer,
        [profileSlice.reducerPath]: persistedProfileReducer,
        [authSlice.reducerPath]: persistedTimestampReducer,

        // Public routes
        [authPublicSlice.reducerPath]: authPublicSlice.reducer,
        [userPublicSlice.reducerPath]: userPublicSlice.reducer,

        // PRIVATE
        [userPrivateSlice.reducerPath]: userPrivateSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
            // Public routes
            .concat(authPublicSlice.middleware)
            .concat(userPublicSlice.middleware)

            // Private routes
            .concat(userPrivateSlice.middleware),
})

export type StoreState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// export const persistor = persistStore(store)
export default store
