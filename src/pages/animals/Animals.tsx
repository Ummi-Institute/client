import { useState } from 'react'
import styles from './Animals.module.css'
import { Group, rem, Flex, Title, Image, Text, Box } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import Background from '@/assets/backgrounds/universal.svg'
import BrandButton from '@/components/brandButton/BrandButton'

import LionImage from '@/assets/animals/lion.png'
import ElephantImage from '@/assets/animals/elephant.png'
import { headerSlice } from '@/store/stateSlices/headerSlice'
import { useDispatch } from 'react-redux'

// Sample data for animals with Arabic names and English translations
const animals = [
    { name: 'أَسَد', eng: 'Lion', image: LionImage }, // Lion
    { name: 'فِيل', eng: 'Elephant', image: ElephantImage }, // Elephant
    // { name: 'نَمِر', eng: 'Tiger', image: TigerImage }, // Tiger
    // { name: 'حِمَار وَحْشِي', eng: 'Zebra', image: ZebraImage }, // Zebra
    // { name: 'زَرَافَة', eng: 'Giraffe', image: GiraffeImage }, // Giraffe
]

const Animals = () => {
    const dispatch = useDispatch()
    //CHECK BROSWER SIZE
    dispatch(
        headerSlice.actions.setUpdateHeader({
            title: 'Animals',
            subtitle: 'Learn about animals in Arabic',
        }),
    )

    const [currentIndex, setCurrentIndex] = useState(0)

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animals.length)
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? animals.length - 1 : prevIndex - 1,
        )
    }

    const pronounceAnimal = (name: string) => {
        const utterance = new SpeechSynthesisUtterance(name)
        utterance.lang = 'ar' // Set language to Arabic
        utterance.rate = 1 // Set the rate of speech
        utterance.pitch = 1 // Set the pitch of speech
        speechSynthesis.speak(utterance)
    }

    return (
        <>
            <BackgroundImage src={Background} opacity={0.2} />
            <Flex className={styles.container} gap={20} p={rem(20)}>
                <Group bg={'#fff'} className={styles.box}>
                    <Title order={1} size={30} c={'#151965'}>
                        <span className={styles.title}>Animals</span>
                    </Title>
                    <Box mt="10px">
                        <Text className={styles.animalName}>
                            ({animals[currentIndex].eng}){' '}
                            {animals[currentIndex].name}
                        </Text>
                    </Box>
                    <Image
                        src={animals[currentIndex].image}
                        alt={animals[currentIndex].eng}
                        width={100}
                        height={100}
                        onClick={() =>
                            pronounceAnimal(animals[currentIndex].name)
                        }
                        className={styles.previewImage}
                    />
                    <Flex
                        gap={20}
                        justify={'space-between'}
                        w={'100%'}
                        wrap={'wrap'}
                    >
                        <BrandButton
                            variant="secondary"
                            size="md"
                            onClick={handlePrevious}
                            isGradient={true}
                            isPattern={true}
                            className={styles.btn}
                        >
                            Previous
                        </BrandButton>
                        <BrandButton
                            variant="secondary"
                            size="md"
                            onClick={handleNext}
                            isGradient={true}
                            isPattern={true}
                            className={styles.btn}
                        >
                            Next
                        </BrandButton>
                    </Flex>
                    <Text
                        size="1em"
                        c={'dimgray'}
                        w={'100%'}
                        style={{ textAlign: 'center', fontFamily: 'Arial' }}
                    >
                        Click on the image to hear the pronunciation
                    </Text>
                </Group>
            </Flex>
        </>
    )
}

export default Animals
