import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Box, Flex, Group, Image } from '@mantine/core'

import ColoringBackground from '@/assets/backgrounds/auditorium/coloringBakground.png' // Replace with the actual background path
import Image1 from '@/assets/coloring/1.svg'
import Image2 from '@/assets/coloring/2.svg'
import Image3 from '@/assets/coloring/3.svg'

import styles from './Coloring.module.css'

const Coloring = () => {
    const items = [
        { label: 'Vocabulary 1', value: '1', image: Image1 },
        { label: 'Vocabulary 1', value: '2', image: Image2 },
        { label: 'Vocabulary 1', value: '3', image: Image3 },
        { label: 'Vocabulary 1', value: '4', image: Image1 },
        { label: 'Vocabulary 1', value: '5', image: Image2 },
        { label: 'Vocabulary 1', value: '6', image: Image3 },
        { label: 'Vocabulary 1', value: '7', image: Image1 },
        { label: 'Vocabulary 1', value: '8', image: Image2 },
        { label: 'Vocabulary 1', value: '9', image: Image3 },
        { label: 'Vocabulary 1', value: '10', image: Image1 },
        { label: 'Vocabulary 1', value: '11', image: Image2 },
        { label: 'Vocabulary 1', value: '12', image: Image3 },
    ]
    return (
        <>
            <BackgroundImage src={ColoringBackground} />

            <Group
                w="100%"
                style={{
                    justifyContent: 'center',
                    marginTop: '50px',
                    flexDirection: 'column',
                }}
                className={styles.container}
            >
                <Group gap={30} className={styles.box}>
                    {items.map((item) => (
                        <Flex
                            key={item.value + 'key'}
                            justify={'center'}
                            align={'center'}
                            direction={'column'}
                            component="a"
                            href={`/vocab_coloring/${item.value}`}
                        >
                            <Box className={styles.itemImageBox}>
                                <Image src={item.image} />
                            </Box>
                            <BrandButton
                                variant="secondary"
                                style={{ borderRadius: 20 }}
                                w={200}
                            >
                                {item.label}
                            </BrandButton>
                        </Flex>
                    ))}
                </Group>
            </Group>
        </>
    )
}

export default Coloring
