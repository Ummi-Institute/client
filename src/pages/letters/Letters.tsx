import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import BrandButton from '@/components/brandButton/BrandButton'
import { Box, Button, Card, Flex, Image, Text, Title } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

import styles from './Letters.module.css'
import LetterBackground from '@/assets/backgrounds/auditorium/letters_background.svg'
import SpeakerIcon from '@/assets/icons/speaker'
import ReplayIcon from '@/assets/icons/replay'
import PauseIcon from '@/assets/icons/pause'
import MouthImage from '@/assets/letters/mouth.png'
import myVideo from '@/assets/letters/videos/1.mp4'
import LettersList from '@/json/letters.json'
import SukoonList from '@/json/sukoon.json'
import Vowels from '@/json/vowels.json'

interface VideoSectionProp {
    videoSrc?: string
}

const VideoSection = ({ videoSrc }: VideoSectionProp) => {
    const [isPlaying, setPlaying] = useState(false)

    const videoElem = useRef<HTMLVideoElement>(null)

    const playVideo = () => {
        const videoElement = videoElem.current as HTMLVideoElement
        videoElement.play()
        setPlaying(true)
    }

    const handleVideoEnd = () => {
        setPlaying(false)
    }

    useEffect(() => {
        const videoElement = videoElem.current as HTMLVideoElement
        videoElement.addEventListener('ended', handleVideoEnd)
        return () => {
            videoElement.removeEventListener('ended', handleVideoEnd)
        }
    }, [])

    return (
        <>
            <Box className={styles.videoPlayer}>
                <video
                    controlsList="nodownload"
                    disablePictureInPicture
                    disableRemotePlayback
                    ref={videoElem}
                    className={styles.videoDisplay}
                >
                    <source src={videoSrc} type="video/mp4"></source>
                </video>
                <Flex
                    h={'100%'}
                    w={'100%'}
                    direction={'column'}
                    align={'start'}
                    justify={'space-between'}
                >
                    <Button
                        variant="gradient"
                        gradient={{
                            from: '#FFFF',
                            to: '#D0D0D0',
                            deg: 90,
                        }}
                        style={{
                            border: '1px solid white',
                            borderRadius: 50,
                            fontSize: '8px',
                        }}
                        c="#00005C"
                        h={'30px'}
                    >
                        <SpeakerIcon
                            style={{
                                marginRight: 5,
                                width: '30px',
                                height: '30px',
                            }}
                        />{' '}
                        Alif is for Allaah; He is our Creator!
                    </Button>
                    <Flex justify={'space-between'} align={'center'} w={'100%'}>
                        <Image w={100} src={MouthImage} style={{ zIndex: 1 }} />
                        <BrandButton
                            variant={isPlaying ? 'secondary' : 'primary'}
                            disabled={isPlaying}
                            borderWidth={3}
                            isGradient
                            style={{
                                borderRadius: '50px',
                            }}
                            onClick={() => playVideo()}
                        >
                            {isPlaying ? (
                                <PauseIcon
                                    style={{
                                        width: '22px',
                                        fill: 'white',
                                    }}
                                />
                            ) : (
                                <ReplayIcon
                                    style={{
                                        width: '22px',
                                        fill: 'white',
                                    }}
                                />
                            )}
                        </BrandButton>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

interface LetterData {
    label: string
    name: string
    value: number
    short_vowels: {
        fatha: string
        kasrah: string
        damma: string
    }
    long_vowels: {
        fatha: string
        kasrah: string
        damma: string
    }
    pronunciation: {
        short: {
            fatha: string
            kasrah: string
            damma: string
        }
        long: {
            fatha: string
            kasrah: string
            damma: string
        }
    }
    examples: {
        short: {
            fatha: string
            kasrah: string
            damma: string
        }
        long: {
            fatha: string
            kasrah: string
            damma: string
        }
    }
    meanings: {
        short: {
            fatha: string
            kasrah: string
            damma: string
        }
        long: {
            fatha: string
            kasrah: string
            damma: string
        }
    }
}

// Props for the VowelDisplay component
interface VowelDisplayProps {
    letterData: LetterData
    vowelType: 'Short' | 'Long'
}

const VowelDisplay: React.FC<VowelDisplayProps> = ({
    letterData,
    vowelType,
}) => {
    if (!letterData) return null

    const { pronunciation, examples, meanings } = letterData

    // Helper function to render vowel data
    const renderVowelData = (
        vowelData: Record<string, string>,
        pronunciationData: Record<string, string>,
        exampleData: Record<string, string>,
        meaningData: Record<string, string>,
    ) => {
        return (
            <Box mb="xl">
                <Flex
                    display={'flex'}
                    style={{
                        flexDirection: 'row-reverse',
                        fontFamily: 'Catamaran',
                    }}
                    justify={'center'}
                    wrap={'wrap'}
                    w={'100%'}
                >
                    {Object.entries(vowelData).map(([key, value]) => (
                        <Box key={key} m={10}>
                            <Card
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                                className={styles.formBtn}
                                style={{
                                    minWidth: '200px',
                                }}
                            >
                                <Title order={4} c="indigo">
                                    {key.toUpperCase()}
                                </Title>
                                <Text
                                    size="xl"
                                    my="sm"
                                    c="#6829b3"
                                    style={{
                                        fontSize: '80px',
                                    }}
                                >
                                    {value}
                                </Text>
                                <Text size="xl" color="dimmed">
                                    <strong>P:</strong> {pronunciationData[key]}
                                </Text>
                                <Text size="xl" color="dimmed">
                                    <strong>E:</strong> {exampleData[key]}
                                </Text>
                                <Text size="xl" color="dimmed">
                                    <strong>M:</strong> {meaningData[key]}
                                </Text>
                            </Card>
                        </Box>
                    ))}
                </Flex>
                <Text size="xs" color="gray" mt="xs">
                    <em>
                        Tip: "Pronunciation" is how you say it, "Example" is a
                        word that uses it, and "Meaning" is what the example
                        word means!
                    </em>
                </Text>
            </Box>
        )
    }

    return (
        <Box p="md">
            {/* Short Vowels */}
            {renderVowelData(
                vowelType === 'Short'
                    ? letterData.short_vowels
                    : letterData.long_vowels,
                vowelType === 'Short'
                    ? pronunciation.short
                    : pronunciation.long,
                vowelType === 'Short' ? examples.short : examples.long,
                vowelType === 'Short' ? meanings.short : meanings.long,
            )}
        </Box>
    )
}

interface LetterOptionFormProps {
    option: string
    letter: number
}
const LetterOptionForm = ({ option, letter }: LetterOptionFormProps) => {
    if (!option || !letter) return <div>Choose a letter!</div>

    try {
        if (option == 'sukoon') {
            const letterForm = SukoonList.find((value) => value.value == letter)
            if (!letterForm) throw new Error('Letter form is not available')

            return (
                <>
                    <div className={styles.letterOptionFormContainer}>
                        <Flex
                            justify="space-evenly"
                            align="center"
                            w={'100%'}
                            wrap={'wrap'}
                        >
                            <Box className={styles.formBtn}>
                                <div className={styles.letterName}>
                                    {letterForm.name}
                                </div>
                            </Box>
                            <Box className={styles.formBtn}>
                                <div className={styles.letterSukoon}>
                                    {letterForm.sukoon}
                                </div>
                            </Box>
                            <Box>
                                <div className={styles.letterExample}>
                                    {letterForm.example}
                                </div>
                                <div className={styles.letterMeaning}>
                                    {letterForm.meaning}
                                </div>
                            </Box>
                        </Flex>
                    </div>
                </>
            )
        } else if (option == 'shortvowel') {
            const letterForm = Vowels.find((value) => value.value == letter)
            if (!letterForm) throw new Error('Letter form is not available')

            return <VowelDisplay letterData={letterForm} vowelType="Short" />
        } else if (option == 'longvowel') {
            const letterForm = Vowels.find((value) => value.value == letter)
            if (!letterForm) throw new Error('Letter form is not available')

            return <VowelDisplay letterData={letterForm} vowelType="Long" />
        }
    } catch (error) {
        console.log(error)
        return <div>Something went wrong! Refresh this page</div>
    }
}

interface LettersProp {
    label: string
    value: number
}

const Letters = () => {
    const [videoSrc] = useState(myVideo)
    const [activeOption, setActiveOption] = useState('letter')
    const [activeLetter, setActiveLetter] = useState(0)

    const onChangeOption = (value: string) => {
        setActiveOption(value)
    }
    const onChangeLetter = (value: number) => {
        setActiveLetter(value)
    }

    const options = [
        {
            label: 'Letter',
            value: 'letter',
        },
        {
            label: 'Short vowel',
            value: 'shortvowel',
        },
        {
            label: 'Long vowel',
            value: 'longvowel',
        },
        {
            label: 'Tanween',
            value: 'tanween',
        },
        {
            label: 'Sukoon',
            value: 'sukoon',
        },
        {
            label: 'Shaddah',
            value: 'shaddah',
        },
    ]

    const OptionsElements = ({
        options,
    }: {
        options: { label: string; value: string }[]
    }) => {
        return (
            <>
                {options.map((option) => (
                    <BrandButton
                        key={option.value}
                        borderWidth={2}
                        style={{
                            borderRadius: 20,
                            boxShadow: '1px 3px 10px #04040433',
                            fontFamily: 'Coiny',
                        }}
                        variant={
                            activeOption == option.value
                                ? 'secondary'
                                : 'primary'
                        }
                        onClick={() => onChangeOption(option.value)}
                    >
                        {option.label}
                    </BrandButton>
                ))}
            </>
        )
    }

    const LettersElements = ({ letters }: { letters: LettersProp[] }) => {
        return (
            <>
                {letters.map((letter) => (
                    <Button
                        key={letter.value}
                        p={10}
                        className={
                            (activeOption != 'letter' && activeLetter
                                ? styles.letterBtnRow
                                : styles.letterBtnGrid) +
                            ' ' +
                            `${
                                activeLetter == letter.value
                                    ? styles.activeLetterBtn
                                    : ''
                            }`
                        }
                        onClick={() => onChangeLetter(letter.value)}
                    >
                        {letter.label}
                    </Button>
                ))}
            </>
        )
    }

    // useEffect(() => {
    //     const fetchVideo = async () => {
    //         const videoData = await fetch('')
    //         const response = await videoData.json()
    //         setVideoSrc(response.src)
    //         console.log(response, 'src')
    //     }
    //     // fetchVideo()
    // }, [])

    return (
        <>
            <BackgroundImage src={LetterBackground} />
            <Flex
                className={styles.container}
                justify="center"
                align="flex-start"
                wrap={'wrap'}
                gap={40}
            >
                <Flex className={styles.leftSection}>
                    <VideoSection videoSrc={videoSrc} />
                </Flex>
                <Box className={styles.rightSection}>
                    <Flex
                        gap={10}
                        justify={'center'}
                        align={'center'}
                        w={'100%'}
                        wrap={'wrap'}
                    >
                        <OptionsElements options={options} />
                    </Flex>
                    <Flex
                        className={
                            activeOption != 'letter' && activeLetter
                                ? styles.lettersRow
                                : styles.lettersGrid
                        }
                        mt={50}
                        gap={20}
                    >
                        <LettersElements
                            letters={LettersList as LettersProp[]}
                        />
                    </Flex>
                    {activeOption != 'letter' && activeLetter && (
                        <>
                            <Flex className={styles.optionFormContainer}>
                                <Title
                                    component={'label'}
                                    mb="md"
                                    size={'lg'}
                                    style={{
                                        fontWeight: 'normal',
                                    }}
                                >
                                    {options.find(
                                        (option) =>
                                            option.value == activeOption,
                                    )
                                        ? options.find(
                                              (option) =>
                                                  option.value == activeOption,
                                          )?.label
                                        : ''}
                                </Title>
                                <LetterOptionForm
                                    letter={activeLetter}
                                    option={activeOption}
                                />
                                <Text
                                    component="label"
                                    style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        fontFamily: 'Catamaran',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <SpeakerIcon
                                        style={{
                                            marginRight: 5,
                                            width: '30px',
                                            height: '30px',
                                        }}
                                    />
                                    Click on form to hear it's sound
                                </Text>
                            </Flex>
                        </>
                    )}
                </Box>
            </Flex>
        </>
    )
}

export default Letters
