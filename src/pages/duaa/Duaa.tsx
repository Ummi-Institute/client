import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'
import { useViewportSize } from '@mantine/hooks'

import DuaaBackground from '@/assets/backgrounds/auditorium/duaa.png'
import { Flex, Group, rem } from '@mantine/core'
import BulbIcon from '@/assets/icons/bulb'

import styles from './Duaa.module.css'
import { headerSlice } from '@/store/stateSlices/headerSlice'
import { useDispatch } from 'react-redux'

const Duaa = () => {
    const dispatch = useDispatch()
    //CHECK BROSWER SIZE
    const { width } = useViewportSize()
    const isMobile = width < 768

    dispatch(
        headerSlice.actions.setUpdateHeader({
            title: 'Duaa',
            subtitle: 'Learn about Duaa',
        }),
    )

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
                                        size={isMobile ? 'md' : 'lg'}
                                        isGradient={true}
                                        isPattern={true}
                                        style={{
                                            fontFamily: 'Coiny',
                                            fontSize: isMobile
                                                ? '1.5em'
                                                : '2.5em',
                                            borderRadius: '40px',
                                            color: '#00005C',
                                            width: isMobile ? '200px' : '400px',
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
