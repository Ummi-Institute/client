import { createApi } from '@reduxjs/toolkit/query/react'

import { ResponseFormat } from '@/types/api'
import { User } from '@/types/user'
import { privateService } from '@/services/api'

interface UpdatePayload {
    firstName?: string
    lastName?: string
    email?: string
    info?: any
}
interface UpdateAvatarPayload {
    gender: 'boy' | 'girl'
    skinTone: string
    hairColor?: string
    hairStyle?: string
}

export const userSlice = createApi({
    reducerPath: 'user-private',
    baseQuery: privateService,
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        profile: builder.query<ResponseFormat<User>, void>({
            query: () => ({
                url: '/user/profile',
            }),
            keepUnusedDataFor: 0,
            providesTags: [{ type: 'Profile' }],
        }),
        updateUser: builder.mutation<ResponseFormat<undefined>, UpdatePayload>({
            query: (data) => ({
                url: `/user/update`,
                method: 'PATCH',
                body: data,
            }),
        }),
        updateAvatar: builder.mutation<
            ResponseFormat<undefined>,
            UpdateAvatarPayload
        >({
            query: (data) => ({
                url: `/user/update/avatar`,
                method: 'PATCH',
                body: data,
            }),
        }),
    }),
})

export const {
    useLazyProfileQuery,
    useProfileQuery,
    useUpdateUserMutation,
    useUpdateAvatarMutation,
} = userSlice
