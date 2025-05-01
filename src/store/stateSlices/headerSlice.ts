import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FormState {
    title: string
    subtitle: string
}

const initialState: FormState = {
    title: '',
    subtitle: '',
}

export const headerSlice = createSlice({
    name: 'header-states',
    initialState,
    reducers: {
        setUpdateHeader(
            state,
            action: PayloadAction<{
                title: string
                subtitle: string
            }>,
        ) {
            const { title, subtitle } = action.payload
            state.title = title
            state.subtitle = subtitle
        },
    },
})

export const { setUpdateHeader } = headerSlice.actions
