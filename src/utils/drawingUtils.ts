export type Point = {
  x: number
  y: number
}

export type Path = {
  points: Point[]
  isHole: boolean // Flag explicitly set by user during drawing mode
}

/**
 * Reduces redundant points in a path based on distance tolerance.
 * Helps simplify overly dense paths from freehand drawing.
 */
export const simplifyPath = (points: Point[], tolerance = 10): Point[] => {
  // If 2 or fewer points, no simplification possible/needed
  if (points.length <= 2) return points // Corrected guard clause

  const simplified: Point[] = [points[0]]
  let lastPoint = points[0]

  // Iterate through intermediate points
  for (let i = 1; i < points.length - 1; i++) {
    const dx = points[i].x - lastPoint.x
    const dy = points[i].y - lastPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Only keep points farther than the tolerance from the last *kept* point
    if (distance > tolerance) {
      simplified.push(points[i])
      lastPoint = points[i] // Update lastPoint only when adding to simplified list
    }
  }

  // Always keep the last point
  simplified.push(points[points.length - 1])

  return simplified
}

/**
 * Checks if point is inside polygon using the Ray Casting algorithm.
 */
export const isPointInPath = (point: Point, pathPoints: Point[]): boolean => {
  let inside = false
  // Loop through polygon edges (j -> i)
  for (let i = 0, j = pathPoints.length - 1; i < pathPoints.length; j = i++) {
    const xi = pathPoints[i].x,
      yi = pathPoints[i].y
    const xj = pathPoints[j].x,
      yj = pathPoints[j].y

    // Ray casting intersection check
    const intersect =
      yi > point.y !== yj > point.y && // Edge crosses horizontal line of point?
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi // Intersection point left of point?

    if (intersect) inside = !inside // Flip state on intersection
  }
  return inside
}

/**
 * Processes drawn paths to identify which are holes.
 * Sorts by area (largest first), assumes largest is outer shape.
 * Checks if centroids of smaller paths are inside larger, non-hole paths.
 * Respects user's explicit `isHole` flag from hole drawing mode.
 */
export const determineHoles = (paths: Path[]): Path[] => {
  if (paths.length <= 1) return paths.map((p) => ({ ...p, isHole: false }))

  // Calculate area (Shoelace formula) and centroid for sorting/checking
  const pathsWithArea = paths.map((path) => {
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
    const centroid = path.points.reduce(
      (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
      { x: 0, y: 0 }
    )
    centroid.x /= path.points.length
    centroid.y /= path.points.length
    return { ...path, area: Math.abs(area) / 2, centroid }
  })

  // Sort largest area first
  pathsWithArea.sort((a, b) => b.area - a.area)

  const processedPaths = pathsWithArea.map((path, index) => {
    // Keep user-defined holes
    if (path.isHole) return { ...path, isHole: true }
    // Largest shape can't be a hole (unless user drew it in hole mode)
    if (index === 0) return { ...path, isHole: false }

    // Check if centroid is inside any larger, non-hole shape found so far
    const isInsideAnotherPath = pathsWithArea.some((otherPath, otherIndex) => {
      if (otherIndex >= index || otherPath.isHole) return false // Only check larger, non-hole paths
      return isPointInPath(path.centroid, otherPath.points)
    })
    return { ...path, isHole: isInsideAnotherPath }
  })

  return processedPaths
}

/**
 * Calculates center and scaling factor for normalization based on bounding box.
 */
export const calculateNormalizationParams = (pts: Point[]) => {
  if (pts.length === 0) return { centerX: 0, centerY: 0, size: 1 }

  let minX = pts[0].x,
    maxX = pts[0].x,
    minY = pts[0].y,
    maxY = pts[0].y
  pts.forEach((pt) => {
    minX = Math.min(minX, pt.x)
    maxX = Math.max(maxX, pt.x)
    minY = Math.min(minY, pt.y)
    maxY = Math.max(maxY, pt.y)
  })

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  // Get maximum dimension of the shape
  const width = maxX - minX
  const height = maxY - minY
  const maxDim = Math.max(width, height)

  // Ensure we always normalize to [-1, 1] range, regardless of how small the shape is
  // Division by 2 because we want points to range from -1 to 1 (range of 2)
  const size = maxDim > 0 ? maxDim / 2 : 0.5

  return { centerX, centerY, size }
}

/**
 * Applies normalization using pre-calculated center and size.
 * Centers points around (0,0) and scales to roughly fit [-1, 1] range.
 */
export const normalizePointsWithParams = (
  pts: Point[],
  params: { centerX: number; centerY: number; size: number }
): Point[] => {
  // Apply translation and scaling
  return pts.map((pt) => ({
    x: (pt.x - params.centerX) / params.size,
    y: (pt.y - params.centerY) / params.size, // Y inversion happens later for 3D
  }))
}

/**
 * Calculates parameters and normalizes points.
 * Prepares 2D canvas coordinates for use in 3D space.
 */
export const normalizePoints = (pts: Point[]): Point[] => {
  if (pts.length === 0) return []
  // Calculate normalization parameters based on these points
  const params = calculateNormalizationParams(pts)
  // Apply the normalization
  return normalizePointsWithParams(pts, params)
}
