import { FC, ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { StoreState } from '@/store'
import { useLazyProfileQuery } from '@/store/apiSlices/private/userSlice'

interface PrivateRouteProps {
    children: ReactNode
}

const PublicAuthRoute: FC<PrivateRouteProps> = ({ children }) => {
    const [getProfile, { isLoading, isSuccess }] = useLazyProfileQuery()

    const timestamp = useSelector(
        (state: StoreState) => state['auth-state'].timestamp,
    )

    useEffect(() => {
        if (timestamp) {
            getProfile()
        }
    }, [timestamp, getProfile])

    if (isLoading) {
        return null
    }

    if (isSuccess && !isLoading) {
        return <Navigate to="/" />
    }

    return children
}

export default PublicAuthRoute
