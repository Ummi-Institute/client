import { FC, ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setProfile } from '@/store/stateSlices/profileSlice'
import { useProfileQuery } from '@/store/apiSlices/private/userSlice'
import { StoreState } from '@/store'

interface PrivateRouteProps {
    children: ReactNode
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const { data: profile, isLoading, isError, refetch } = useProfileQuery()
    const authState = useSelector((state: StoreState) => state['auth-state'])
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        refetch()
    }, [location.pathname, refetch])

    useEffect(() => {
        if (profile?.data) {
            dispatch(setProfile(profile.data))
        } else {
            dispatch(setProfile(null))
        }
    }, [profile, isLoading, dispatch])

    if (isLoading) {
        return null
    }

    if (isError || authState.refreshFailed) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default PrivateRoute
