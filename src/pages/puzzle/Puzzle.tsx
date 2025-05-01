import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

import PuzzleBackground from '@/assets/backgrounds/auditorium/puzzle.png' // Replace with the actual background path
import { Flex, Group, rem } from '@mantine/core'
import BulbIcon from '@/assets/icons/bulb'

const Puzzle = () => {
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

            <Group
                w="100%"
                style={{ justifyContent: 'center', marginTop: '50px' }}
            >
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
                                            fontSize: '2.2em',
                                            borderRadius: '40px',
                                            color: '#00005C',
                                            width: '450px',
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
                                        {item.label}
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
