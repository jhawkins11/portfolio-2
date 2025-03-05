'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrash, FiCheck, FiMinimize, FiMaximize } from 'react-icons/fi'

type Point = {
  x: number
  y: number
}

type DrawingCanvasProps = {
  onShapeCreated: (points: Point[]) => void
  width?: number
  height?: number
}

export default function DrawingCanvas({
  onShapeCreated,
  width = 300,
  height = 300,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [smoothMode, setSmoothMode] = useState(true)

  // Clear the canvas and reset points
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setPoints([])
  }

  // Simplify a complex path by removing points that are too close together
  const simplifyPath = (points: Point[], tolerance = 10): Point[] => {
    if (points.length <= 3) return points

    const simplified: Point[] = [points[0]]
    let lastPoint = points[0]

    for (let i = 1; i < points.length - 1; i++) {
      const dx = points[i].x - lastPoint.x
      const dy = points[i].y - lastPoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > tolerance) {
        simplified.push(points[i])
        lastPoint = points[i]
      }
    }

    // Always add the last point to close the shape
    if (points.length > 1) {
      simplified.push(points[points.length - 1])
    }

    return simplified
  }

  // Draw the shape based on collected points
  const drawShape = () => {
    const canvas = canvasRef.current
    if (!canvas || points.length < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set line style
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#4a9eff'
    ctx.fillStyle = 'rgba(74, 158, 255, 0.2)'

    // Begin drawing
    ctx.beginPath()

    const displayPoints =
      smoothMode && points.length > 5 ? simplifyPath(points) : points

    ctx.moveTo(displayPoints[0].x, displayPoints[0].y)

    if (smoothMode && displayPoints.length > 2) {
      // Use curve interpolation for smoother lines
      for (let i = 1; i < displayPoints.length - 2; i++) {
        const xc = (displayPoints[i].x + displayPoints[i + 1].x) / 2
        const yc = (displayPoints[i].y + displayPoints[i + 1].y) / 2
        ctx.quadraticCurveTo(displayPoints[i].x, displayPoints[i].y, xc, yc)
      }

      // Curve through the last two points
      if (displayPoints.length > 2) {
        const lastIndex = displayPoints.length - 1
        ctx.quadraticCurveTo(
          displayPoints[lastIndex - 1].x,
          displayPoints[lastIndex - 1].y,
          displayPoints[lastIndex].x,
          displayPoints[lastIndex].y
        )
      }
    } else {
      // Draw straight lines between points
      for (let i = 1; i < displayPoints.length; i++) {
        ctx.lineTo(displayPoints[i].x, displayPoints[i].y)
      }
    }

    // Close the path if we have enough points
    if (displayPoints.length > 2) {
      ctx.closePath()
      ctx.fill()
    }

    ctx.stroke()
  }

  // Handle mouse/touch start
  const handleStart = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return

    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    setPoints([{ x, y }])
  }

  // Handle mouse/touch move
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    setPoints((prev) => [...prev, { x, y }])
  }

  // Handle mouse/touch end
  const handleEnd = () => {
    setIsDrawing(false)
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }

  // Create 3D shape from the drawn shape
  const createShape = () => {
    if (points.length < 3) return

    // Use simplified points if in smooth mode
    const processedPoints =
      smoothMode && points.length > 5 ? simplifyPath(points) : points

    // Normalize points to be centered around origin
    const normalizedPoints = normalizePoints(processedPoints)

    // Send points to parent
    onShapeCreated(normalizedPoints)

    // Clear canvas for next drawing
    clearCanvas()
  }

  // Normalize points to be centered around origin with values between -1 and 1
  const normalizePoints = (pts: Point[]): Point[] => {
    if (pts.length === 0) return []

    // Find min/max
    let minX = pts[0].x
    let maxX = pts[0].x
    let minY = pts[0].y
    let maxY = pts[0].y

    pts.forEach((pt) => {
      minX = Math.min(minX, pt.x)
      maxX = Math.max(maxX, pt.x)
      minY = Math.min(minY, pt.y)
      maxY = Math.max(maxY, pt.y)
    })

    // Calculate center and size
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const size = Math.max(maxX - minX, maxY - minY) / 2

    // Normalize
    return pts.map((pt) => ({
      x: (pt.x - centerX) / size,
      y: (pt.y - centerY) / size,
    }))
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Initial clear
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [width, height])

  // Update drawing when points change
  useEffect(() => {
    drawShape()
  }, [points, strokeWidth, drawShape])

  return (
    <div className='flex flex-col items-center z-10000'>
      <div className='relative mb-2'>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className='border border-gray-300 rounded-lg bg-white shadow-lg touch-none'
        />
      </div>

      <div className='flex space-x-3 mt-2'>
        <motion.button
          onClick={() => setStrokeWidth((prev) => Math.max(1, prev - 1))}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full'
          aria-label='Decrease stroke width'
        >
          <FiMinimize className='w-5 h-5' />
        </motion.button>

        <motion.button
          onClick={() => setStrokeWidth((prev) => Math.min(10, prev + 1))}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full'
          aria-label='Increase stroke width'
        >
          <FiMaximize className='w-5 h-5' />
        </motion.button>

        <motion.button
          onClick={() => setSmoothMode(!smoothMode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 ${
            smoothMode
              ? 'bg-blue-100 hover:bg-blue-200'
              : 'bg-gray-100 hover:bg-gray-200'
          } rounded-full`}
          aria-label='Toggle smooth mode'
        >
          <svg
            className='w-5 h-5'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M4 20L20 4M4 4L20 20'
              stroke={smoothMode ? '#4a9eff' : '#888'}
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </motion.button>

        <motion.button
          onClick={clearCanvas}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-red-100 hover:bg-red-200 rounded-full'
          aria-label='Clear canvas'
        >
          <FiTrash className='w-5 h-5 text-red-600' />
        </motion.button>

        <motion.button
          onClick={createShape}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-primary/20 hover:bg-primary/30 rounded-full'
          aria-label='Create 3D shape'
          disabled={points.length < 3}
        >
          <FiCheck className='w-5 h-5 text-primary' />
        </motion.button>
      </div>
    </div>
  )
}
