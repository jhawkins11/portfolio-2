'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useShapes } from './ShapesContext'
import { Point, ShapeWithHoles } from './types'
import DrawingCanvasPortal from '../DrawingCanvasPortal'
import CustomShapesUIButton from './CustomShapesUIButton'

type ShapesControlsProps = {
  onClickSettings: () => void
}

export function ShapesControls({ onClickSettings }: ShapesControlsProps) {
  const { shapes, addShape, clearShapes } = useShapes()
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)

  const handleShapeCreated = (shapeData: Point[] | ShapeWithHoles) => {
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
    <div className='fixed z-[450] bottom-5 right-5'>
      <DrawingCanvasPortal
        isOpen={showDrawingCanvas}
        onClose={() => setShowDrawingCanvas(false)}
        onShapeCreated={handleShapeCreated}
      />

      <div className='flex items-center gap-2'>
        {/* Clear All Button (Desktop) */}
        {shapes.length > 0 && (
          <motion.button
            onClick={clearShapes}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-red-500/80 to-orange-600/80 hover:from-red-500/90 hover:to-orange-600/90 text-white p-3 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden group hidden sm:inline-flex' // fixed height, auto width
          >
            <span className='relative z-10 text-sm font-medium flex items-center'>
              <FiTrash2 className='w-5 h-5 mr-2' />
              {`Clear All (${shapes.length})`}
            </span>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
          </motion.button>
        )}

        {/* Clear All Button */}
        {shapes.length > 0 && (
          <motion.button
            onClick={clearShapes}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-red-500/80 to-orange-600/80 hover:from-red-500/90 hover:to-orange-600/90 text-white p-3 w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden group sm:hidden'
            aria-label='Clear all shapes'
          >
            <FiTrash2 className='w-5 h-5 relative z-10' />
            <div className='absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
          </motion.button>
        )}

        {/* Settings Button */}
        <CustomShapesUIButton onClick={onClickSettings} />

        {/* Add Shape Button */}
        <motion.button
          onClick={() => setShowDrawingCanvas(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='bg-gradient-to-r from-emerald-500/80 to-teal-600/80 hover:from-emerald-500/90 hover:to-teal-600/90 text-white p-3 w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden group'
          aria-label='Add shape'
        >
          <FiPlus className='w-5 h-5 relative z-10' />
          <div className='absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
        </motion.button>
      </div>
    </div>
  )
}
