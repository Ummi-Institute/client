// Note: BackgroundImage component

import { Group } from '@mantine/core'

interface BackgroundImageProps {
    src: string
    children?: React.ReactNode
    opacity?: number
}
const BackgroundImage = ({ src, children, opacity }: BackgroundImageProps) => {
    return (
        <>
            <Group
                component={'div'}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    height: '100vh',
                    width: '100vw',
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    ...(opacity ? { opacity } : {}),
                }}
            >
                {children}
            </Group>
        </>
    )
}

export default BackgroundImage
