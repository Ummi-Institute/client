import { createApi } from '@reduxjs/toolkit/query/react'

import { ResponseFormat } from '@/types/api'
import { publicService } from '@/services/api'

interface CreateUserPayload {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

export const userSlice = createApi({
    reducerPath: 'user-public',
    baseQuery: publicService,
    endpoints: (builder) => ({
        createUser: builder.mutation<ResponseFormat<string>, CreateUserPayload>(
            {
                query: (data) => ({
                    url: '/user/create',
                    method: 'POST',
                    body: {
                        ...data,
                    },
                }),
            },
        ),
    }),
})

export const { useCreateUserMutation } = userSlice
