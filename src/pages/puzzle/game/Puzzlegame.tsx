import { useEffect, useState } from 'react'

import { Flex, Box, Text } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import PuzzleBg from '@/assets/backgrounds/auditorium/puzzle_game.png'
import JigsawPuzzle, { Difficulty } from './PuzzleCanvas'
import Panel, { PanelSelect } from '@/components/panel/Panel'
import { useViewportSize } from '@mantine/hooks'
import styles from './Puzzlegame.module.css'

import juz1Image from '@/assets/puzzle/1.jpg'
import juz2Image from '@/assets/puzzle/2.jpg'
import juz3Image from '@/assets/puzzle/3.jpg'
import { headerSlice } from '@/store/stateSlices/headerSlice'
import { useDispatch } from 'react-redux'

const puzzleImages = {
    one: juz1Image,
    two: juz2Image,
    three: juz3Image,
}

const MakhrajPuzzle = () => {
    // const params = useParams()
    // const navigate = useNavigate()
    const dispatch = useDispatch()

    dispatch(
        headerSlice.actions.setUpdateHeader({
            title: 'Makhraj Puzzle',
            subtitle: 'Learn Makhraj with puzzle game',
        }),
    )

    const { width } = useViewportSize()
    const isMobile = width < 868

    type PuzzleType = 'one' | 'two' | 'three'

    const [type, setType] = useState<PuzzleType>('two')
    const [currentImage, setCurrentImage] = useState(puzzleImages[type])
    const [difficulty, setDifficulty] = useState<Difficulty>('easy') // Current game difficulty

    useEffect(() => {
        setCurrentImage(puzzleImages[type])
    }, [type])

    return (
        <>
            <BackgroundImage src={PuzzleBg} />

            <Flex gap="lg" className={styles.container}>
                {/* Settings Panel */}
                <Panel title="Setting" defaultExpanded={true} width={270}>
                    <Box mb="md">
                        <Text fz="md" c="#7048e8">
                            Type :
                        </Text>
                        <PanelSelect
                            data={[
                                { label: 'Jus 1', value: 'one' },
                                { label: 'Jus 2', value: 'two' },
                                { label: 'Jus 3', value: 'three' },
                            ]}
                            value={type}
                            onChange={(value) => {
                                if (value) setType(value as PuzzleType)
                            }}
                        />
                    </Box>

                    <Box>
                        <Text fz="md" c="#7048e8">
                            Difficulty :
                        </Text>
                        <Flex align="center" gap="sm">
                            <PanelSelect
                                data={[
                                    { label: 'Easy (3x3)', value: 'easy' },
                                    { label: 'Medium (5x5)', value: 'medium' },
                                    { label: 'Hard (10x10)', value: 'hard' },
                                    {
                                        label: 'Insane (20x12)',
                                        value: 'insane',
                                    },
                                ]}
                                value={difficulty}
                                onChange={(value) =>
                                    setDifficulty(value as Difficulty)
                                }
                            />
                        </Flex>
                    </Box>
                </Panel>

                {/* Puzzle Game Area */}
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'auto',
                        maxWidth: isMobile ? '100%' : '850px',
                        height: 'auto',
                        borderRadius: 2,
                        position: 'relative',
                        background: 'white',
                        border: '1px solid yellow',
                    }}
                >
                    <JigsawPuzzle
                        imageUrl={currentImage as string}
                        containerWidth={isMobile ? 600 : 800}
                        containerHeight={isMobile ? 500 : 700}
                        difficulty={difficulty}
                        onComplete={() => console.log('🎉 Puzzle completed!')}
                        onDragStart={(id) =>
                            console.log(`Started dragging tile ${id}`)
                        }
                        onDragEnd={(id, x, y, solved) => {
                            console.log(
                                `Dropped tile ${id} at [${x},${y}], Solved: ${solved}`,
                            )
                        }}
                    />
                </Box>
            </Flex>
        </>
    )
}

export default MakhrajPuzzle
