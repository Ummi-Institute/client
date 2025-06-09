import { useState, useRef } from 'react'
import { Howl } from 'howler'
import styles from './ReadDuaa.module.css'
import { Group, rem, Flex, Title, Text, Box, Tabs, Slider } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import Background from '@/assets/backgrounds/universal.svg'
import BrandButton from '@/components/brandButton/BrandButton'
import IconPlayerPlay from '@/assets/icons/play'
import IconMicrophone from '@/assets/icons/microphone'

// Audio
import Duaa2 from '@/assets/audio/duaa/dua 2.opus'
import { headerSlice } from '@/store/stateSlices/headerSlice'
import { useDispatch } from 'react-redux'
const duaaText = 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ'

const ReadDuaa = () => {
    const dispatch = useDispatch()

    dispatch(
        headerSlice.actions.setUpdateHeader({
            title: 'Duaa 2',
            subtitle: 'Learn about this Duaa and its meaning',
        }),
    )

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [sliderMax, setSliderMax] = useState(100)
    const [isRecording, setIsRecording] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [recordingStartTime, setRecordingStartTime] = useState<number>(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const audio = useRef<Howl | null>(null)

    const handlePlay = () => {
        if (!audio.current) {
            audio.current = new Howl({
                src: [Duaa2],
                html5: true,
                onplay: () => {
                    setIsPlaying(true)
                    setSliderMax(audio.current?.duration() || 0)
                },
                onend: () => {
                    setIsPlaying(false)
                    setProgress(0)
                },
                onstop: () => {
                    setIsPlaying(false)
                    setProgress(0)
                },
            })
        }

        if (isPlaying) {
            audio.current.stop()
        } else {
            audio.current.play()
            const interval = setInterval(() => {
                if (audio.current?.playing()) {
                    setProgress(audio.current.seek() as number)
                } else {
                    clearInterval(interval)
                }
            }, 100)
        }
    }

    const handleSliderChange = (value: number) => {
        if (audio.current) {
            audio.current.seek(value)
            setProgress(value)
        }
    }

    const handleStartRecording = async () => {
        setIsRecording(true)
        setRecordingStartTime(Date.now())

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        })
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
            setAudioUrl(URL.createObjectURL(blob))
            setIsRecording(false)
        }

        mediaRecorder.start()
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
        }
    }

    const handlePlayRecord = () => {
        if (audioUrl) {
            audioRef.current?.play()
        }
    }

    return (
        <>
            <BackgroundImage src={Background} opacity={0.2} />
            <Flex
                className={styles.container}
                justify="center"
                align="center"
                direction="column"
                gap={20}
                p={rem(20)}
            >
                <Group bg="#fff" className={styles.box}>
                    <Title order={1} size={30} c={'#151965'}>
                        <span className={styles.title}>Du’aa 2</span>
                    </Title>

                    <Tabs
                        defaultValue="duaa"
                        variant="pills"
                        color="violet"
                        w="100%"
                        radius="xs"
                    >
                        <Tabs.List>
                            <Tabs.Tab value="duaa">Du’aa </Tabs.Tab>
                            <Tabs.Tab value="translation">Translation</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel
                            value="duaa"
                            style={{
                                border: '2px solid #7048e8',
                                borderRadius: '0px 0px 10px 10px',
                                width: '100%',
                                height: '380px',
                            }}
                        >
                            <Box
                                p="md"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    ta="center"
                                    fw={600}
                                    c="#00005C"
                                    style={{
                                        fontSize: '2.3rem',
                                    }}
                                >
                                    {duaaText}
                                </Text>
                                <Flex
                                    justify="center"
                                    align="center"
                                    gap="md"
                                    mt="md"
                                    flex="wrap"
                                    w={'100%'}
                                    style={{}}
                                >
                                    <BrandButton
                                        size="xl"
                                        variant="whiteOutline"
                                        onClick={handlePlay}
                                        style={{
                                            borderRadius: '50%',
                                            minWidth: 50,
                                            height: 50,
                                            padding: 2,
                                        }}
                                        borderWidth={3}
                                    >
                                        {isPlaying ? (
                                            <div
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    fill: '#7048e8',
                                                }}
                                            >
                                                ⏸
                                            </div>
                                        ) : (
                                            <IconPlayerPlay
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    fill: '#7048e8',
                                                }}
                                            />
                                        )}
                                    </BrandButton>

                                    <Box
                                        bg={'#7048e8'}
                                        className={styles.sliderBox}
                                    >
                                        <Slider
                                            value={progress}
                                            onChange={handleSliderChange}
                                            w={200}
                                            min={0}
                                            max={sliderMax}
                                        />
                                    </Box>

                                    <BrandButton
                                        variant="primary"
                                        style={{
                                            borderRadius: '50%',
                                            minWidth: 50,
                                            height: 50,
                                            padding: 2,
                                        }}
                                        borderWidth={3}
                                        onClick={handleStartRecording}
                                    >
                                        <IconMicrophone
                                            style={{
                                                width: 28,
                                                height: 28,
                                                fill: 'white',
                                            }}
                                        />
                                    </BrandButton>
                                    {/* Play record button */}
                                    {!isRecording && audioUrl && (
                                        <BrandButton
                                            variant="secondary"
                                            style={{
                                                borderRadius: '50%',
                                                minWidth: 50,
                                                height: 50,
                                                padding: 2,
                                            }}
                                            borderWidth={3}
                                            onClick={handlePlayRecord}
                                        >
                                            <IconPlayerPlay
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    fill: 'white',
                                                }}
                                            />
                                        </BrandButton>
                                    )}
                                </Flex>
                            </Box>
                        </Tabs.Panel>

                        <Tabs.Panel
                            value="translation"
                            pt="xs"
                            style={{
                                border: '2px solid #7048e8',
                                borderRadius: '0px 0px 10px 10px',
                                width: '100%',
                                height: '380px',
                            }}
                        >
                            <Box mt="lg" p="md">
                                <Text
                                    ta="center"
                                    c="#00005C"
                                    style={{
                                        fontSize: '1.7rem',
                                    }}
                                >
                                    O Allah, in Your name I live and in Your
                                    name I die.
                                </Text>
                            </Box>
                        </Tabs.Panel>
                    </Tabs>

                    {isRecording && (
                        <Box className={styles.recorderContainer}>
                            <div className={styles.waveform}>
                                {Array.from({ length: 30 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.bar} ${
                                            index % 3 === 0 ? styles.active : ''
                                        }`}
                                        style={{
                                            height: `${
                                                Math.random() * 40 + 10
                                            }px`,
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <div className={styles.recorderStatus}>
                                Recording
                            </div>
                            <div className={styles.recorderTimer}>
                                {Math.floor(
                                    (Date.now() - recordingStartTime) / 1000,
                                )}
                                s
                            </div>
                            <div className={styles.recorderControls}>
                                <div
                                    className={styles.controlBtn}
                                    onClick={handleStopRecording}
                                >
                                    ✖
                                </div>
                                <div className={styles.recordCircle}></div>
                            </div>
                        </Box>
                    )}

                    <Flex gap={20} justify="space-between" w="100%" wrap="wrap">
                        <BrandButton
                            variant="secondary"
                            size="md"
                            onClick={() => history.back()}
                            isGradient
                            isPattern
                            className={styles.btn}
                        >
                            Previous
                        </BrandButton>
                        <BrandButton
                            variant="secondary"
                            size="md"
                            onClick={() => (window.location.href = '/')}
                            isGradient
                            isPattern
                            className={styles.btn}
                        >
                            Next
                        </BrandButton>
                    </Flex>
                </Group>
            </Flex>

            {/* Hidden audio element for playback */}
            {audioUrl && <audio ref={audioRef} src={audioUrl} />}
        </>
    )
}

export default ReadDuaa
