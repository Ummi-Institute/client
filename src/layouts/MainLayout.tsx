import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const MainLayout = () => {
    const urlLocation = useLocation()

    const hideBackgroundFor = ['/auditorium']
    const hideHeaderBackground = hideBackgroundFor.includes(
        urlLocation.pathname,
    )

    const hideFooterFor = ['/auditorium']
    const hideFooter = hideFooterFor.includes(urlLocation.pathname)

    return (
        <>
            <Header hideBGColor={hideHeaderBackground} />
            <main>
                <Outlet />
            </main>
            <Footer hide={hideFooter} />
        </>
    )
}

export default MainLayout
