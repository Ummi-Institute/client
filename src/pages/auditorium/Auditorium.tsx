import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

import AuditoriumBackground from '@/assets/backgrounds/auditorium/auditorium_background.svg'
import { Center, Flex, Group, rem } from '@mantine/core'

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

    return (
        <>
            <BackgroundImage src={AuditoriumBackground} />
            <Center w={'100%'}>
                <Flex
                    direction="column"
                    gap="md"
                    style={{ maxWidth: '1000px' }}
                    mb={rem(200)}
                    mt={rem(100)}
                >
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
                                        size="lg"
                                        isGradient={true}
                                        isPattern={true}
                                        style={{
                                            fontFamily: 'Coiny',
                                            fontSize: '2.5em',
                                            borderRadius: '40px',
                                            color: '#00005C',
                                        }}
                                        h={rem(70)}
                                    >
                                        {item.label}
                                    </BrandButton>
                                </Link>
                            ))}
                        </Group>
                    ))}
                </Flex>
            </Center>
        </>
    )
}

export default Auditorium
