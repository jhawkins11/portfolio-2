'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import DrawingCanvas from './DrawingCanvas'

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

type DrawingCanvasPortalProps = {
  onShapeCreated: (shapeData: Point[] | ShapeWithHoles) => void
  onClose: () => void
  isOpen: boolean
}

export default function DrawingCanvasPortal({
  onShapeCreated,
  onClose,
  isOpen,
}: DrawingCanvasPortalProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Log portal state
  console.log('DrawingCanvasPortal rendering with isOpen:', isOpen)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Early return if not mounted (SSR) or not open
  if (!isMounted || !isOpen) return null

  // Handle shape creation with validation
  const handleShapeCreated = (shapeData: Point[] | ShapeWithHoles) => {
    console.log('DrawingCanvasPortal: Shape creation called')

    // Validate shape data
    const isShapeWithHoles = (data: unknown): data is ShapeWithHoles =>
      data !== null &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'outerShape' in data &&
      'holes' in data

    if (isShapeWithHoles(shapeData)) {
      console.log('DrawingCanvasPortal: Complex shape created with', {
        outerPoints: shapeData.outerShape.length,
        holes: shapeData.holes.length,
        material: shapeData.materialType,
      })

      if (shapeData.outerShape.length >= 3) {
        console.log(
          'DrawingCanvasPortal: Passing valid complex shape to parent handler'
        )
        onShapeCreated(shapeData)
        onClose()
      } else {
        console.error(
          'DrawingCanvasPortal: Invalid shape - not enough points in outer shape'
        )
      }
    } else if (Array.isArray(shapeData) && shapeData.length >= 3) {
      console.log(
        'DrawingCanvasPortal: Simple shape created with',
        shapeData.length,
        'points'
      )
      console.log(
        'DrawingCanvasPortal: Passing valid simple shape to parent handler'
      )
      onShapeCreated(shapeData)
      onClose()
    } else {
      console.error('DrawingCanvasPortal: Invalid shape data', shapeData)
    }
  }

  // Use createPortal to render outside the normal DOM hierarchy
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647, // Maximum z-index
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <div className='bg-white rounded-lg p-5 shadow-xl max-w-xl w-full mx-4'>
        <h3 className='text-lg font-bold mb-2 text-center'>Draw Your Shape</h3>
        <p className='text-sm text-gray-600 mb-4 text-center'>
          Draw a closed shape that will be converted to 3D
        </p>

        <DrawingCanvas
          onShapeCreated={handleShapeCreated}
          width={300}
          height={300}
        />

        <div className='mt-3 flex justify-end'>
          <button
            onClick={onClose}
            className='px-3 py-2 text-sm text-gray-600 hover:text-gray-800'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
