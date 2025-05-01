import Header from '@/components/header/Header'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const SectionLayout = () => {
    const urlLocation = useLocation()

    const hideBackgroundFor = ['/auditorium']
    const hideHeaderBackground = hideBackgroundFor.includes(
        urlLocation.pathname,
    )

    return (
        <>
            <Header
                hideBGColor={hideHeaderBackground}
                type="sectionLayoutHeader"
            />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default SectionLayout
