import { Flex, Group, rem } from '@mantine/core'

import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import styles from './Home.module.css'

import HomeBackground from '@/assets/backgrounds/home/home_background.svg'
import AuditoriumImage from '@/assets/home/auditorium.svg'
import TorritoriesImage from '@/assets/home/territoties.png'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

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
                p={rem(20)}
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
    return (
        <>
            <BackgroundImage src={HomeBackground} />
            <Flex
                gap={rem(66)}
                w={'100%'}
                align={'center'}
                justify={'center'}
                wrap="wrap"
                mb={rem(200)}
                mt={rem(100)}
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
                            width="416px"
                            height="288px"
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
                                fontSize: '2em',
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
                            width="416px"
                            height="288px"
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
                                fontSize: '2em',
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
