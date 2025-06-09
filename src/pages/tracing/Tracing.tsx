import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'

import TracingBackground from '@/assets/backgrounds/auditorium/tracing_bg.png' // Replace with the actual background path
import TracerBackground from '@/assets/backgrounds/auditorium/tracerBg.png'
import { Box, Flex, Group, Select } from '@mantine/core'
import styles from './Tracing.module.css'
import LetterTracer from './letterTracer/LetterTracer'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { headerSlice } from '@/store/stateSlices/headerSlice'

// Arabic alphabet letters (28 letters)
const defaultLetters = [
    'ا',
    'ب',
    'ت',
    'ث',
    'ج',
    'ح',
    'خ',
    'د',
    'ذ',
    'ر',
    'ز',
    'س',
    'ش',
    'ص',
    'ض',
    'ط',
    'ظ',
    'ع',
    'غ',
    'ف',
    'ق',
    'ك',
    'ل',
    'م',
    'ن',
    'ه',
    'و',
    'ي',
]
const defaultColors = [
    '#000000',
    '#FF0000',
    '#0000FF',
    '#008000',
    '#FFFF00',
    '#FFA500',
    '#800080',
]

const Tracing = () => {
    const dispatch = useDispatch()
    dispatch(
        headerSlice.actions.setUpdateHeader({
            title: 'Tracing',
            subtitle: 'Learn Arabic letters by tracing',
        }),
    )
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedColor, setSelectedColor] = useState(defaultColors[0])

    const handlePrev = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1
            setCurrentIndex(newIndex)
        }
    }

    const handleNext = () => {
        if (currentIndex < defaultLetters.length - 1) {
            const newIndex = currentIndex + 1
            setCurrentIndex(newIndex)
        }
    }

    // const handleClear = () => {}

    const handleColorChange = (color: string) => {
        setSelectedColor(color)
    }
    const handleLetterChange = (value: any) => {
        const index = defaultLetters.indexOf(value)
        setCurrentIndex(index)
    }

    return (
        <>
            <BackgroundImage src={TracingBackground} />

            <Group
                w="100%"
                style={{
                    justifyContent: 'center',
                    marginTop: '50px',
                    flexDirection: 'column',
                }}
                className={styles.container}
            >
                <Flex justify={'space-between'} className={styles.pagHeader}>
                    <BrandButton
                        variant="secondary"
                        style={{ borderRadius: 50 }}
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        Prevoius
                    </BrandButton>
                    <Select
                        data={defaultLetters}
                        value={defaultLetters[currentIndex]}
                        onChange={handleLetterChange}
                        radius="md"
                        styles={{
                            input: {
                                borderColor: '#7048e8',
                                color: '#7048e8',
                                backgroundColor: '#f9f9ff',
                                fontWeight: 600,
                                borderRadius: '4px',
                            },
                            dropdown: {
                                borderColor: '#7048e8',
                                borderRadius: '4px',
                            },
                        }}
                        w={'60%'}
                    />
                    <BrandButton
                        variant="secondary"
                        style={{ borderRadius: 50 }}
                        onClick={handleNext}
                        disabled={currentIndex === defaultLetters.length - 1}
                    >
                        Next
                    </BrandButton>
                </Flex>
                <Box
                    className={styles.box}
                    style={{
                        backgroundImage: `url(${TracerBackground})`,
                        backgroundSize: 'cover',
                    }}
                >
                    <LetterTracer
                        color={selectedColor}
                        letter={defaultLetters[currentIndex]}
                    />
                    <div
                        style={{
                            marginTop: 15,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 10,
                        }}
                    >
                        {defaultColors.map((col) => (
                            <div
                                key={col}
                                onClick={() => handleColorChange(col)}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    backgroundColor: col,
                                    cursor: 'pointer',
                                    border:
                                        col === selectedColor
                                            ? '2px solid #000'
                                            : '2px solid #fff',
                                }}
                            />
                        ))}
                    </div>
                </Box>
            </Group>
        </>
    )
}

export default Tracing
