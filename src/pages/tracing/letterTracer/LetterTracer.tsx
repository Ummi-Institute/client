import React, { useEffect, useRef, FC } from 'react'

export interface LetterTracerProps {
    width?: number
    height?: number
    letter?: string
    initialIndex?: number
    color?: string
    guideColor?: string
    guideFont?: string
    userLineWidth?: number
    onDrawStart?: (x: number, y: number) => void
    onDrawEnd?: () => void
}

export const LetterTracer: FC<LetterTracerProps> = ({
    width = 500,
    height = 350,
    letter = 'A',
    color = 'purple',
    guideColor = 'rgba(0,0,0,0.2)',
    guideFont = '180px Trace',
    userLineWidth = 8,
    onDrawStart,
    onDrawEnd,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isDrawingRef = useRef(false)
    const lastPosRef = useRef<[number, number]>([0, 0])

    useEffect(() => {
        drawGuide()
    }, [letter, guideFont])

    const drawGuide = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        // Clear canvas and draw filled letter guide
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.fillStyle = guideColor
        ctx.font = guideFont
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const letterD = letter
        ctx.fillText(letterD, canvas.width / 2, canvas.height / 2)
        ctx.restore()
    }

    const getEventPos = (
        e: React.PointerEvent<HTMLCanvasElement>,
    ): [number, number] => {
        const canvas = canvasRef.current
        if (!canvas) return lastPosRef.current
        const rect = canvas.getBoundingClientRect()
        const x = ((e.clientX - rect.left) * canvas.width) / rect.width
        const y = ((e.clientY - rect.top) * canvas.height) / rect.height
        return [x, y]
    }

    const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return
        isDrawingRef.current = true
        const [x, y] = getEventPos(e)
        lastPosRef.current = [x, y]
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = userLineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(x, y)
        onDrawStart?.(x, y)
    }

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        const [x, y] = getEventPos(e)
        ctx.lineTo(x, y)
        ctx.stroke()
        lastPosRef.current = [x, y]
    }

    const stopDrawing = () => {
        if (isDrawingRef.current) {
            isDrawingRef.current = false
            onDrawEnd?.()
        }
    }

    // const handleClear = () => {
    //     drawGuide()
    //     onClear?.()
    // }

    return (
        <div
            style={{
                padding: 20,
                borderRadius: 10,
                textAlign: 'center',
                marginTop: 40,
            }}
        >
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: '1px solid #ccc',
                    cursor: 'crosshair',
                    backgroundColor: 'white',
                }}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onPointerOut={stopDrawing}
            />
        </div>
    )
}

export default LetterTracer
