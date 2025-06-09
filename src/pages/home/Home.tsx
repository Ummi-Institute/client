import { Flex, Group, rem } from '@mantine/core'

import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import styles from './Home.module.css'

import HomeBackground from '@/assets/backgrounds/home/home_background.svg'
import AuditoriumImage from '@/assets/home/auditorium.svg'
import TorritoriesImage from '@/assets/home/territoties.png'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'
import { useViewportSize } from '@mantine/hooks'

interface SectionsImageProps {
    gradient?: {
        from: string
        to: string
        deg?: number
    }
    imageSrc: string
    width: string
    height: string
}
const SectionImage = ({
    gradient,
    imageSrc,
    width,
    height,
}: SectionsImageProps) => {
    return (
        <>
            <Group
                w={width}
                h={height}
                style={{
                    background: `linear-gradient(${gradient?.deg}deg, ${gradient?.from}, ${gradient?.to})`,
                }}
                p={20}
                className={styles.box}
            >
                <Group
                    component={'div'}
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: 'cover',
                    }}
                />
            </Group>
        </>
    )
}

const Home = () => {
    //CHECK BROSWER SIZE
    const { width } = useViewportSize()
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    return (
        <>
            <BackgroundImage src={HomeBackground} />
            <Flex
                align={'center'}
                justify={'space-evenly'}
                wrap="wrap"
                className={styles.container}
                gap={20}
            >
                <Link to={'/auditorium'}>
                    <Flex
                        align={'center'}
                        justify={'center'}
                        direction={'column'}
                        gap={rem(23)}
                    >
                        <SectionImage
                            imageSrc={AuditoriumImage}
                            width={
                                isMobile
                                    ? '300px'
                                    : isTablet
                                    ? '376px'
                                    : '376px'
                            }
                            height={
                                isMobile
                                    ? '200px'
                                    : isTablet
                                    ? '248px'
                                    : '248px'
                            }
                            gradient={{
                                from: '#FFCC33',
                                to: '#FFB347',
                                deg: 180,
                            }}
                        />
                        <BrandButton
                            variant="secondary"
                            size="lg"
                            w={'100%'}
                            isGradient={true}
                            style={{
                                fontFamily: 'Coiny',
                                fontSize: isMobile ? '1em' : '1.5em',
                                borderRadius: '40px',
                            }}
                        >
                            Arabic Auditorium
                        </BrandButton>
                    </Flex>
                </Link>

                <Link to={'torritories'}>
                    <Flex
                        align={'center'}
                        justify={'center'}
                        direction={'column'}
                        gap={rem(23)}
                    >
                        <SectionImage
                            imageSrc={TorritoriesImage}
                            width={
                                isMobile
                                    ? '300px'
                                    : isTablet
                                    ? '376px'
                                    : '376px'
                            }
                            height={
                                isMobile
                                    ? '200px'
                                    : isTablet
                                    ? '248px'
                                    : '248px'
                            }
                            gradient={{
                                from: '#8D2EFF',
                                to: '#6829B3',
                                deg: 180,
                            }}
                        />

                        <BrandButton
                            variant="primary"
                            size="lg"
                            w={'100%'}
                            isGradient={true}
                            style={{
                                fontFamily: 'Coiny',
                                fontSize: isMobile ? '1em' : '1.5em',
                                borderRadius: '40px',
                            }}
                        >
                            Makhaarij Territories
                        </BrandButton>
                    </Flex>
                </Link>
            </Flex>
        </>
    )
}

export default Home
