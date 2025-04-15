'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiTrash,
  FiCheck,
  FiMinimize,
  FiMaximize,
  FiLayers,
  FiInfo,
  FiDroplet,
  FiX,
} from 'react-icons/fi'
import {
  Point,
  Path,
  simplifyPath,
  determineHoles,
  calculateNormalizationParams,
  normalizePointsWithParams,
} from '../../utils/drawingUtils'

// Define the shape structure expected by the parent (ShapeGenerator)
export type ShapeWithHoles = {
  outerShape: Point[]
  holes: Point[][]
  materialType?: string
}

type DrawingCanvasProps = {
  onShapeCreated: (shapeData: ShapeWithHoles) => void // Expect structured data
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
  const [currentPath, setCurrentPath] = useState<Point[]>([])
  const [paths, setPaths] = useState<Path[]>([])
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [smoothMode, setSmoothMode] = useState(true)
  const [holeModeActive, setHoleModeActive] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [materialType, setMaterialType] = useState<string>('standard')
  const [showMaterialMenu, setShowMaterialMenu] = useState(false)

  // Clear the canvas and reset internal state
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCurrentPath([]) // Clear the path currently being drawn
    setPaths([]) // Clear all completed paths
    setHoleModeActive(false) // Reset to drawing outer shapes
  }

  // Add the currently drawn path to the list of completed paths
  const finishCurrentPath = () => {
    // Ignore paths with too few points to form a shape
    if (currentPath.length < 3) {
      setCurrentPath([])
      return
    }
    // Create a new path object, marking if it was drawn in hole mode
    const newPath: Path = {
      points: currentPath,
      isHole: holeModeActive, // Mark based on current mode
    }
    setPaths((prevPaths) => [...prevPaths, newPath])
    setCurrentPath([]) // Reset for the next path
  }

  // Draw the current state (completed paths + path being drawn) onto the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all completed paths
    paths.forEach((path) => {
      // Apply simplification if smooth mode is on and path is complex enough
      const displayPoints =
        smoothMode && path.points.length > 5
          ? simplifyPath(path.points)
          : path.points

      if (displayPoints.length < 2) return // Need at least 2 points to draw

      ctx.beginPath()
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Style differently based on whether it's a hole or outer shape
      if (path.isHole) {
        ctx.strokeStyle = '#FF5733' // Orange-red for holes
        ctx.fillStyle = 'rgba(255, 87, 51, 0.2)'
      } else {
        ctx.strokeStyle = '#4a9eff' // Blue for outer shapes
        ctx.fillStyle = 'rgba(74, 158, 255, 0.2)'
      }

      ctx.moveTo(displayPoints[0].x, displayPoints[0].y)

      // Draw smooth curves or straight lines
      if (smoothMode && displayPoints.length > 2) {
        // Basic curve implementation (could use more advanced like Catmull-Rom)
        for (let i = 1; i < displayPoints.length - 1; i++) {
          const xc = (displayPoints[i].x + displayPoints[i + 1].x) / 2
          const yc = (displayPoints[i].y + displayPoints[i + 1].y) / 2
          ctx.quadraticCurveTo(displayPoints[i].x, displayPoints[i].y, xc, yc)
        }
        // Connect last segment
        ctx.lineTo(
          displayPoints[displayPoints.length - 1].x,
          displayPoints[displayPoints.length - 1].y
        )
      } else {
        // Draw straight lines
        for (let i = 1; i < displayPoints.length; i++) {
          ctx.lineTo(displayPoints[i].x, displayPoints[i].y)
        }
      }

      ctx.closePath() // Close path for filling
      ctx.fill()
      ctx.stroke()
    })

    // Draw the path currently being drawn (if any)
    if (currentPath.length > 0) {
      // No simplification needed for live drawing preview
      const displayPoints = currentPath
      if (displayPoints.length < 2) return

      ctx.beginPath()
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // Style based on current drawing mode (hole or shape)
      ctx.strokeStyle = holeModeActive ? '#FF5733' : '#4a9eff'

      ctx.moveTo(displayPoints[0].x, displayPoints[0].y)
      for (let i = 1; i < displayPoints.length; i++) {
        ctx.lineTo(displayPoints[i].x, displayPoints[i].y)
      }
      ctx.stroke() // Don't fill or close the path being drawn
    }
  }

  // --- Event Handlers ---

  const handleStart = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return
    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    setCurrentPath([{ x, y }]) // Start a new path
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    setCurrentPath((prev) => [...prev, { x, y }]) // Add point to current path
  }

  const handleEnd = () => {
    if (isDrawing) {
      finishCurrentPath() // Add the completed path to the list
    }
    setIsDrawing(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) =>
    handleStart(e.clientX, e.clientY)
  const handleMouseMove = (e: React.MouseEvent) =>
    handleMove(e.clientX, e.clientY)
  const handleMouseUp = () => handleEnd()

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientX, e.touches[0].clientY)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }

  /**
   * Finalizes the drawn shape(s), processes paths to identify holes,
   * normalizes coordinates, and calls the onShapeCreated callback.
   */
  const createShape = () => {
    if (paths.length === 0) {
      console.warn('No paths drawn to create a shape.')
      return
    }

    // Use the refactored utility to determine outer shapes and holes
    const processedPaths = determineHoles(paths)

    // Find the main outer shape (assuming the largest non-hole is the primary one)
    const mainPath = processedPaths.find((path) => !path.isHole)
    if (!mainPath) {
      console.error('No outer shape found - cannot create 3D object.')
      // Optionally provide user feedback here
      return
    }

    // Collect all identified holes
    const holesPaths = processedPaths.filter((path) => path.isHole)

    // Simplify paths if needed (optional based on smoothMode)
    // Note: Simplification might slightly alter hole/shape registration if tolerance is too high
    const outerShapePoints =
      smoothMode && mainPath.points.length > 5
        ? simplifyPath(mainPath.points)
        : mainPath.points
    const holeShapesPoints = holesPaths.map((holePath) =>
      smoothMode && holePath.points.length > 5
        ? simplifyPath(holePath.points)
        : holePath.points
    )

    // Normalize ALL points based on the bounds of the OUTER shape for consistent scaling
    const normParams = calculateNormalizationParams(outerShapePoints)
    const normalizedOuterShape = normalizePointsWithParams(
      outerShapePoints,
      normParams
    )
    const normalizedHoles = holeShapesPoints.map((holePoints) =>
      normalizePointsWithParams(holePoints, normParams)
    )

    // Prepare the final shape data structure
    const shapeWithHoles: ShapeWithHoles = {
      outerShape: normalizedOuterShape,
      holes: normalizedHoles,
      materialType: materialType, // Include the selected material type
    }

    // Pass the structured data to the parent component via the callback
    onShapeCreated(shapeWithHoles)

    // Clear canvas for next drawing
    clearCanvas()
  }

  // Initialize canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [width, height])

  // Redraw canvas whenever paths or drawing state changes
  useEffect(() => {
    drawCanvas()
  }, [paths, currentPath, strokeWidth, smoothMode, holeModeActive])

  // Handle body scroll lock for help modal
  useEffect(() => {
    if (showHelp) document.body.style.overflow = 'hidden'
    return () => {
      if (showHelp) document.body.style.overflow = 'unset'
    }
  }, [showHelp])

  return (
    <div className='relative flex flex-col items-center'>
      {/* Help Modal */}
      {showHelp && (
        <div className='fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-4 max-w-sm'>
            <h4 className='font-bold mb-2'>How to draw complex shapes:</h4>
            <ol className='list-decimal pl-5 mb-3 text-sm space-y-2'>
              <li>Draw the outer shape first (blue)</li>
              <li>
                Click the{' '}
                <FiLayers className='inline w-4 h-4 mx-1 text-orange-600' />{' '}
                &quot;Hole Mode&quot; button (changes to orange)
              </li>
              <li>Draw inner holes inside the outer shape</li>
              <li>Toggle back to normal mode to add more outer shapes</li>
              <li>
                Click <FiCheck className='inline w-4 h-4 mx-1 text-green-600' />{' '}
                &quot;Create Shape&quot; when finished
              </li>
            </ol>
            <div className='text-xs text-gray-600 mb-3'>
              Note: Currently the 3D rendering works best with a single outer
              shape and holes. Multiple separate shapes may have unexpected
              results.
            </div>
            <button
              className='bg-blue-500 text-white px-3 py-1 rounded-md w-full'
              onClick={() => setShowHelp(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div
        className='relative mb-2 rounded-lg overflow-hidden border border-gray-200 shadow-inner bg-white'
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // End drawing if mouse leaves canvas
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className='absolute inset-0 z-10 touch-none cursor-crosshair' // Add crosshair cursor
        ></canvas>

        {/* Mode Indicator */}
        <div className='absolute top-2 left-2 text-xs py-1 px-2 rounded-md bg-white/90 backdrop-blur-sm shadow-sm'>
          {holeModeActive ? (
            <span className='flex items-center text-orange-600 font-semibold'>
              <FiLayers className='mr-1' /> Hole Mode
            </span>
          ) : (
            <span className='flex items-center text-blue-600 font-semibold'>
              <FiLayers className='mr-1' /> Shape Mode
            </span>
          )}
        </div>

        {/* Material Indicator */}
        <div className='absolute top-2 right-2 text-xs py-1 px-2 rounded-md bg-white/80 backdrop-blur-sm shadow-sm flex items-center gap-1'>
          <FiDroplet
            className={`
            ${materialType === 'standard' ? 'text-blue-600' : ''}
            ${materialType === 'glass' ? 'text-cyan-600' : ''}
            ${materialType === 'metal' ? 'text-gray-600' : ''}
            ${materialType === 'plastic' ? 'text-purple-600' : ''}
          `}
          />
          <span className='capitalize'>{materialType}</span>
        </div>
      </div>

      {/* Material Selection Menu (Conditional Render) */}
      <div className='mb-2 pb-2 w-full flex justify-center'>
        {' '}
        {/* Reserve space */}
        {showMaterialMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='p-4 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-gray-200 w-full max-w-[300px]'
          >
            {/* ... material menu content (buttons, etc.) ... */}
            <div className='flex justify-between items-center mb-2'>
              <h4 className='text-sm font-medium text-gray-700 flex items-center'>
                <FiDroplet className='mr-1' /> Material Type
              </h4>
              <button
                onClick={() => setShowMaterialMenu(false)}
                className='text-gray-500 hover:text-gray-700 transition-colors'
                aria-label='Close material menu'
              >
                <FiX className='h-4 w-4' />
              </button>
            </div>
            <div className='grid grid-cols-1 gap-2'>
              {/* Button for Standard */}
              <button
                onClick={() => {
                  setMaterialType('standard')
                  setShowMaterialMenu(false)
                }}
                className={`px-3 py-2.5 text-sm rounded-md flex items-center justify-between transition-all duration-200 ${
                  materialType === 'standard'
                    ? 'bg-blue-100 text-blue-700 font-medium ring-2 ring-blue-300 ring-opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <FiDroplet className='text-blue-600' />
                  <span className='capitalize'>Standard</span>
                </span>
                {materialType === 'standard' && (
                  <FiCheck className='h-4 w-4 text-blue-600' />
                )}
              </button>
              {/* Button for Glass */}
              <button
                onClick={() => {
                  setMaterialType('glass')
                  setShowMaterialMenu(false)
                }}
                className={`px-3 py-2.5 text-sm rounded-md flex items-center justify-between transition-all duration-200 ${
                  materialType === 'glass'
                    ? 'bg-cyan-100 text-cyan-700 font-medium ring-2 ring-cyan-300 ring-opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <FiDroplet className='text-cyan-600' />
                  <span className='capitalize'>Glass</span>
                </span>
                {materialType === 'glass' && (
                  <FiCheck className='h-4 w-4 text-cyan-600' />
                )}
              </button>
              {/* Button for Metal */}
              <button
                onClick={() => {
                  setMaterialType('metal')
                  setShowMaterialMenu(false)
                }}
                className={`px-3 py-2.5 text-sm rounded-md flex items-center justify-between transition-all duration-200 ${
                  materialType === 'metal'
                    ? 'bg-gray-100 text-gray-700 font-medium ring-2 ring-gray-300 ring-opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <FiDroplet className='text-gray-600' />
                  <span className='capitalize'>Metal</span>
                </span>
                {materialType === 'metal' && (
                  <FiCheck className='h-4 w-4 text-gray-600' />
                )}
              </button>
              {/* Button for Plastic */}
              <button
                onClick={() => {
                  setMaterialType('plastic')
                  setShowMaterialMenu(false)
                }}
                className={`px-3 py-2.5 text-sm rounded-md flex items-center justify-between transition-all duration-200 ${
                  materialType === 'plastic'
                    ? 'bg-purple-100 text-purple-700 font-medium ring-2 ring-purple-300 ring-opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <FiDroplet className='text-purple-600' />
                  <span className='capitalize'>Plastic</span>
                </span>
                {materialType === 'plastic' && (
                  <FiCheck className='h-4 w-4 text-purple-600' />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Control Buttons */}
      <div className='flex flex-wrap justify-center gap-2'>
        {/* Hole Mode Toggle */}
        <motion.button
          onClick={() => setHoleModeActive(!holeModeActive)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 ${
            holeModeActive
              ? 'bg-orange-100 hover:bg-orange-200'
              : 'bg-blue-100 hover:bg-blue-200'
          } rounded-full`}
          aria-label='Toggle hole mode'
        >
          <FiLayers
            className={`w-5 h-5 ${
              holeModeActive ? 'text-orange-600' : 'text-blue-600'
            }`}
          />
        </motion.button>
        {/* Material Select Toggle */}
        <motion.button
          onClick={() => setShowMaterialMenu(!showMaterialMenu)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 ${
            showMaterialMenu
              ? 'bg-indigo-100 hover:bg-indigo-200'
              : 'bg-gray-100 hover:bg-gray-200'
          } rounded-full`}
          aria-label='Select material'
        >
          <FiDroplet
            className={`w-5 h-5 ${
              materialType === 'standard'
                ? 'text-blue-600'
                : materialType === 'glass'
                ? 'text-cyan-600'
                : materialType === 'metal'
                ? 'text-gray-600'
                : 'text-purple-600'
            }`}
          />
        </motion.button>
        {/* Stroke Width Controls */}
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
        {/* Smooth Mode Toggle */}
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
          {/* Simple Smooth/Jagged icon */}
          <svg
            className='w-5 h-5'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            {smoothMode ? (
              <path
                d='M4 12C4 12 7.5 4 12 4C16.5 4 20 12 20 12C20 12 16.5 20 12 20C7.5 20 4 12 4 12Z'
                stroke={smoothMode ? '#4a9eff' : '#888'}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            ) : (
              <polyline
                points='4 12 8 8 12 16 16 8 20 12'
                stroke={smoothMode ? '#4a9eff' : '#888'}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            )}
          </svg>
        </motion.button>
        {/* Help Button */}
        <motion.button
          onClick={() => setShowHelp(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full'
          aria-label='Show help'
        >
          <FiInfo className='w-5 h-5' />
        </motion.button>
        {/* Clear Button */}
        <motion.button
          onClick={clearCanvas}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-red-100 hover:bg-red-200 rounded-full'
          aria-label='Clear canvas'
        >
          <FiTrash className='w-5 h-5 text-red-600' />
        </motion.button>
        {/* Create Shape Button */}
        <motion.button
          onClick={createShape}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-green-100 hover:bg-green-200 rounded-full'
          aria-label='Create shape'
        >
          <FiCheck className='w-5 h-5 text-green-600' />
        </motion.button>
      </div>
    </div>
  )
}
