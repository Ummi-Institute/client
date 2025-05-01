import { useState, CSSProperties, useRef, useEffect } from 'react'
import { Box, SimpleGrid, Stack, Group } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'

import styles from './ColoringGame.module.css'

import ColoringBackground from '@/assets/backgrounds/auditorium/coloringBakground.png' // Replace with the actual background path
import ColoringPaperBackground from '@/assets/backgrounds/auditorium/coloringBg.png' // Replace with the actual background path
import Image1 from '@/assets/coloring/1.svg'
import Image2 from '@/assets/coloring/2.svg'
import Image3 from '@/assets/coloring/3.svg'
import { useParams } from 'react-router-dom'

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

const ColoringGame = () => {
    const params = useParams()
    // const navigate = useNavigate()

    if (!params.id) return (location.href = '/vocab_coloring')

    const id = params.id

    const data = items.find((e) => e.value === id)
    if (!data) return (location.href = '/vocab_coloring')

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
                <ColoringPage
                    svgUrl={data.image}
                    // palette={['#f00', '#0f0', '#00f']}
                    defaultColor="#0f0"
                    width={600}
                    height={400}
                    strokeColor="#333"
                    strokeWidth={1}
                    onRegionClick={(el, color) =>
                        console.log('Painted region', el, 'with', color)
                    }
                />
            </Group>
        </>
    )
}
export default ColoringGame

export interface ColoringPageProps {
    svgUrl?: string
    palette?: string[]
    defaultColor?: string
    onRegionClick?: (el: SVGElement, color: string) => void
    width?: number | string
    height?: number | string
    strokeColor?: string
    strokeWidth?: number
    vectorEffect?: string
    shapeTags?: string[]
    style?: CSSProperties
    className?: string
}

export function ColoringPage({
    svgUrl,
    palette = ['#A0E3A0', '#FFD680', '#FF8A80', '#80D8FF'],
    defaultColor,
    onRegionClick,
    width = 600,
    height = 400,
    strokeColor = '#000',
    strokeWidth = 2,
    vectorEffect = 'non-scaling-stroke',
    shapeTags = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline'],
    style,
    className,
}: ColoringPageProps) {
    const [selectedColor, setSelectedColor] = useState(
        defaultColor || palette[0],
    )
    const colorRef = useRef(selectedColor)
    const containerRef = useRef<HTMLDivElement>(null)

    // keep ref in sync
    useEffect(() => {
        colorRef.current = selectedColor
    }, [selectedColor])

    // FETCH → INJECT → STYLE → DELEGATE
    useEffect(() => {
        if (!containerRef.current) return

        fetch(svgUrl!)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.text()
            })
            .then((svgText) => {
                const container = containerRef.current!
                // 1) inject raw SVG
                container.innerHTML = svgText

                // 2) grab the <svg> node
                const svgEl = container.querySelector('svg')
                if (!svgEl) return

                // 3) force its size
                svgEl.setAttribute('width', `${width}`)
                svgEl.setAttribute('height', `${height}`)

                // 4) outline + transparent hit-area + pointer
                shapeTags.forEach((tag) => {
                    svgEl.querySelectorAll<SVGElement>(tag).forEach((el) => {
                        el.style.fill = 'transparent' // transparent hit area
                        el.style.pointerEvents = 'all' // ensure clicks register
                        el.setAttribute('stroke', strokeColor) // still draw the outline
                        el.setAttribute('stroke-width', `${strokeWidth}`)
                        el.setAttribute('vector-effect', vectorEffect)
                        el.style.cursor = 'pointer'
                    })
                })

                // 5) delegated click → CSS fill
                function onSvgClick(e: Event) {
                    const t = e.target as SVGElement
                    if (shapeTags.includes(t.tagName.toLowerCase())) {
                        const c = colorRef.current
                        t.style.fill = c // use CSS fill
                        onRegionClick?.(t, c)
                    }
                }
                svgEl.addEventListener('click', onSvgClick)
                return () => void svgEl.removeEventListener('click', onSvgClick)
            })
            .catch((err) => console.error('SVG load/inject failed:', err))
    }, [
        svgUrl,
        width,
        height,
        strokeColor,
        strokeWidth,
        vectorEffect,
        shapeTags.join(','),
        onRegionClick,
    ])

    return (
        <Stack align="center" style={style} className={className} w={'100%'}>
            {/* Palette */}
            <SimpleGrid cols={palette.length}>
                {palette.map((c) => (
                    <Box
                        key={c}
                        variant={selectedColor === c ? 'filled' : 'outline'}
                        style={{
                            width: 30,
                            height: 30,
                            backgroundColor: `${c}`,
                            cursor: 'pointer',
                        }}
                        onClick={() => setSelectedColor(c)}
                    />
                ))}
            </SimpleGrid>

            {/* SVG canvas */}
            <Box
                className={styles.canvas}
                style={{
                    backgroundImage: `url(${ColoringPaperBackground})`,
                    backgroundSize: 'cover',
                }}
            >
                <div ref={containerRef} />
            </Box>
        </Stack>
    )
}
