import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

import theme from './styles/mantine/theme'
import store, { persistor } from './store'

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

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
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
        element: <SectionLayout />,
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
])

function App() {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <MantineProvider theme={theme}>
                        <Notifications limit={5} autoClose={3000} />
                        <Suspense fallback={<p>Loading</p>}>
                            <RouterProvider router={router} />
                        </Suspense>
                    </MantineProvider>
                </PersistGate>
            </Provider>
        </>
    )
}

export default App
