import { useEffect, useState } from 'react'

import { Flex, Box, rem, Text } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import PuzzleBg from '@/assets/backgrounds/auditorium/puzzle_game.png'
import JigsawPuzzle, { Difficulty } from './PuzzleCanvas'
import Panel, { PanelSelect } from '@/components/panel/Panel'

import juz1Image from '@/assets/puzzle/1.jpg'
import juz2Image from '@/assets/puzzle/2.jpg'
import juz3Image from '@/assets/puzzle/3.jpg'

const puzzleImages = {
    one: juz1Image,
    two: juz2Image,
    three: juz3Image,
}

const MakhrajPuzzle = () => {
    // const params = useParams()

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

            <Flex
                justify="center"
                align="start"
                direction="row"
                wrap={'wrap'}
                gap="lg"
                style={{ padding: rem(20), marginTop: rem(40) }}
            >
                {/* Settings Panel */}
                <Panel title="Setting" defaultExpanded={true} width={300}>
                    <Box mb="md">
                        <Text fz="md" mb={4} c="#7048e8">
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
                        <Text fz="md" mb={4} c="#7048e8">
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
                        maxWidth: 850,
                        height: 'auto',
                        borderRadius: 2,
                        position: 'relative',
                        background: 'white',
                        padding: '10px',
                        border: '1px solid yellow',
                    }}
                >
                    <JigsawPuzzle
                        imageUrl={currentImage as string}
                        containerWidth={800}
                        containerHeight={700}
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
