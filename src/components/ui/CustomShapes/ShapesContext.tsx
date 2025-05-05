'use client'

import {
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { Point, ShapeWithHoles, CustomShape } from './types'
import {
  getRandomColor,
  getShapePosition,
  randomizeMaterial,
  entranceEffects,
} from './utils'

// Type for the context value
export interface ShapesContextValue {
  shapes: CustomShape[]
  addShape: (shapeData: Point[] | ShapeWithHoles) => void
  clearShapes: () => void
  setShapes: Dispatch<SetStateAction<CustomShape[]>>
}

// Create a context to share state between components
const ShapesContext = createContext<ShapesContextValue | undefined>(undefined)

// Provider component to share shape state
export function ShapesProvider({ children }: { children: ReactNode }) {
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
      height: Math.random() * 0.3 + 0.2,
      speed: Math.random() * 0.4 + 0.4,
      position: getShapePosition(),
      materialType: materialType || randomizeMaterial(),
      entranceProgress: 0,
      entranceDelay: Math.random() * 0.8,
      entranceDuration: Math.random() * 0.8 + 0.7,
      entranceEffect: entranceEffect,
    }

    setShapes((prev) => [...prev, newShape])
  }, [])

  const clearShapes = useCallback(() => {
    setShapes([])
    // Reset used positions when clearing shapes
    // This requires making usedPositionIndices exportable/mutable from utils,
    // or managing it within the context. Let's manage it here for simplicity.
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
export function useShapes(): ShapesContextValue {
  const context = useContext(ShapesContext)
  if (context === undefined) {
    throw new Error('useShapes must be used within a ShapesProvider')
  }
  return context
}
