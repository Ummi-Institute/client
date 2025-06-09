import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'
import { useViewportSize } from '@mantine/hooks'

import PuzzleBackground from '@/assets/backgrounds/auditorium/puzzle.png' // Replace with the actual background path
import { Flex, Group, rem } from '@mantine/core'
import BulbIcon from '@/assets/icons/bulb'
import styles from './Puzzle.module.css'
import { useDispatch } from 'react-redux'
import { headerSlice } from '@/store/stateSlices/headerSlice'

const Puzzle = () => {
    const dispatch = useDispatch()
    dispatch(
        headerSlice.actions.setUpdateHeader({
            title: 'Puzzle',
            subtitle: 'Learn Arabic letters by solving puzzles',
        }),
    )
    //CHECK BROSWER SIZE
    const { width } = useViewportSize()
    const isMobile = width < 768
    const items = [
        { label: 'Makhraj puzzle 1', link: '/puzzle/1' },
        { label: 'Makhraj puzzle 2', link: '/puzzle/2' },
        { label: 'Makhraj puzzle 3', link: '/puzzle/3' },
        { label: 'Makhraj puzzle 4', link: '/puzzle/4' },
        { label: 'Makhraj puzzle 5', link: '/puzzle/5' },
        { label: 'Makhraj puzzle 6', link: '/puzzle/6' },
        { label: 'Makhraj puzzle 7', link: '/puzzle/7' },
    ]

    const rows = []
    const itemsPerRow = 2
    for (let i = 0; i < items.length; i += itemsPerRow) {
        rows.push(items.slice(i, i + itemsPerRow))
    }

    return (
        <>
            <BackgroundImage src={PuzzleBackground} />

            <Group className={styles.container}>
                <Flex direction="column" gap="md" mt={rem(40)}>
                    {rows.map((row, rowIndex) => (
                        <Group
                            key={rowIndex}
                            justify={
                                row.length >= 2 ? 'space-between' : 'center'
                            }
                            align="flex-end"
                            mt={rem(20)}
                        >
                            {row.map((item, itemIndex) => (
                                <Link key={itemIndex} to={item.link}>
                                    <BrandButton
                                        variant="secondary"
                                        size="xl"
                                        isGradient
                                        isPattern
                                        style={{
                                            fontFamily: 'Coiny',
                                            fontSize: isMobile
                                                ? '1.3rem'
                                                : '2rem',
                                            borderRadius: '40px',
                                            color: '#00005C',
                                            width: isMobile ? '220px' : '400px',
                                        }}
                                        h={rem(70)}
                                        rightSection={
                                            <BulbIcon
                                                style={{
                                                    width: '22px',
                                                    fill: 'white',
                                                    marginLeft: '20px',
                                                }}
                                            />
                                        }
                                    >
                                        {isMobile
                                            ? `Puzzle ${
                                                  itemIndex + rowIndex * 2 + 1
                                              }`
                                            : item.label}
                                    </BrandButton>
                                </Link>
                            ))}
                        </Group>
                    ))}
                </Flex>
            </Group>
        </>
    )
}

export default Puzzle
