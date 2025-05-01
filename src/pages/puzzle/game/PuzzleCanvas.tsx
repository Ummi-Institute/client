import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    CSSProperties,
} from 'react'

// --- Type Definitions ---

interface Coordinates {
    x: number
    y: number
}

interface SizeInfo {
    x: number
    y: number
    width: number
    height: number
    rows: number
    columns: number
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane'

// --- Piece Class ---
class Piece {
    rowIndex: number
    colIndex: number
    x: number
    y: number
    width: number
    height: number
    xCorrect: number
    yCorrect: number
    correct: boolean
    color: string // For helper canvas identification
    offset?: Coordinates // Offset between mouse click and piece's top-left
    top: number | null = null
    bottom: number | null = null
    left: number | null = null
    right: number | null = null

    // Keep references to dynamic game elements needed for calculations/drawing
    private imageElement: HTMLImageElement
    private sizeInfo: SizeInfo

    constructor(
        rowIndex: number,
        colIndex: number,
        color: string,
        initialSize: SizeInfo,
        imageElement: HTMLImageElement,
    ) {
        this.rowIndex = rowIndex
        this.colIndex = colIndex
        this.sizeInfo = initialSize
        this.imageElement = imageElement
        // Initialize dimensions and correct position based on initialSize
        this.width = this.sizeInfo.width / this.sizeInfo.columns
        this.height = this.sizeInfo.height / this.sizeInfo.rows
        this.xCorrect =
            this.sizeInfo.x +
            (this.sizeInfo.width * this.colIndex) / this.sizeInfo.columns
        this.yCorrect =
            this.sizeInfo.y +
            (this.sizeInfo.height * this.rowIndex) / this.sizeInfo.rows
        // Initial position is the correct one before randomization
        this.x = this.xCorrect
        this.y = this.yCorrect
        this.correct = true // Assume correct initially
        this.color = color // Unique color for identification
    }

    // Method to update piece properties when game size changes (e.g., on resize)
    updateSize(newSize: SizeInfo) {
        this.sizeInfo = newSize
        this.width = this.sizeInfo.width / this.sizeInfo.columns
        this.height = this.sizeInfo.height / this.sizeInfo.rows
        this.xCorrect =
            this.sizeInfo.x +
            (this.sizeInfo.width * this.colIndex) / this.sizeInfo.columns
        this.yCorrect =
            this.sizeInfo.y +
            (this.sizeInfo.height * this.rowIndex) / this.sizeInfo.rows
        // If the piece was already in the correct position, update its current x/y too
        if (this.correct) {
            this.x = this.xCorrect
            this.y = this.yCorrect
        }
    }

    // Method to draw the piece on a given canvas context
    draw(context: CanvasRenderingContext2D, useImage = true) {
        context.beginPath()

        const sz = Math.min(this.width, this.height) // Characteristic size for tabs
        // Tab dimensions relative to piece size
        // const neck = 0.08 * sz
        const tabWidth = 0.25 * sz
        const tabHeight = 0.25 * sz

        // Draw piece outline with tabs/indents based on neighbors
        // Simplified arc logic used here for tabs/indents

        // Start at top-left corner
        context.moveTo(this.x, this.y)

        // Top edge
        if (this.top) {
            // Draw tab/indent if there's a piece above/below
            context.lineTo(this.x + this.width * 0.5 - tabWidth / 2, this.y)
            // Arc direction depends on sign of 'top' (positive = indent, negative = tab)
            context.arc(
                this.x + this.width * 0.5,
                this.y,
                tabWidth / 2,
                Math.PI,
                0,
                this.top < 0,
            )
        }
        context.lineTo(this.x + this.width, this.y) // To top-right corner

        // Right edge
        if (this.right) {
            // Draw tab/indent if there's a piece to the right/left
            context.lineTo(
                this.x + this.width,
                this.y + this.height * 0.5 - tabWidth / 2,
            )
            context.arc(
                this.x + this.width,
                this.y + this.height * 0.5,
                tabWidth / 2,
                Math.PI * 1.5,
                Math.PI * 0.5,
                this.right < 0,
            )
        }
        context.lineTo(this.x + this.width, this.y + this.height) // To bottom-right corner

        // Bottom edge
        if (this.bottom) {
            // Draw tab/indent if there's a piece below/above
            context.lineTo(
                this.x + this.width * 0.5 + tabWidth / 2,
                this.y + this.height,
            )
            context.arc(
                this.x + this.width * 0.5,
                this.y + this.height,
                tabWidth / 2,
                0,
                Math.PI,
                this.bottom < 0,
            )
        }
        context.lineTo(this.x, this.y + this.height) // To bottom-left corner

        // Left edge
        if (this.left) {
            // Draw tab/indent if there's a piece to the left/right
            context.lineTo(this.x, this.y + this.height * 0.5 + tabWidth / 2)
            context.arc(
                this.x,
                this.y + this.height * 0.5,
                tabWidth / 2,
                Math.PI * 0.5,
                Math.PI * 1.5,
                this.left < 0,
            )
        }
        context.lineTo(this.x, this.y) // Back to top-left corner

        context.save() // Save context state before clipping
        context.clip() // Clip drawing to the piece's outline

        // Draw piece content (image segment or solid color)
        if (
            useImage &&
            this.imageElement.naturalWidth > 0 &&
            this.imageElement.naturalHeight > 0
        ) {
            // Calculate source rectangle from image based on piece's row/col
            const imagePieceWidth =
                this.imageElement.naturalWidth / this.sizeInfo.columns
            const imagePieceHeight =
                this.imageElement.naturalHeight / this.sizeInfo.rows
            // Approximate scaling factor for tab size relative to image pixels
            const scaledTabSize =
                Math.min(imagePieceWidth, imagePieceHeight) * (tabHeight / sz)

            // Source rectangle (slightly larger than piece to include texture for tabs)
            const sx = this.colIndex * imagePieceWidth - scaledTabSize
            const sy = this.rowIndex * imagePieceHeight - scaledTabSize
            const sw = imagePieceWidth + scaledTabSize * 2
            const sh = imagePieceHeight + scaledTabSize * 2

            // Destination rectangle (also offset to align texture with tabs)
            const dx = this.x - tabHeight
            const dy = this.y - tabHeight
            const dw = this.width + tabHeight * 2
            const dh = this.height + tabHeight * 2

            context.drawImage(this.imageElement, sx, sy, sw, sh, dx, dy, dw, dh)
        } else if (!useImage) {
            // Draw solid color (for helper canvas)
            context.fillStyle = this.color
            // Fill a slightly larger rectangle to ensure clipped area is fully covered
            context.fillRect(
                this.x - tabWidth,
                this.y - tabHeight,
                this.width + tabWidth * 2,
                this.height + tabHeight * 2,
            )
        }

        context.restore() // Restore context state (remove clipping path)
        context.stroke() // Draw the piece outline
    }

    // Check if the piece is close enough to its correct position to snap
    isClose(): boolean {
        // Use distance formula, snap if distance is less than 1/3 of the piece width
        return (
            distance(
                { x: this.x, y: this.y },
                { x: this.xCorrect, y: this.yCorrect },
            ) <
            this.width / 3
        )
    }
}

// --- Helper Functions ---

// Calculate Euclidean distance between two points
function distance(p1: Coordinates, p2: Coordinates): number {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y),
    )
}

// Format time in milliseconds to HH:MM:SS string
function formatTime(milliseconds: number): string {
    if (milliseconds < 0) milliseconds = 0
    const totalSeconds = Math.floor(milliseconds / 1000)
    const s = totalSeconds % 60
    const m = Math.floor((totalSeconds % 3600) / 60)
    const h = Math.floor(totalSeconds / 3600)

    const formattedTime = `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return formattedTime
}

// Generate a random RGB color string
function getRandomColor(): string {
    const red = Math.floor(Math.random() * 255)
    const green = Math.floor(Math.random() * 255)
    const blue = Math.floor(Math.random() * 255)
    return `rgb(${red},${green},${blue})`
}

// --- React Component ---

const JigsawPuzzle: React.FC<{
    imageUrl: string
    containerWidth: number
    containerHeight: number
    onComplete?: () => void
    onDragStart?: (id: number) => void
    onDragEnd?: (id: number, x: number, y: number, solved: boolean) => void
    difficulty?: Difficulty
    onReset?: () => void
}> = ({
    imageUrl,
    containerHeight,
    containerWidth,
    onComplete,
    onDragStart,
    difficulty = 'easy', // Default difficulty
}) => {
    // Refs for DOM elements
    const videoRef = useRef<HTMLImageElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const helperCanvasRef = useRef<HTMLCanvasElement>(null) // Hidden canvas for piece picking
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

    // Refs for mutable values that don't trigger re-renders
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const helperContextRef = useRef<CanvasRenderingContext2D | null>(null)
    const sizeRef = useRef<SizeInfo>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rows: 3,
        columns: 3,
    }) // Default easy size
    const piecesRef = useRef<Piece[]>([]) // Holds the current state of all pieces
    const selectedPieceRef = useRef<Piece | null>(null) // Currently dragged piece
    const startTimeRef = useRef<number | null>(null) // Timestamp when game starts
    const endTimeRef = useRef<number | null>(null) // Timestamp when game ends
    const animationFrameIdRef = useRef<number | null>(null) // ID for cancelling animation loop
    const popSoundRef = useRef<HTMLAudioElement | null>(null) // Ref for the snap sound
    const audioContextRef = useRef<AudioContext | null>(null) // Ref for Web Audio API context
    const isDraggingRef = useRef<boolean>(false) // Flag for dragging state
    const scalerRef = useRef<number>(0.7) // Scale factor for fitting video in window

    // State variables that trigger re-renders
    const [isVideoReady, setIsVideoReady] = useState<boolean>(false) // Is video loaded and ready to play?
    const [elapsedTime, setElapsedTime] = useState<number>(0) // Time elapsed for display
    const [isGameComplete, setIsGameComplete] = useState<boolean>(false) // Has the puzzle been solved?
    const [showMenu, setShowMenu] = useState<boolean>(true) // Show initial menu/controls?
    const [showEndScreen, setShowEndScreen] = useState<boolean>(false) // Show completion screen?

    // --- Constants ---
    // const keys = { DO: 261.6, RE: 293.7, MI: 329.6 } // Frequencies for win melody

    // --- Audio Functions ---
    // const playNote = useCallback((key: number, duration: number) => {
    //     const audioCtx = audioContextRef.current
    //     if (!audioCtx || audioCtx.state === 'closed') {
    //         console.warn('Audio context not ready or closed for playing note.')
    //         return
    //     }
    //     try {
    //         const osc = audioCtx.createOscillator()
    //         const envelope = audioCtx.createGain()

    //         osc.frequency.value = key
    //         osc.connect(envelope)
    //         envelope.connect(audioCtx.destination)
    //         osc.type = 'triangle'

    //         const now = audioCtx.currentTime
    //         envelope.gain.setValueAtTime(0, now)
    //         envelope.gain.linearRampToValueAtTime(0.5, now + 0.05)
    //         envelope.gain.linearRampToValueAtTime(0, now + duration / 1000)

    //         osc.start(now)
    //         osc.stop(now + duration / 1000)
    //         // Basic cleanup attempt (might be handled by garbage collection anyway)
    //         // osc.onended = () => osc.disconnect();
    //     } catch (e) {
    //         console.error('Error playing note:', e)
    //     }
    // }, []) // Doesn't depend on component state/props, only refs

    // const playMelody = useCallback(() => {
    //     playNote(keys.MI, 300)
    //     setTimeout(() => playNote(keys.DO, 300), 300)
    //     setTimeout(() => playNote(keys.RE, 150), 450)
    //     setTimeout(() => playNote(keys.MI, 600), 600)
    // }, [playNote, keys])

    // --- Piece Initialization and Randomization ---
    const initializePieces = useCallback((rows: number, cols: number) => {
        // Requires video element and size info to be ready
        if (!videoRef.current || !sizeRef.current) {
            console.warn(
                'Cannot initialize pieces: Video or Size Ref not ready.',
            )
            return
        }

        sizeRef.current.rows = rows
        sizeRef.current.columns = cols
        piecesRef.current = [] // Reset pieces array
        const uniqueRandomColors: string[] = [] // To ensure each piece has a unique color ID

        // Create all piece objects
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let color = getRandomColor()
                // Ensure color uniqueness (important for piece picking)
                while (uniqueRandomColors.includes(color)) {
                    color = getRandomColor()
                }
                uniqueRandomColors.push(color)
                piecesRef.current.push(
                    new Piece(i, j, color, sizeRef.current, videoRef.current),
                )
            }
        }

        // Assign tab/indent information based on neighbors
        let cnt = 0
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const piece = piecesRef.current[cnt]
                // Determine bottom connection
                piece.bottom =
                    i === rows - 1
                        ? null
                        : (Math.random() - 0.5 < 0 ? -1 : 1) *
                          (Math.random() * 0.4 + 0.3)
                // Determine right connection
                piece.right =
                    j === cols - 1
                        ? null
                        : (Math.random() - 0.5 < 0 ? -1 : 1) *
                          (Math.random() * 0.4 + 0.3)
                // Determine left connection (must be inverse of piece to the left's right connection)
                piece.left =
                    j === 0 || !piecesRef.current[cnt - 1]?.right
                        ? null
                        : -piecesRef.current[cnt - 1].right!
                // Determine top connection (must be inverse of piece above's bottom connection)
                piece.top =
                    i === 0 || !piecesRef.current[cnt - cols]?.bottom
                        ? null
                        : -piecesRef.current[cnt - cols].bottom!
                cnt++
            }
        }
        // console.log("Pieces initialized:", piecesRef.current.length);
    }, []) // Depends only on refs (stable)

    // Scatter pieces randomly across the canvas
    const randomizePieces = useCallback(() => {
        if (!canvasRef.current || piecesRef.current.length === 0) return
        const canvasWidth = canvasRef.current.width
        const canvasHeight = canvasRef.current.height

        piecesRef.current.forEach((piece) => {
            // Ensure piece dimensions are calculated before randomizing
            if (piece.width > 0 && piece.height > 0) {
                piece.x = Math.random() * (canvasWidth - piece.width)
                piece.y = Math.random() * (canvasHeight - piece.height)
                piece.correct = false // Mark as incorrect after randomizing
            } else {
                // Fallback position if dimensions aren't ready (should be avoided by calling after resize/init)
                console.warn(
                    'Piece dimensions not ready for randomization, using fallback.',
                    piece,
                )
                piece.x = Math.random() * canvasWidth * 0.8
                piece.y = Math.random() * canvasHeight * 0.8
                piece.correct = false
            }
        })
        // console.log("Pieces randomized");
    }, []) // Depends only on refs (stable)

    // --- Game Logic ---
    // Check if all pieces are in their correct positions
    const checkCompletion = useCallback((): boolean => {
        const allSolved = piecesRef.current.every((piece) => piece.correct)
        if (allSolved) {
            setIsGameComplete(true)
            endTimeRef.current = Date.now() // Record the end time
            onComplete?.() // Trigger onComplete callback
            setShowEndScreen(true)
        }
        return allSolved
    }, [onComplete])

    // --- Drawing and Game Loop ---
    // Main animation loop function
    const updateGame = useCallback(() => {
        if (
            !canvasRef.current ||
            !contextRef.current ||
            !helperCanvasRef.current ||
            !helperContextRef.current ||
            !videoRef.current
        ) {
            // If not ready, request the next frame and try again
            animationFrameIdRef.current = requestAnimationFrame(updateGame)
            return
        }

        const canvas = canvasRef.current
        const context = contextRef.current
        const helperContext = helperContextRef.current
        const video = videoRef.current
        const { x, y, width, height } = sizeRef.current

        // 1. Clear both canvases
        context.clearRect(0, 0, canvas.width, canvas.height)
        helperContext.clearRect(
            0,
            0,
            helperCanvasRef.current.width,
            helperCanvasRef.current.height,
        )

        // 2. Draw dimmed video background (if game is active and not complete)
        if (startTimeRef.current !== null && !isGameComplete) {
            context.globalAlpha = 0.3 // Make background less prominent
            if (width > 0 && height > 0) {
                context.drawImage(video, x, y, width, height)
            }
            context.globalAlpha = 1.0 // Reset alpha for pieces
        }

        // 3. Draw all puzzle pieces
        context.strokeStyle = 'rgba(0,0,0,0.5)' // Outline color for pieces
        context.lineWidth = 1
        for (let i = 0; i < piecesRef.current.length; i++) {
            // console.log(` पीस ${i} pos:`, { x: piecesRef.current[i].x, y: piecesRef.current[i].y }); // DEBUG: Check piece positions
            piecesRef.current[i].draw(context, true) // Draw piece with video texture on main canvas
            piecesRef.current[i].draw(helperContext, false) // Draw piece with solid color on helper canvas
        }

        // 4. Update displayed timer
        if (startTimeRef.current !== null) {
            const now = Date.now()
            // Use ended time if available, otherwise calculate current elapsed time
            setElapsedTime(
                endTimeRef.current
                    ? endTimeRef.current - startTimeRef.current
                    : now - startTimeRef.current,
            )
        }

        // 5. Stop the animation loop if the game is complete
        if (isGameComplete) {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current)
                animationFrameIdRef.current = null
                console.log('Animation loop stopped as the game is complete.')
            }
            return // Exit the loop
        }

        // 6. Request the next animation frame
        animationFrameIdRef.current = requestAnimationFrame(updateGame)
    }, [isGameComplete]) // Recreate updateGame only if isGameComplete changes

    // --- Event Handlers ---
    // Get the piece at a specific coordinate using the helper canvas color data

    // Handle mouse button press down on the canvas

    const handleMouseDown = useCallback(
        (evt: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isGameStarted || isGameComplete) return // Disable interaction if game is not started or complete

            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = evt.clientX - rect.left
            const y = evt.clientY - rect.top

            const piece = piecesRef.current.find(
                (p) =>
                    x >= p.x &&
                    x <= p.x + p.width &&
                    y >= p.y &&
                    y <= p.y + p.height,
            )

            if (piece) {
                selectedPieceRef.current = piece
                isDraggingRef.current = true
                onDragStart?.(piece.rowIndex * piece.colIndex) // Trigger onDragStart callback
            }
        },
        [isGameStarted, isGameComplete, onDragStart],
    )

    // Handle mouse movement over the canvas
    const handleMouseMove = useCallback(
        (evt: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDraggingRef.current || !selectedPieceRef.current) return

            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = evt.clientX - rect.left
            const y = evt.clientY - rect.top

            const piece = selectedPieceRef.current
            piece.x = x - piece.width / 2
            piece.y = y - piece.height / 2
        },
        [],
    )

    // Handle mouse button release on the canvas
    const handleMouseUp = useCallback(() => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false

        const piece = selectedPieceRef.current
        if (piece && !isGameComplete) {
            if (piece.isClose()) {
                piece.x = piece.xCorrect
                piece.y = piece.yCorrect
                piece.correct = true
                checkCompletion()
            }
        }
        selectedPieceRef.current = null
    }, [isGameComplete, checkCompletion])

    // --- Touch Event Handlers (mostly delegate to mouse handlers) ---
    const handleTouchStart = useCallback(
        (evt: React.TouchEvent<HTMLCanvasElement>) => {
            // console.log("Touch Start Fired"); // DEBUG
            if (
                isGameComplete ||
                startTimeRef.current === null ||
                evt.touches.length === 0
            )
                return
            evt.preventDefault() // Prevent default actions like scrolling
            const touch = evt.touches[0]
            // Simulate a mouse event object to reuse the mouse down logic
            const simulatedMouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => evt.preventDefault(), // Pass preventDefault
            } as unknown as React.MouseEvent<HTMLCanvasElement> // Type assertion needed
            handleMouseDown(simulatedMouseEvent)
        },
        [handleMouseDown, isGameComplete],
    )

    const handleTouchMove = useCallback(
        (evt: React.TouchEvent<HTMLCanvasElement>) => {
            // console.log("Touch Move Fired"); // DEBUG
            if (
                !isDraggingRef.current ||
                isGameComplete ||
                evt.touches.length === 0
            )
                return
            evt.preventDefault() // Crucial to prevent page scrolling during drag
            const touch = evt.touches[0]
            const simulatedMouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => evt.preventDefault(),
            } as unknown as React.MouseEvent<HTMLCanvasElement>
            handleMouseMove(simulatedMouseEvent)
        },
        [handleMouseMove, isGameComplete],
    )

    const handleTouchEnd = useCallback(
        (evt: React.TouchEvent<HTMLCanvasElement>) => {
            // console.log("Touch End Fired"); // DEBUG
            // Prevent default only if actively dragging to allow other touch interactions if needed
            if (isDraggingRef.current) {
                evt.preventDefault()
            }
            handleMouseUp() // Reuse mouse up logic for snapping and completion checks
        },
        [handleMouseUp],
    )

    // --- Resize Handling ---
    // Recalculate canvas size, video display area, and piece properties on window resize
    const handleResize = useCallback(() => {
        const mainCanvas = canvasRef.current
        const helper = helperCanvasRef.current
        const image = videoRef.current // Use image instead of video
        if (!mainCanvas || !helper || !image) {
            console.warn('Resize handler: Refs not available.')
            return
        }

        // Use containerWidth and containerHeight props for canvas dimensions
        const maxWidth = containerWidth || 500 // Default to 500px if not provided
        const maxHeight = containerHeight || window.innerHeight

        // Update canvas elements to fit within the container dimensions
        mainCanvas.width = Math.min(window.innerWidth, maxWidth)
        mainCanvas.height = Math.min(window.innerHeight, maxHeight)
        helper.width = mainCanvas.width
        helper.height = mainCanvas.height

        // Recalculate image display area only if image dimensions are known
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            const currentScaler = scalerRef.current
            const aspectRatio = image.naturalWidth / image.naturalHeight
            let targetWidth = mainCanvas.width * currentScaler
            let targetHeight = targetWidth / aspectRatio

            // If calculated height exceeds scaled canvas height, recalculate based on height
            if (targetHeight > mainCanvas.height * currentScaler) {
                targetHeight = mainCanvas.height * currentScaler
                targetWidth = targetHeight * aspectRatio
            }

            // Update sizeRef with centered position and calculated dimensions
            sizeRef.current.width = targetWidth
            sizeRef.current.height = targetHeight
            sizeRef.current.x = mainCanvas.width / 2 - targetWidth / 2
            sizeRef.current.y = mainCanvas.height / 2 - targetHeight / 2

            // Update all existing pieces with the new size information
            piecesRef.current.forEach((piece) =>
                piece.updateSize(sizeRef.current),
            )
            // console.log("Resized. New image area:", sizeRef.current); // DEBUG
        } else {
            // console.log("Resize handler: Image dimensions not ready."); // DEBUG
        }
        // No need to manually call updateGame, the animation loop will redraw
    }, [containerWidth, containerHeight])

    // --- Game Control Functions ---

    // Start a new game (initialize timer, scatter pieces)
    const startGame = useCallback(() => {
        if (!isVideoReady) {
            alert('Camera is not ready yet. Please wait or check permissions.')
            return
        }
        // console.log("Starting game..."); // DEBUG
        setIsGameComplete(false) // Reset completion flag
        setShowEndScreen(false) // Hide end screen
        setShowMenu(true) // Ensure menu/timer is visible
        setIsGameStarted(true) // Enable the game
        setElapsedTime(0) // Reset timer display
        startTimeRef.current = Date.now() // Record start time
        endTimeRef.current = null // Clear end time
        // Initialize pieces based on current difficulty and randomize their positions
        const { rows, columns } = sizeRef.current // Get current grid size from ref
        initializePieces(rows, columns) // Create pieces in correct positions
        randomizePieces() // Scatter them
    }, [isVideoReady, initializePieces, randomizePieces]) // Dependencies

    // Restart the game (calls start game)
    const restartGame = useCallback(() => {
        // console.log("Restarting game..."); // DEBUG
        startGame() // Reuse start game logic
    }, [startGame])

    // const resetGame = useCallback(() => {
    //     setIsGameComplete(false)
    //     onReset?.() // Trigger onReset callback
    //     // Reinitialize pieces or reset game state here
    // }, [onReset])

    // --- useEffect Hooks ---

    // Effect 1: Initialization on Mount (Camera, Audio, Canvases, Listeners)
    useEffect(() => {
        // Store refs locally for use in cleanup function to avoid stale closures
        const imageElementForCleanup = videoRef.current
        let audioCtxForCleanup = audioContextRef.current

        console.log('Effect 1: Initializing resources...')

        // --- Initialize Audio ---
        try {
            const AudioContext =
                window.AudioContext || (window as any).webkitAudioContext
            if (AudioContext && !audioCtxForCleanup) {
                // Create context only if it doesn't exist
                audioCtxForCleanup = new AudioContext()
                audioContextRef.current = audioCtxForCleanup
                console.log(
                    'AudioContext created state:',
                    audioCtxForCleanup.state,
                )
            } else if (!AudioContext) {
                console.warn('Web Audio API not supported.')
            }
            // Create Audio element for snap sound if it doesn't exist
            if (!popSoundRef.current) {
                popSoundRef.current = new Audio('pop.mp3') // Adjust path if needed
                popSoundRef.current.volume = 0.1
                console.log('Pop sound element created.')
            }
        } catch (e) {
            console.error('Audio initialization failed:', e)
        }

        // --- Initialize Canvases ---
        if (canvasRef.current && helperCanvasRef.current) {
            if (!contextRef.current)
                contextRef.current = canvasRef.current.getContext('2d')
            if (!helperContextRef.current)
                helperContextRef.current = helperCanvasRef.current.getContext(
                    '2d',
                    { willReadFrequently: true },
                ) // willReadFrequently hint for getImageData

            if (!contextRef.current || !helperContextRef.current) {
                console.error('Failed to get canvas 2D context.')
                return // Stop setup if canvases fail
            }
        } else {
            console.error('Canvas refs not available on mount.')
            return // Stop setup if refs aren't ready
        }

        // --- Initialize Image ---
        const initImage = async () => {
            console.log('Initializing image...')
            try {
                if (!imageUrl) {
                    console.error('Image URL is not provided.')
                    return
                }

                const image = new Image()
                image.src = imageUrl

                console.log(imageUrl, image)

                image.onload = () => {
                    console.log(`Image loaded: ${image.width}x${image.height}`)
                    if (videoRef.current) {
                        console.log(videoRef.current, videoRef.current.width)
                        videoRef.current = image // Assign the loaded image to the ref
                        console.log(videoRef.current, 'new')
                        setIsVideoReady(true) // Signal readiness
                        handleResize() // Perform initial resizing
                        updateGame() // Force a redraw of the canvas
                    }
                }

                image.onerror = (err) => {
                    console.error('Failed to load image:', err)
                    alert('Could not load the image. Please check the URL.')
                }
            } catch (err) {
                console.error('Error initializing image:', err)
                alert(
                    'An error occurred while loading the image. Please try again.\nError: ' +
                        (err instanceof Error ? err.message : String(err)),
                )
            }
        }
        initImage() // Attempt to initialize the image

        // --- Add Global Resize Listener ---
        window.addEventListener('resize', handleResize)

        if (isVideoReady) {
            updateGame() // Redraw the canvas when the image changes
        }

        // --- Cleanup Function (runs on component unmount) ---
        return () => {
            console.log('Effect 1 Cleanup: Releasing resources...')
            // Stop animation loop
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current)
                animationFrameIdRef.current = null
                console.log('Animation frame cancelled.')
            }
            // Clear image reference
            if (imageElementForCleanup) {
                imageElementForCleanup.src = '' // Clear the image source
            }
            // Close AudioContext
            if (audioCtxForCleanup && audioCtxForCleanup.state !== 'closed') {
                audioCtxForCleanup
                    .close()
                    .then(() => console.log('AudioContext closed.'))
                    .catch((e) =>
                        console.error('Error closing AudioContext:', e),
                    )
            }
            // Remove resize listener
            window.removeEventListener('resize', handleResize)
        }
    }, [handleResize, imageUrl, updateGame, isVideoReady]) // Dependency: handleResize and imageUrl

    // Effect 2: Handle Video Readiness (Initial Resize, Start Loop)
    useEffect(() => {
        // Run only when isVideoReady becomes true
        if (
            isVideoReady &&
            videoRef.current?.naturalWidth &&
            videoRef.current.naturalWidth > 0
        ) {
            console.log(
                'Effect 2: Image Ready. Performing initial layout & starting loop.',
            )
            handleResize() // Perform initial sizing now that image dimensions are known
            // Don't initialize/randomize pieces here; wait for Start button.
            // Start the game animation loop if it's not already running
            if (animationFrameIdRef.current === null) {
                console.log('Starting animation loop.')
                animationFrameIdRef.current = requestAnimationFrame(updateGame)
            }
        }
        // Note: No cleanup needed here as this effect primarily triggers actions
    }, [isVideoReady, handleResize, updateGame]) // Dependencies: isVideoReady, handleResize, updateGame

    // Effect 3: Update Layout on Difficulty Change (Before Game Starts)
    useEffect(() => {
        // Only run if video is ready AND the game hasn't started yet
        if (!isVideoReady || startTimeRef.current !== null) {
            return
        }

        // console.log(`Effect 3: Difficulty changed to ${difficulty} (pre-game). Updating layout.`); // DEBUG
        let rows = 3,
            cols = 3 // Default to easy
        switch (difficulty) {
            case 'medium':
                rows = 5
                cols = 5
                break
            case 'hard':
                rows = 10
                cols = 10
                break
            case 'insane':
                rows = 20
                cols = 12
                break // Example insane size
        }
        // Update the grid size in the sizeRef
        sizeRef.current.rows = rows
        sizeRef.current.columns = cols
        handleResize() // Recalculate overall video area size based on new potential grid
        initializePieces(rows, cols) // Create pieces in their correct final positions for the new grid
        // console.log(`Layout prepared for ${difficulty}. Press Start.`); // DEBUG
    }, [difficulty, isVideoReady, initializePieces, handleResize]) // Dependencies

    // --- Render Component JSX ---
    return (
        <div style={styles.container}>
            {/* Video Element: Hidden visually but provides texture */}
            <img ref={videoRef} style={styles.hiddenVideo} />

            {/* Main Canvas: Visible, interactive area for the puzzle */}
            <canvas
                ref={canvasRef}
                style={styles.canvas}
                width={containerWidth}
                height={containerHeight}
                // Mouse event handlers
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // Treat leaving canvas boundary as mouse up
                // Touch event handlers
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd} // Treat cancelling touch as touch end
            />
            {/* Helper Canvas: Off-screen, used for piece identification via color */}
            <canvas ref={helperCanvasRef} style={styles.hiddenCanvas} />

            {/* UI Elements - Conditionally Rendered */}

            {/* Menu/Controls Area */}
            {showMenu && !showEndScreen && (
                <div style={styles.menuItems} id="menuItems">
                    {/* Display timer only after game starts */}
                    {startTimeRef.current !== null && (
                        <p>Time: {formatTime(elapsedTime)}</p>
                    )}
                    {/* Button text changes based on game state */}
                    <button
                        onClick={
                            startTimeRef.current === null
                                ? startGame
                                : restartGame
                        }
                        style={styles.button}
                    >
                        {startTimeRef.current === null
                            ? 'Start Game'
                            : 'Restart'}
                    </button>
                </div>
            )}

            {/* End Screen Overlay */}
            {showEndScreen && (
                <div style={styles.overlay} id="endScreen">
                    <h2>Puzzle Complete!</h2>
                    <p id="scoreValue">Final Time: {formatTime(elapsedTime)}</p>
                    <button onClick={restartGame} style={styles.button}>
                        Play Again?
                    </button>
                    {/* Button to just go back to the menu without restarting */}
                    <button
                        onClick={() => {
                            setShowEndScreen(false) // Hide end screen
                            setShowMenu(true) // Show menu
                            // Optional: Reset timer display if going back to menu without restart
                            // setElapsedTime(0);
                            // startTimeRef.current = null;
                            // endTimeRef.current = null;
                            // setIsGameComplete(false);
                        }}
                        style={styles.button}
                    >
                        Menu
                    </button>
                </div>
            )}
        </div>
    )
}

export default JigsawPuzzle

// --- Styles (CSS-in-JS) ---
const styles: { [key: string]: CSSProperties } = {
    container: {
        position: 'relative', // Needed for absolute positioning of UI elements
        width: 'auto', // Full viewport width
        height: 'auto', // Full viewport height
        overflow: 'hidden', // Prevent scrollbars if canvas slightly exceeds viewport
        backgroundColor: '#1a1a1a', // Dark background
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: '#e0e0e0', // Light text color
        margin: 0,
        padding: 0,
    },
    canvas: {
        display: 'block', // Remove extra space below canvas
        // width: '100%',
        // height: '100%',
        cursor: 'grab', // Indicate draggable potential
        touchAction: 'none', // Prevent default touch behaviors like scroll/zoom on the canvas itself
    },
    hiddenVideo: {
        position: 'absolute',
        top: '-9999px', // Move way off-screen
        left: '-9999px',
        width: '1px', // Minimize footprint
        height: '1px',
        opacity: 0,
        pointerEvents: 'none', // Ensure it doesn't interfere with interactions
    },
    hiddenCanvas: {
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1, // Ensure it's behind everything
        width: '1px',
        height: '1px',
    },
    menuItems: {
        position: 'absolute',
        top: '0px',
        backgroundColor: 'rgba(40, 44, 52, 0.85)', // Semi-transparent dark background
        padding: '10px 15px',
        borderRadius: '8px',
        zIndex: 10, // Ensure menu is above canvas
        color: '#e0e0e0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)', // Subtle shadow
        display: 'flex', // Arrange items nicely
        flexDirection: 'row', // Stack vertically
        alignItems: 'flex-start', // Align items to the left
        justifyContent: 'space-between',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: '50%', // Center vertically
        left: '50%', // Center horizontally
        transform: 'translate(-50%, -50%)', // Adjust for element's own size for true centering
        backgroundColor: 'rgba(40, 44, 52, 0.9)', // More opaque background
        padding: '25px 30px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: 20, // Ensure end screen is above everything else
        color: '#e0e0e0',
        minWidth: '280px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)', // More prominent shadow
    },
    label: {
        marginRight: '5px',
        fontWeight: 'bold',
        marginBottom: '2px', // Spacing below label
    },
    select: {
        padding: '8px 10px',
        marginBottom: '10px', // Spacing below dropdown
        borderRadius: '4px',
        border: '1px solid #555',
        backgroundColor: '#333',
        color: '#e0e0e0',
        cursor: 'pointer',
        minWidth: '150px', // Give dropdown some width
    },
    button: {
        padding: '10px 18px',
        margin: '5px 0', // Vertical margin only within menu column
        cursor: 'pointer',
        backgroundColor: '#007bff', // Primary button color
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1em',
        transition: 'background-color 0.2s ease, transform 0.1s ease', // Smooth transitions
        width: 'auto', // Make buttons fill menu width
        textAlign: 'center',
        // ':hover' and ':active' pseudo-classes should be handled in a CSS file or styled-components
    },
}
