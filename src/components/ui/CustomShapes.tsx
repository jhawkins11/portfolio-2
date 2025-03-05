'use client'

import { useState, createContext, useContext } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'

import ShapeGenerator from './ShapeGenerator'
import DrawingCanvasPortal from './DrawingCanvasPortal'

// Create a context to share state between components
const ShapesContext = createContext<{
  shapes: CustomShape[]
  addShape: (points: Point[]) => void
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

type CustomShape = {
  id: string
  points: Point[]
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

// Generate random color in the blue/purple/pink spectrum
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 60) + 210 // 210-270 range (blue to purple)
  const saturation = Math.floor(Math.random() * 20) + 70 // 70-90%
  const lightness = Math.floor(Math.random() * 20) + 50 // 50-70%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Generate random position with emphasis on outer edges but keep within visible bounds
const getRandomPosition = (): [number, number, number] => {
  // Generate a number between 0 and 1
  const radius = Math.random() * 0.3 + 0.7 // 0.7 to 1.0 (outer area)
  const angle = Math.random() * Math.PI * 2 // 0 to 2π (full circle)

  // Convert to cartesian coordinates (keeping within visible bounds)
  return [
    Math.cos(angle) * radius * 1.8, // x: pushes to outer circle with radius 1.8 (was 3)
    Math.sin(angle) * radius * 1.8, // y: pushes to outer circle with radius 1.8 (was 3)
    Math.random() * 2 + 0.5, // z: 0.5 to 2.5 (varied depth)
  ]
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

  const addShape = (points: Point[]) => {
    console.log('Adding shape with', points.length, 'points')
    if (points.length < 3) return

    const newShape: CustomShape = {
      id: Date.now().toString(),
      points,
      color: getRandomColor(),
      height: Math.random() * 0.2 + 0.2, // 0.2 to 0.4 (more consistent height)
      speed: Math.random() * 0.3 + 0.5, // 0.5 to 0.8 (slower rotation)
      position: getRandomPosition(),
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
function ShapesControls() {
  const { shapes, addShape, clearShapes } = useShapes()
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)

  const handleShapeCreated = (points: Point[]) => {
    addShape(points)
    setShowDrawingCanvas(false)
  }

  return (
    <div className='fixed z-[9999]'>
      {/* Use Portal for drawing canvas overlay */}
      <DrawingCanvasPortal
        isOpen={showDrawingCanvas}
        onClose={() => setShowDrawingCanvas(false)}
        onShapeCreated={handleShapeCreated}
      />

      {/* Action buttons */}
      <div className='fixed bottom-5 right-5 z-[1000] flex flex-col space-y-2'>
        {shapes.length > 0 && (
          <motion.button
            onClick={clearShapes}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='bg-red-500/80 hover:bg-red-600/90 text-white p-2 rounded-full shadow-lg'
          >
            Clear All ({shapes.length})
          </motion.button>
        )}

        <motion.button
          onClick={() => setShowDrawingCanvas(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='bg-primary/80 hover:bg-primary/90 text-white p-3 rounded-full shadow-lg'
        >
          <FiPlus className='w-5 h-5' />
        </motion.button>
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
}: CustomShapesProps) {
  if (!enabled) return null

  // If standalone mode, render with own Canvas and context
  if (standalone) {
    return (
      <ShapesProvider>
        <div className='relative w-full h-full'>
          {/* 3D Canvas for displaying shapes */}
          <div className='absolute inset-0 z-0'>
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
              <Stage environment='city' intensity={0.5} shadows>
                <ShapesContent speed={speed} />
              </Stage>
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={10}
              />
            </Canvas>
          </div>

          {/* UI Controls - rendered outside Canvas */}
          <ShapesControls />
        </div>
      </ShapesProvider>
    )
  }

  // For embedded mode with specific render modes
  if (uiOnly) {
    return <ShapesControls />
  }

  if (shapesOnly) {
    return <ShapesContent speed={speed} />
  }

  // This should not happen in embedded mode
  console.error(
    'CustomShapes rendered in embedded mode without uiOnly or shapesOnly prop'
  )
  return null
}

// Component to render shapes using context
function ShapesContent({ speed }: { speed: number }) {
  const { shapes } = useShapes()

  console.log('ShapesContent rendering with', shapes.length, 'shapes')

  return <ShapesRenderer shapes={shapes} speed={speed} />
}
