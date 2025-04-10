'use client'

import { useState, createContext, useContext, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTool } from 'react-icons/fi'
import { useFrame } from '@react-three/fiber'
import dynamic from 'next/dynamic'

// Dynamic import for ShapeGenerator
const ShapeGenerator = dynamic(() => import('./ShapeGenerator'), {
  ssr: false,
})

import DrawingCanvasPortal from './DrawingCanvasPortal'

// Create a context to share state between components
const ShapesContext = createContext<{
  shapes: CustomShape[]
  addShape: (shapeData: Point[] | ShapeWithHoles) => void
  clearShapes: () => void
  setShapes: React.Dispatch<React.SetStateAction<CustomShape[]>>
}>({
  shapes: [],
  addShape: () => {},
  clearShapes: () => {},
  setShapes: () => {},
})

type Point = {
  x: number
  y: number
}

// Shape with holes support
type ShapeWithHoles = {
  outerShape: Point[]
  holes: Point[][]
  materialType?: string
}

type CustomShape = {
  id: string
  points: Point[]
  holes?: Point[][]
  color: string
  height: number
  speed: number
  position: [number, number, number]
  materialType?: string
  entranceProgress?: number
  entranceDelay?: number
  entranceDuration?: number
  entranceEffect?: string
}

type CustomShapesProps = {
  enabled?: boolean
  speed?: number
  standalone?: boolean
  uiOnly?: boolean
  shapesOnly?: boolean
  onSettingsClick?: (() => void) | null
}

// Track which positions have been used to avoid duplicates
let usedPositionIndices: number[] = []

// Enhanced entrance animation with various effects
const entranceEffects = ['pop', 'slide', 'spiral', 'bounce', 'fade']

// Generate random color in the blue/purple/pink spectrum with more variety
const getRandomColor = () => {
  // More varied color palette
  const palettes = [
    // Blue to purple range
    {
      hue: Math.floor(Math.random() * 60) + 210,
      saturation: Math.floor(Math.random() * 30) + 65,
      lightness: Math.floor(Math.random() * 25) + 50,
    },
    // Pink to red range
    {
      hue: Math.floor(Math.random() * 40) + 320,
      saturation: Math.floor(Math.random() * 20) + 70,
      lightness: Math.floor(Math.random() * 20) + 55,
    },
    // Teal to cyan range
    {
      hue: Math.floor(Math.random() * 40) + 170,
      saturation: Math.floor(Math.random() * 25) + 70,
      lightness: Math.floor(Math.random() * 20) + 50,
    },
    // Occasional gold/yellow (rarer)
    {
      hue: Math.floor(Math.random() * 30) + 40,
      saturation: Math.floor(Math.random() * 20) + 75,
      lightness: Math.floor(Math.random() * 15) + 60,
    },
  ]

  // Pick a random palette with weighted probability
  const rand = Math.random()
  const palette =
    rand < 0.4
      ? palettes[0]
      : rand < 0.7
      ? palettes[1]
      : rand < 0.9
      ? palettes[2]
      : palettes[3]

  return `hsl(${palette.hue}, ${palette.saturation}%, ${palette.lightness}%)`
}

// Generate position from expanded set of positions for better distribution
const getShapePosition = (): [number, number, number] => {
  // Expanded set of positions that work well visually (x, y, z)
  const predefinedPositions: [number, number, number][] = [
    // Far left positions
    [-6.0, 3.5, -4.0],
    [-5.8, 1.8, -3.5],
    [-5.5, -1.5, -3.0],
    [-5.2, -3.0, -4.0],

    // Left positions
    [-4.2, 4.0, -3.0],
    [-3.8, 2.5, -2.5],
    [-3.5, 0.8, -2.0],
    [-3.7, -2.2, -3.0],
    [-4.0, -3.5, -4.0],

    // Left-center positions
    [-2.6, 3.3, -2.5],
    [-2.3, 1.4, -3.5],
    [-2.5, -0.8, -2.8],
    [-2.0, -2.8, -3.0],

    // Center-left positions (spaced out from center)
    [-1.5, 3.0, -2.0],
    [-1.3, 1.0, -3.0],
    [-1.2, -1.0, -2.5],
    [-1.4, -3.0, -3.5],

    // Center-right positions (spaced out from center)
    [1.5, 3.0, -2.0],
    [1.3, 1.0, -3.0],
    [1.2, -1.0, -2.5],
    [1.4, -3.0, -3.5],

    // Right-center positions
    [2.6, 3.3, -2.5],
    [2.3, 1.4, -3.5],
    [2.5, -0.8, -2.8],
    [2.0, -2.8, -3.0],

    // Right positions
    [4.2, 4.0, -3.0],
    [3.8, 2.5, -2.5],
    [3.5, 0.8, -2.0],
    [3.7, -2.2, -3.0],
    [4.0, -3.5, -4.0],

    // Far right positions
    [6.0, 3.5, -4.0],
    [5.8, 1.8, -3.5],
    [5.5, -1.5, -3.0],
    [5.2, -3.0, -4.0],

    // Extreme positions for more diversity
    [7.0, 2.0, -5.5],
    [6.5, -2.0, -5.0],
    [-7.0, 2.0, -5.5],
    [-6.5, -2.0, -5.0],
    [0, 6.0, -6.0],
    [0, -6.0, -6.0],

    // Foreground positions (closer to camera)
    [2.0, 1.0, -0.5],
    [-2.0, -1.0, -0.5],
    [1.2, -1.2, -0.3],
    [-1.2, 1.2, -0.3],
    [3.0, 0.0, -0.8],
    [-3.0, 0.0, -0.8],
    [0, 2.5, -0.6],
    [0, -2.5, -0.6],
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
  const { setShapes } = useContext(ShapesContext)

  // Add animation logic for shapes entrance
  useFrame((state) => {
    // Clone the shapes array to avoid mutating the original
    const updatedShapes = [...shapes]
    let hasUpdates = false

    // Animate each shape's entrance
    updatedShapes.forEach((shape) => {
      if (shape.entranceProgress !== undefined && shape.entranceProgress < 1) {
        // Only start animating after the delay has passed
        if (state.clock.elapsedTime > (shape.entranceDelay || 0)) {
          // Calculate how much progress to add based on frame time and duration
          // @ts-expect-error - delta exists on state but is missing in types
          const progressStep = state.delta / (shape.entranceDuration || 0.5)
          shape.entranceProgress = Math.min(
            1,
            (shape.entranceProgress || 0) + progressStep
          )
          hasUpdates = true
        }
      }
    })

    // Only update state if changes were made
    if (hasUpdates) {
      setShapes(updatedShapes)
    }
  })

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
          materialType={shape.materialType}
          entranceProgress={shape.entranceProgress || 1}
          entranceEffect={shape.entranceEffect}
        />
      ))}
    </>
  )
}

// Provider component to share shape state
export function ShapesProvider({ children }: { children: React.ReactNode }) {
  const [shapes, setShapes] = useState<CustomShape[]>([])

  const addShape = useCallback((shapeData: Point[] | ShapeWithHoles) => {
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
    let materialType: string | undefined

    if (isShapeWithHoles(shapeData)) {
      points = shapeData.outerShape
      holes = shapeData.holes
      materialType = shapeData.materialType

      if (points.length < 3) {
        console.warn('Not enough points in outer shape (minimum 3 required)')
        return
      }
    } else {
      points = shapeData
      materialType = undefined

      if (points.length < 3) {
        console.warn('Not enough points to create a shape (minimum 3 required)')
        return
      }
    }

    // Pick random entrance animation effect
    const entranceEffect =
      entranceEffects[Math.floor(Math.random() * entranceEffects.length)]

    const newShape: CustomShape = {
      id: Date.now().toString(),
      points,
      holes,
      color: getRandomColor(),
      height: Math.random() * 0.3 + 0.2, // 0.2 to 0.5 (more varied heights)
      speed: Math.random() * 0.4 + 0.4, // 0.4 to 0.8 (more varied speeds)
      position: getShapePosition(),
      materialType: materialType || randomizeMaterial(),
      entranceProgress: 0,
      entranceDelay: Math.random() * 0.8, // More varied delays for staggered appearance
      entranceDuration: Math.random() * 0.8 + 0.7, // 0.7 to 1.5 seconds duration (slower for more visible effect)
      entranceEffect: entranceEffect, // Store the entrance effect type
    }

    setShapes((prev) => [...prev, newShape])
  }, [])

  const clearShapes = useCallback(() => {
    setShapes([])
  }, [])

  return (
    <ShapesContext.Provider
      value={{ shapes, addShape, clearShapes, setShapes }}
    >
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

// Helper function to randomly select a material type
function randomizeMaterial(): string {
  const materials = ['standard', 'glass', 'metal', 'plastic']
  const weights = [0.5, 0.2, 0.2, 0.1] // Standard is most common, plastic least common

  const rand = Math.random()
  let cumulativeWeight = 0

  for (let i = 0; i < materials.length; i++) {
    cumulativeWeight += weights[i]
    if (rand < cumulativeWeight) {
      return materials[i]
    }
  }

  return 'standard'
}

// Main component
export default function CustomShapes({
  enabled = true,
  speed = 1,
  standalone = false,
  uiOnly = false,
  shapesOnly = false,
  onSettingsClick = null,
}: CustomShapesProps) {
  // Fix unused variable warnings by only destructuring what we need
  const { shapes } = useShapes()

  if (!enabled) return null

  // Only render the UI elements
  if (uiOnly) {
    return <ShapesControls onSettingsClick={onSettingsClick} />
  }

  // Only render the shapes
  if (shapesOnly) {
    return <ShapesRenderer shapes={shapes} speed={speed} />
  }

  // Render both in standalone mode
  if (standalone) {
    return (
      <ShapesProvider>
        <ShapesRenderer shapes={shapes} speed={speed} />
        <ShapesControls onSettingsClick={onSettingsClick} />
      </ShapesProvider>
    )
  }

  // Default rendering
  return (
    <>
      <ShapesRenderer shapes={shapes} speed={speed} />
      <ShapesControls onSettingsClick={onSettingsClick} />
    </>
  )
}
