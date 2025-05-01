import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

import DuaaBackground from '@/assets/backgrounds/auditorium/duaa.png'
import { Flex, Group, rem } from '@mantine/core'
import BulbIcon from '@/assets/icons/bulb'

const Duaa = () => {
    const items = [
        {
            label: `Du'aa 1`,
            link: '/duaa/1',
        },
        {
            label: `Du'aa 2`,
            link: '/duaa/2',
        },
        {
            label: `Du'aa 3`,
            link: '/duaa/3',
        },
        {
            label: `Du'aa 4`,
            link: '/duaa/4',
        },
        {
            label: `Du'aa 5`,
            link: '/duaa/5',
        },
        {
            label: `Du'aa 6`,
            link: '/duaa/6',
        },
        {
            label: `Du'aa 7`,
            link: '/duaa/7',
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
            <BackgroundImage src={DuaaBackground} />
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

export default Duaa
