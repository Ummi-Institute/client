import { configureStore } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

import { headerSlice } from './stateSlices/headerSlice'

const store = configureStore({
    reducer: {
        // States
        [headerSlice.reducerPath]: headerSlice.reducer,
    },
})

export type StoreState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
export default store
