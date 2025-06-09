import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

import AuditoriumBackground from '@/assets/backgrounds/auditorium/auditorium_background.svg'
import { Flex, Group, rem } from '@mantine/core'
import styles from './Auditorium.module.css'
import { useViewportSize } from '@mantine/hooks'

const Auditorium = () => {
    const items = [
        {
            label: 'Letters',
            link: '/letters',
        },
        {
            label: 'Quranic Vocab',
            link: '/q_vocab',
        },
        {
            label: 'Quraan',
            link: '/quraan',
        },
        {
            label: "Du'aa",
            link: '/duaa',
        },
        {
            label: 'Vocabulary Coloring',
            link: '/vocab_coloring',
        },
        {
            label: 'Tracing (letters)',
            link: '/tracing',
        },
        {
            label: 'Makhraj Puzzle',
            link: '/puzzle',
        },
    ]

    // Split items into a two-dimensional array
    const rows = []
    const itemsPerRow = 2 // Change to 1 to have a single column per row
    for (let i = 0; i < items.length; i += itemsPerRow) {
        rows.push(items.slice(i, i + itemsPerRow))
    }

    //CHECK BROSWER SIZE
    const { width } = useViewportSize()
    const isMobile = width < 768

    return (
        <>
            <BackgroundImage src={AuditoriumBackground} />
            <Flex gap="md" className={styles.container}>
                <Group className={styles.box}>
                    {items.map((row, rowIndex) => (
                        <Link key={rowIndex} to={row.link}>
                            <BrandButton
                                variant="secondary"
                                size={isMobile ? 'sm' : 'lg'}
                                isGradient={true}
                                isPattern={true}
                                style={{
                                    fontFamily: 'Coiny',
                                    fontSize: isMobile ? '1.3em' : '2.5em',
                                    borderRadius: '40px',
                                    color: '#00005C',
                                }}
                                h={rem(70)}
                            >
                                {row.label}
                            </BrandButton>
                        </Link>
                    ))}
                </Group>
            </Flex>
        </>
    )
}

export default Auditorium
