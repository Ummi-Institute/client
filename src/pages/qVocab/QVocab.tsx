import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

import QVocabBackground from '@/assets/backgrounds/auditorium/q_vocab.svg'
import { Flex, Group, rem } from '@mantine/core'

const QVocab = () => {
    const items = [
        {
            label: 'Animals',
            link: '/animals',
        },
        {
            label: 'Prepositions',
            link: '/prepositions',
        },
        {
            label: 'Health',
            link: '/health',
        },
        {
            label: 'Pronouns',
            link: '/pronouns',
        },
        {
            label: 'Future',
            link: '/future',
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
            <BackgroundImage src={QVocabBackground} />
            <Group
                w={'100%'}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '50px',
                }}
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
                                        isGradient={true}
                                        isPattern={true}
                                        style={{
                                            fontFamily: 'Coiny',
                                            fontSize: '2.5em',
                                            borderRadius: '40px',
                                            color: '#00005C',
                                            width: '400px',
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
            </Group>
        </>
    )
}

export default QVocab
