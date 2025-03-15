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
} from 'react-icons/fi'

type Point = {
  x: number
  y: number
}

type Path = {
  points: Point[]
  isHole: boolean
}

// Define a type for the shape with holes
type ShapeWithHoles = {
  outerShape: Point[]
  holes: Point[][]
  materialType?: string
}

type DrawingCanvasProps = {
  onShapeCreated: (shapeData: ShapeWithHoles) => void
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

  // Clear the canvas and reset paths
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCurrentPath([])
    setPaths([])
  }

  // Finish current path and add to paths collection
  const finishCurrentPath = () => {
    if (currentPath.length < 3) {
      setCurrentPath([])
      return
    }

    const newPath: Path = {
      points: currentPath,
      isHole: holeModeActive,
    }

    setPaths((prevPaths) => [...prevPaths, newPath])
    setCurrentPath([])
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

  // Check if point is inside a path
  const isPointInPath = (point: Point, pathPoints: Point[]): boolean => {
    // Ray casting algorithm to determine if a point is inside a polygon
    let inside = false
    for (let i = 0, j = pathPoints.length - 1; i < pathPoints.length; j = i++) {
      const xi = pathPoints[i].x,
        yi = pathPoints[i].y
      const xj = pathPoints[j].x,
        yj = pathPoints[j].y

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    return inside
  }

  // Find which paths are holes in other paths
  const determineHoles = (paths: Path[]): Path[] => {
    // No paths to process
    if (paths.length === 0) return paths

    // If only one path exists, it can't be a hole
    if (paths.length === 1) {
      return [{ ...paths[0], isHole: false }]
    }

    // Calculate area for each path to help determine which are likely holes
    const pathsWithArea = paths.map((path) => {
      // Calculate the area of the polygon using Shoelace formula
      let area = 0
      for (
        let i = 0, j = path.points.length - 1;
        i < path.points.length;
        j = i++
      ) {
        area +=
          (path.points[j].x + path.points[i].x) *
          (path.points[j].y - path.points[i].y)
      }
      area = Math.abs(area) / 2

      // Calculate centroid
      const centroid = path.points.reduce(
        (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
        { x: 0, y: 0 }
      )
      centroid.x /= path.points.length
      centroid.y /= path.points.length

      return {
        ...path,
        area,
        centroid,
      }
    })

    // Sort paths by area (largest first)
    pathsWithArea.sort((a, b) => b.area - a.area)

    // The largest path should never be a hole (unless explicitly set)
    const processedPaths = pathsWithArea.map((path, index) => {
      // If this path was explicitly set as a hole by the user, respect that setting
      if (path.isHole) {
        // Ensure the hole is properly oriented (clockwise)
        return { ...path, isHole: true }
      }

      // The largest path is never a hole (unless explicitly set by user)
      if (index === 0) return { ...path, isHole: false }

      // For smaller paths, check if they're inside another path
      const isInsideAnotherPath = pathsWithArea.some(
        (otherPath, otherIndex) => {
          // Skip self-comparison and only check against larger paths
          if (otherPath === path || otherIndex >= index) return false

          // Only consider non-hole paths as containers
          if (otherPath.isHole) return false

          // Check if the centroid of this path is inside the other path
          return isPointInPath(path.centroid, otherPath.points)
        }
      )

      return {
        ...path,
        isHole: isInsideAnotherPath,
      }
    })

    console.log(
      `Processed ${processedPaths.length} paths: ${
        processedPaths.filter((p) => !p.isHole).length
      } outer shapes and ${processedPaths.filter((p) => p.isHole).length} holes`
    )

    return processedPaths
  }

  // Draw the current state to the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all completed paths
    paths.forEach((path) => {
      const displayPoints =
        smoothMode && path.points.length > 5
          ? simplifyPath(path.points)
          : path.points

      ctx.beginPath()
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Use different colors for outer shapes and holes
      if (path.isHole) {
        ctx.strokeStyle = '#FF5733' // Orange-red for holes
        ctx.fillStyle = 'rgba(255, 87, 51, 0.2)'
      } else {
        ctx.strokeStyle = '#4a9eff' // Blue for outer shapes
        ctx.fillStyle = 'rgba(74, 158, 255, 0.2)'
      }

      ctx.moveTo(displayPoints[0].x, displayPoints[0].y)

      if (smoothMode && displayPoints.length > 2) {
        // Draw curves for smoother shapes
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
        // Draw straight lines
        for (let i = 1; i < displayPoints.length; i++) {
          ctx.lineTo(displayPoints[i].x, displayPoints[i].y)
        }
      }

      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    })

    // Draw current path if it exists
    if (currentPath.length > 0) {
      const displayPoints =
        smoothMode && currentPath.length > 5
          ? simplifyPath(currentPath)
          : currentPath

      ctx.beginPath()
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Use different colors based on hole mode
      if (holeModeActive) {
        ctx.strokeStyle = '#FF5733' // Orange-red for holes
      } else {
        ctx.strokeStyle = '#4a9eff' // Blue for outer shapes
      }

      ctx.moveTo(displayPoints[0].x, displayPoints[0].y)

      if (smoothMode && displayPoints.length > 2) {
        // Draw curves for current path
        for (let i = 1; i < displayPoints.length; i++) {
          ctx.lineTo(displayPoints[i].x, displayPoints[i].y)
        }
      } else {
        // Draw straight lines for current path
        for (let i = 1; i < displayPoints.length; i++) {
          ctx.lineTo(displayPoints[i].x, displayPoints[i].y)
        }
      }

      ctx.stroke()
    }
  }

  // Handle mouse/touch start
  const handleStart = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return

    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    setCurrentPath([{ x, y }])
  }

  // Handle mouse/touch move
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    setCurrentPath((prev) => [...prev, { x, y }])
  }

  // Handle mouse/touch end
  const handleEnd = () => {
    if (isDrawing) {
      finishCurrentPath()
    }
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

  // Create 3D shape from the drawn paths
  const createShape = () => {
    if (paths.length === 0) return

    // Process paths to determine outer shapes and holes
    const processedPaths = determineHoles(paths)

    // Find the main shape (not a hole)
    const mainPath = processedPaths.find((path) => !path.isHole)
    if (!mainPath) {
      console.error('No outer shape found - all paths are holes')
      return // No outer shape found
    }

    // Collect all the holes
    const holesPaths = processedPaths.filter((path) => path.isHole)

    // Use simplified points if in smooth mode
    const processedOuterShape =
      smoothMode && mainPath.points.length > 5
        ? simplifyPath(mainPath.points)
        : mainPath.points

    // Process holes if any
    const processedHoles = holesPaths.map((holePath) => {
      return smoothMode && holePath.points.length > 5
        ? simplifyPath(holePath.points)
        : holePath.points
    })

    // Normalize points for the outer shape
    const normalizedOuterShape = normalizePoints(processedOuterShape)

    // Normalize points for holes using the same scaling as the outer shape
    const { centerX, centerY, size } =
      calculateNormalizationParams(processedOuterShape)
    const normalizedHoles = processedHoles.map((holePoints) =>
      normalizePointsWithParams(holePoints, { centerX, centerY, size })
    )

    console.log(
      'Creating shape with',
      normalizedOuterShape.length,
      'outer points and',
      normalizedHoles.length,
      'holes'
    )

    // Let's create the shape with the selected material
    const shapeWithHoles: ShapeWithHoles = {
      outerShape: normalizedOuterShape,
      holes: normalizedHoles,
      materialType: materialType,
    }

    console.log('Created shape with material:', materialType)
    onShapeCreated(shapeWithHoles)

    // Clear canvas for next drawing
    clearCanvas()
  }

  // Calculate normalization parameters
  const calculateNormalizationParams = (pts: Point[]) => {
    if (pts.length === 0)
      return {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        centerX: 0,
        centerY: 0,
        size: 1,
      }

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

    return { minX, maxX, minY, maxY, centerX, centerY, size }
  }

  // Normalize points using provided parameters
  const normalizePointsWithParams = (
    pts: Point[],
    params: { centerX: number; centerY: number; size: number }
  ) => {
    return pts.map((pt) => ({
      x: (pt.x - params.centerX) / params.size,
      y: (pt.y - params.centerY) / params.size,
    }))
  }

  // Normalize points to be centered around origin with values between -1 and 1
  const normalizePoints = (pts: Point[]): Point[] => {
    if (pts.length === 0) return []

    const params = calculateNormalizationParams(pts)
    return normalizePointsWithParams(pts, params)
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

  // Update drawing when paths or current path changes
  useEffect(() => {
    drawCanvas()
  }, [paths, currentPath, strokeWidth, smoothMode, holeModeActive])

  return (
    <div className='relative flex flex-col items-center'>
      {/* Show help overlay */}
      {showHelp && (
        <div className='fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-4 max-w-sm'>
            <h4 className='font-bold mb-2'>How to draw complex shapes:</h4>
            <ol className='list-decimal pl-5 mb-3 text-sm space-y-2'>
              <li>Draw the outer shape first (blue)</li>
              <li>
                Click the &quot;Hole Mode&quot; button (changes to orange)
              </li>
              <li>Draw inner holes inside the outer shape</li>
              <li>Toggle back to normal mode to add more outer shapes</li>
              <li>Click &quot;Create Shape&quot; when finished</li>
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

      {/* Main drawing container with fixed height to prevent layout shifts */}
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
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className='absolute inset-0 z-10 touch-none'
        ></canvas>

        {/* Mode indicator */}
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

        {/* Material indicator - moved to top-right */}
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

      {/* Fixed height space for material menu to prevent layout shifts */}
      <div className='mb-2 pb-2 w-full flex justify-center'>
        {/* Material selection menu */}
        {showMaterialMenu && (
          <div className='p-4 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-gray-200 mb-2 w-full max-w-[300px]'>
            <div className='flex justify-between items-center mb-2'>
              <h4 className='text-sm font-medium text-gray-700 flex items-center'>
                <FiDroplet className='mr-1' /> Material Type
              </h4>
              <button
                onClick={() => setShowMaterialMenu(false)}
                className='text-gray-500 hover:text-gray-700 transition-colors'
                aria-label='Close material menu'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='grid grid-cols-1 gap-2'>
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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </button>

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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-cyan-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </button>

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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-gray-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </button>

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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-purple-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className='flex flex-wrap justify-center gap-2'>
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

        {/* Material selection button */}
        <motion.button
          onClick={() => setShowMaterialMenu(!showMaterialMenu)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 ${
            showMaterialMenu
              ? 'bg-blue-100 hover:bg-blue-200'
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

        {/* Existing buttons */}
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
          onClick={() => setShowHelp(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full'
          aria-label='Show help'
        >
          <FiInfo className='w-5 h-5' />
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
          className='p-2 bg-green-100 hover:bg-green-200 rounded-full'
          aria-label='Create shape'
        >
          <FiCheck className='w-5 h-5 text-green-600' />
        </motion.button>
      </div>
    </div>
  )
}
