import { Point } from './drawingUtils'

// Enhanced helper function to check if a shape is approximately circular
/**
 * Approximates if a set of points form a circle by checking variance
 * from the average radius relative to the centroid.
 */
export function isCircular(points: Point[]): {
  isCircle: boolean
  radius: number
} {
  if (points.length < 8) return { isCircle: false, radius: 0 }

  const center = points.reduce(
    (acc, p) => ({
      x: acc.x + p.x / points.length,
      y: acc.y + p.y / points.length,
    }),
    { x: 0, y: 0 }
  )

  const radii = points.map((p) =>
    Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
  )
  const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length

  // Add a robust check for near-zero radius BEFORE tolerance check
  const ZERO_THRESHOLD = 1e-9 // Define a small threshold for floating point comparison
  if (avgRadius < ZERO_THRESHOLD) {
    return { isCircle: false, radius: 0 } // Degenerate case or single point
  }

  // Check if radii are within ~12% of the average radius
  const tolerance = 0.12
  const isCircle = radii.every(
    (r) => Math.abs(r - avgRadius) / avgRadius < tolerance
  )

  return { isCircle, radius: avgRadius }
}

// Function to check if a shape should be rendered as a 3D sphere or a rounded box
export function detectShapeType(points: Point[]): {
  type: string
  radius: number
} {
  const { isCircle, radius } = isCircular(points)

  if (isCircle) {
    return { type: 'sphere', radius }
  }

  // For other shapes, check if they're close to a regular polygon
  // Calculate bounding box
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))

  const width = maxX - minX
  const height = maxY - minY

  // Check if it's roughly square-shaped (width and height similar)
  if (Math.abs(width - height) / Math.max(width, height) < 0.2) {
    // It's square-like, but we'll only return 'box' for specific cases
    // This ensures most shapes use extrusion instead of becoming boxes
    if (points.length < 12) {
      return { type: 'extrude', radius }
    }
    return { type: 'box', radius }
  }

  return { type: 'extrude', radius }
}
