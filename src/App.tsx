import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Provider } from 'react-redux'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

import theme from './styles/mantine/theme'
import store from './store'

import Home from '@/pages/home/Home'
import MainLayout from './layouts/MainLayout'
import Social from './pages/social/Social'
import Auditorium from './pages/auditorium/Auditorium'
import SectionLayout from './layouts/SectionLayout'
import Letters from './pages/letters/Letters'
import QVocab from './pages/qVocab/QVocab'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Animals from './pages/animals/Animals'
import Duaa from './pages/duaa/Duaa'
import ReadDuaa from './pages/duaa/read/ReadDuaa'
import Puzzle from './pages/puzzle/Puzzle'
import Puzzlegame from './pages/puzzle/game/Puzzlegame'
import Tracing from './pages/tracing/Tracing'
import Coloring from './pages/coloring/Coloring'
import ColoringGame from './pages/coloring/game/ColoringGame'
import Profile from './pages/profile/Profile'

import PrivateRoute from './hocs/privateRoute'
import PublicRoute from './hocs/publicRoute'
import PublicAuthRoute from './hocs/publicAuthRoute'

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: (
                <PublicRoute>
                    <MainLayout />
                </PublicRoute>
            ),
            children: [
                {
                    path: '/',
                    element: <Home />,
                },
                {
                    path: '/social',
                    element: <Social />,
                },
                {
                    path: '/auditorium',
                    element: <Auditorium />,
                },
            ],
        },
        {
            element: (
                <PublicAuthRoute>
                    <MainLayout />
                </PublicAuthRoute>
            ),
            children: [
                {
                    path: '/login',
                    element: <Login />,
                },
                {
                    path: '/register',
                    element: <Register />,
                },
            ],
        },
        {
            element: (
                <PrivateRoute>
                    <MainLayout />
                </PrivateRoute>
            ),
            children: [
                {
                    path: '/profile',
                    element: <Profile />,
                },
            ],
        },
        {
            element: (
                <PublicRoute>
                    <SectionLayout />
                </PublicRoute>
            ),
            children: [
                {
                    path: '/letters',
                    element: <Letters />,
                },
                {
                    path: '/q_vocab',
                    element: <QVocab />,
                },
                {
                    path: '/animals',
                    element: <Animals />,
                },
                {
                    path: '/duaa',
                    element: <Duaa />,
                },
                {
                    path: '/duaa/:id',
                    element: <ReadDuaa />,
                },
                {
                    path: '/puzzle',
                    element: <Puzzle />,
                },
                {
                    path: '/puzzle/:id',
                    element: <Puzzlegame />,
                },
                {
                    path: '/tracing',
                    element: <Tracing />,
                },
                {
                    path: '/vocab_coloring',
                    element: <Coloring />,
                },
                {
                    path: '/vocab_coloring/:id',
                    element: <ColoringGame />,
                },
            ],
        },
    ],
    { basename: '/client' },
)

function App() {
    return (
        <>
            <Provider store={store}>
                <MantineProvider theme={theme}>
                    <Notifications limit={5} autoClose={3000} />
                    <Suspense fallback={<p>Loading</p>}>
                        <RouterProvider router={router} />
                    </Suspense>
                </MantineProvider>
            </Provider>
        </>
    )
}

export default App
