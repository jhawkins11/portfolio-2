'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import DrawingCanvas from './DrawingCanvas'
import { FiInfo } from 'react-icons/fi'

type Point = {
  x: number
  y: number
}

// Shape with holes support
type ShapeWithHoles = {
  outerShape: Point[]
  holes: Point[][]
}

type DrawingCanvasPortalProps = {
  onShapeCreated: (shapeData: Point[] | ShapeWithHoles) => void
  onClose: () => void
  isOpen: boolean
}

const DrawingCanvasPortal = ({
  onShapeCreated,
  onClose,
  isOpen,
}: DrawingCanvasPortalProps) => {
  const [mounted, setMounted] = useState(false)
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Show the tip for 5 seconds when the portal opens
      setShowTip(true)
      const timer = setTimeout(() => {
        setShowTip(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleShapeCreated = (shapeData: Point[] | ShapeWithHoles) => {
    console.log('DrawingCanvasPortal received shape data:', shapeData)

    // Validate shape data
    const isShapeWithHoles = (data: any): data is ShapeWithHoles =>
      data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'outerShape' in data &&
      'holes' in data

    if (isShapeWithHoles(shapeData)) {
      if (shapeData.outerShape.length >= 3) {
        onShapeCreated(shapeData)
        onClose()
      } else {
        console.error('Shape creation failed: Not enough points in outer shape')
      }
    } else if (Array.isArray(shapeData) && shapeData.length >= 3) {
      onShapeCreated(shapeData)
      onClose()
    } else {
      console.error('Shape creation failed: Invalid shape data')
    }
  }

  if (!mounted || !isOpen) return null

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

export default DrawingCanvasPortal
