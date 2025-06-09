import { publicService } from '@/services/api'
import { ResponseFormat } from '@/types/api'
import { createApi } from '@reduxjs/toolkit/query/react'

interface SigninPayload {
    email: string
    password: string
}

interface RequestResetPasswordPayload {
    email: string
}

interface ResetPasswordPayload {
    password: string
    confirmPassword: string
    token: string
}

export const authSlice = createApi({
    reducerPath: 'auth-public',
    baseQuery: publicService,
    endpoints: (builder) => ({
        signin: builder.mutation<ResponseFormat<undefined>, SigninPayload>({
            query: (data) => ({
                url: '/auth/signin',
                method: 'POST',
                body: data,
            }),
        }),
        signout: builder.query<ResponseFormat<undefined>, void>({
            query: () => ({
                url: '/auth/signout',
            }),
        }),
        requestResetPassword: builder.query<
            ResponseFormat<undefined>,
            RequestResetPasswordPayload
        >({
            query: (data) => ({
                url: '/auth/resetpassword/request',
                params: data,
            }),
        }),
        resetPassword: builder.mutation<
            ResponseFormat<undefined>,
            ResetPasswordPayload
        >({
            query: (data) => ({
                url: '/auth/resetpassword',
                method: 'POST',
                body: {
                    type: 'public',
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            }),
        }),
    }),
})

export const {
    useSigninMutation,
    useLazySignoutQuery,
    useLazyRequestResetPasswordQuery,
    useResetPasswordMutation,
} = authSlice
