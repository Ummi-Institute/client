import { setProfile } from '@/store/stateSlices/profileSlice'
import { updateAuthState } from '@/store/stateSlices/authSlice'
import { StoreState } from '@/store'
import { ResponseFormat } from '@/types/api'
import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    retry,
} from '@reduxjs/toolkit/query'

const baseQuery = retry(
    fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
        credentials: 'include',
    }),
    {
        maxRetries: 0,
    },
)

const isTokenExpiringSoon = (isoTimestamp: string): boolean => {
    const currentTime = Date.now()
    const tokenTime = Date.parse(isoTimestamp)
    const diffInSeconds = (currentTime - tokenTime) / 1000
    return (
        diffInSeconds >=
        (import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD_SECONDS || 3600)
    )
}

export const publicService: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, store, extraOptions) => {
    const result = await baseQuery(args, store, extraOptions)

    if (result.error?.status === 'FETCH_ERROR') {
        window.location.href = '/error'
    }

    return result
}

export const privateService: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, store, extraOptions) => {
    const { getState, dispatch } = store
    const state = getState() as StoreState

    const tokenTimestamp = state['auth-state'].timestamp

    if (tokenTimestamp && isTokenExpiringSoon(tokenTimestamp)) {
        try {
            const refreshResult = (await baseQuery(
                { url: '/auth/refresh', method: 'GET' },
                store,
                extraOptions,
            )) as {
                data: ResponseFormat<undefined> | undefined
                error?: FetchBaseQueryError
            }

            if (refreshResult.data) {
                dispatch(
                    updateAuthState({
                        timestamp: refreshResult.data.timestamp,
                        refreshFailed: false,
                    }),
                )
                return await baseQuery(args, store, extraOptions)
            }

            if (refreshResult.error?.status === 401) {
                dispatch(
                    updateAuthState({
                        timestamp: null,
                        refreshFailed: true,
                    }),
                )
                dispatch(setProfile(null))
                window.location.href = '/signin'
            }
        } catch (error) {
            dispatch(
                updateAuthState({
                    timestamp: null,
                    refreshFailed: true,
                }),
            )
            dispatch(setProfile(null))
        }
    }
    const result = await baseQuery(args, store, extraOptions)

    // if (result.error?.status === 'FETCH_ERROR') {
    //     window.location.href = '/error'
    // }

    return result
}
