import { FC, ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProfile } from '@/store/stateSlices/profileSlice'
import { StoreState } from '@/store'
import { useProfileQuery } from '@/store/apiSlices/private/userSlice'

interface PrivateRouteProps {
    children: ReactNode
}

const PublicRoute: FC<PrivateRouteProps> = ({ children }) => {
    const dispatch = useDispatch()
    const { data: profile, isLoading, refetch } = useProfileQuery()

    const timestamp = useSelector(
        (state: StoreState) => state['auth-state'].timestamp,
    )

    useEffect(() => {
        if (timestamp) {
            refetch()
        }
    }, [timestamp, refetch])

    useEffect(() => {
        if (profile?.data) {
            dispatch(setProfile(profile.data))
        } else {
            dispatch(setProfile(null))
        }
    }, [profile, isLoading, dispatch])

    return children
}

export default PublicRoute
