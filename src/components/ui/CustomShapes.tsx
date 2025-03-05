'use client'

import { useState, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTool } from 'react-icons/fi'

import ShapeGenerator from './ShapeGenerator'
import DrawingCanvasPortal from './DrawingCanvasPortal'

// Create a context to share state between components
const ShapesContext = createContext<{
  shapes: CustomShape[]
  addShape: (shapeData: Point[] | ShapeWithHoles) => void
  clearShapes: () => void
}>({
  shapes: [],
  addShape: () => {},
  clearShapes: () => {},
})

type Point = {
  x: number
  y: number
}

// Shape with holes support
type ShapeWithHoles = {
  outerShape: Point[]
  holes: Point[][]
}

type CustomShape = {
  id: string
  points: Point[]
  holes?: Point[][] // Added support for holes
  color: string
  height: number
  speed: number
  position: [number, number, number]
}

type CustomShapesProps = {
  enabled?: boolean
  speed?: number
  standalone?: boolean
  uiOnly?: boolean
  shapesOnly?: boolean
}

// Track which positions have been used to avoid duplicates
let usedPositionIndices: number[] = []

// Generate random color in the blue/purple/pink spectrum
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 60) + 210 // 210-270 range (blue to purple)
  const saturation = Math.floor(Math.random() * 20) + 70 // 70-90%
  const lightness = Math.floor(Math.random() * 20) + 50 // 50-70%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Generate position from predefined good viewable locations
const getShapePosition = (): [number, number, number] => {
  // Predefined positions that work well visually (x, y, z)
  const predefinedPositions: [number, number, number][] = [
    // Top right quadrant positions
    [1.5, 1.2, 1.2],
    [1.2, 1.5, 0.8],
    [1.6, 0.8, 1.0],

    // Top left quadrant positions
    [-1.5, 1.2, 1.2],
    [-1.2, 1.5, 0.8],
    [-1.6, 0.8, 1.0],

    // Bottom right quadrant positions
    [1.5, -1.2, 1.2],
    [1.2, -1.5, 0.8],
    [1.6, -0.8, 1.0],

    // Bottom left quadrant positions
    [-1.5, -1.2, 1.2],
    [-1.2, -1.5, 0.8],
    [-1.6, -0.8, 1.0],

    // Additional positions with good visibility
    [0, 1.7, 1.2], // Top center
    [0, -1.7, 1.2], // Bottom center
    [1.7, 0, 1.2], // Right center
    [-1.7, 0, 1.2], // Left center
  ]

  // Find available positions
  const availableIndices = Array.from(
    { length: predefinedPositions.length },
    (_, i) => i
  ).filter((index) => !usedPositionIndices.includes(index))

  // If all positions are used, reset the tracking
  if (availableIndices.length === 0) {
    usedPositionIndices = []
    availableIndices.push(
      ...Array.from({ length: predefinedPositions.length }, (_, i) => i)
    )
  }

  // Select a random available position
  const randomIndex = Math.floor(Math.random() * availableIndices.length)
  const selectedIndex = availableIndices[randomIndex]

  // Mark this position as used
  usedPositionIndices.push(selectedIndex)

  console.log(
    `Using position at index ${selectedIndex}: ${predefinedPositions[selectedIndex]}`
  )
  return predefinedPositions[selectedIndex]
}

// This component ONLY renders Three.js objects (no DOM elements)
function ShapesRenderer({
  shapes,
  speed,
}: {
  shapes: CustomShape[]
  speed: number
}) {
  console.log('Rendering ShapesRenderer with', shapes.length, 'shapes')

  return (
    <>
      {shapes.map((shape) => (
        <ShapeGenerator
          key={shape.id}
          points={shape.points}
          holes={shape.holes}
          color={shape.color}
          height={shape.height}
          speed={shape.speed * speed}
          position={shape.position}
        />
      ))}
    </>
  )
}

// Provider component to share shape state
export function ShapesProvider({ children }: { children: React.ReactNode }) {
  const [shapes, setShapes] = useState<CustomShape[]>([])

  const addShape = (shapeData: Point[] | ShapeWithHoles) => {
    // Check if we received a shape with holes
    const isShapeWithHoles = (
      data: Point[] | ShapeWithHoles
    ): data is ShapeWithHoles =>
      data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'outerShape' in data &&
      'holes' in data

    let points: Point[]
    let holes: Point[][] | undefined

    if (isShapeWithHoles(shapeData)) {
      console.log('Adding complex shape with', shapeData.holes.length, 'holes')
      points = shapeData.outerShape
      holes = shapeData.holes

      if (points.length < 3) {
        console.warn('Not enough points in outer shape (minimum 3 required)')
        return
      }
    } else {
      console.log('Adding simple shape with', shapeData.length, 'points')
      points = shapeData

      if (points.length < 3) {
        console.warn('Not enough points to create a shape (minimum 3 required)')
        return
      }
    }

    const newShape: CustomShape = {
      id: Date.now().toString(),
      points,
      holes,
      color: getRandomColor(),
      height: Math.random() * 0.2 + 0.2, // 0.2 to 0.4 (more consistent height)
      speed: Math.random() * 0.3 + 0.5, // 0.5 to 0.8 (slower rotation)
      position: getShapePosition(),
    }

    console.log('Created new shape:', newShape)
    setShapes((prev) => [...prev, newShape])
  }

  const clearShapes = () => {
    console.log('Clearing all shapes')
    setShapes([])
  }

  return (
    <ShapesContext.Provider value={{ shapes, addShape, clearShapes }}>
      {children}
    </ShapesContext.Provider>
  )
}

// Hook to use shapes context
export function useShapes() {
  return useContext(ShapesContext)
}

// UI Controls component
function ShapesControls({
  onSettingsClick,
}: {
  onSettingsClick?: (() => void) | null
}) {
  const { shapes, addShape, clearShapes } = useShapes()
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)

  const handleShapeCreated = (shapeData: Point[] | ShapeWithHoles) => {
    console.log('ShapesControls received shape data')

    // Validate shape data
    const isShapeWithHoles = (data: unknown): data is ShapeWithHoles =>
      data !== null &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'outerShape' in data &&
      'holes' in data

    if (isShapeWithHoles(shapeData)) {
      if (shapeData.outerShape.length >= 3) {
        addShape(shapeData)
        setShowDrawingCanvas(false)
      } else {
        console.error('Invalid shape - not enough points in outer shape')
      }
    } else if (Array.isArray(shapeData) && shapeData.length >= 3) {
      addShape(shapeData)
      setShowDrawingCanvas(false)
    } else {
      console.error('Invalid shape data', shapeData)
    }
  }

  return (
    <div className='fixed z-[450]'>
      {/* Use Portal for drawing canvas overlay */}
      <DrawingCanvasPortal
        isOpen={showDrawingCanvas}
        onClose={() => setShowDrawingCanvas(false)}
        onShapeCreated={handleShapeCreated}
      />

      {/* Action buttons */}
      <div className='fixed bottom-5 right-5 z-[450] flex flex-row space-x-2'>
        {shapes.length > 0 && (
          <motion.button
            onClick={clearShapes}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-red-500/80 to-orange-600/80 hover:from-red-500/90 hover:to-orange-600/90 text-white px-3 py-2 rounded-full shadow-lg relative overflow-hidden group'
          >
            <span className='relative z-10 text-sm font-medium'>
              Clear All ({shapes.length})
            </span>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
          </motion.button>
        )}

        <motion.button
          onClick={() => setShowDrawingCanvas(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='bg-gradient-to-r from-emerald-500/80 to-teal-600/80 hover:from-emerald-500/90 hover:to-teal-600/90 text-white p-3 w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden group'
        >
          <FiPlus className='w-5 h-5 relative z-10' />
          <div className='absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
        </motion.button>

        {/* Settings button */}
        {onSettingsClick && (
          <motion.button
            onClick={onSettingsClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-purple-500/80 to-pink-600/80 hover:from-purple-500/90 hover:to-pink-600/90 text-white p-3 w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden group'
          >
            <FiTool className='w-5 h-5 relative z-10' />
            <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
          </motion.button>
        )}
      </div>
    </div>
  )
}

// Main component
export default function CustomShapes({
  enabled = true,
  speed = 1,
  standalone = false,
  uiOnly = false,
  shapesOnly = false,
  onSettingsClick = null,
}: CustomShapesProps & { onSettingsClick?: (() => void) | null }) {
  if (!enabled) return null

  // Only render UI controls if uiOnly or standalone is true
  if (uiOnly) {
    return <ShapesControls onSettingsClick={onSettingsClick} />
  }

  // Only render shapes if shapesOnly or standalone is true
  if (shapesOnly) {
    return <ShapesContent speed={speed} />
  }

  // Render both in standalone mode
  if (standalone) {
    return (
      <ShapesProvider>
        <ShapesContent speed={speed} />
        <ShapesControls onSettingsClick={onSettingsClick} />
      </ShapesProvider>
    )
  }

  return null
}

// Component to render shapes using context
function ShapesContent({ speed }: { speed: number }) {
  const { shapes } = useShapes()

  console.log('ShapesContent rendering with', shapes.length, 'shapes')

  return <ShapesRenderer shapes={shapes} speed={speed} />
}
