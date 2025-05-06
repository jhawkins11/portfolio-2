import { describe, it, expect } from 'vitest'
import type { Point } from './drawingUtils'
import { isCircular, detectShapeType } from './shapeUtils'

// --- isCircular Tests ---
describe('isCircular', () => {
  it('returns false for insufficient points', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]
    expect(isCircular(points)).toEqual({ isCircle: false, radius: 0 })
  })

  it('returns false for degenerate points (all same)', () => {
    const points: Point[] = Array(10).fill({ x: 1, y: 1 })
    // Expectation remains the same, but the function logic is fixed
    expect(isCircular(points)).toEqual({ isCircle: false, radius: 0 })
  })

  it('returns true and correct radius for a perfect circle', () => {
    const radius = 5
    const numPoints = 16
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })
    }
    const result = isCircular(points)
    expect(result.isCircle).toBe(true)
    expect(result.radius).toBeCloseTo(radius)
  })

  it('returns true for a perfect circle not at origin', () => {
    const radius = 5
    const center = { x: 10, y: 15 } // Offset center from origin
    const numPoints = 16
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      points.push({
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      })
    }
    const result = isCircular(points)
    expect(result.isCircle).toBe(true)
    expect(result.radius).toBeCloseTo(radius)
  })

  it('returns false for collinear points', () => {
    // Generate 10 points along a straight line
    const points: Point[] = []
    for (let i = 0; i < 10; i++) {
      points.push({ x: i, y: 2 * i + 3 }) // Points along y = 2x + 3
    }
    const result = isCircular(points)
    expect(result.isCircle).toBe(false)
  })

  it('returns true for a very small circle (close to ZERO_THRESHOLD)', () => {
    // Create a very small circle with radius just above the ZERO_THRESHOLD
    const radius = 1e-8 // Slightly larger than the 1e-9 threshold
    const numPoints = 16
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })
    }
    const result = isCircular(points)
    expect(result.isCircle).toBe(true)
    expect(result.radius).toBeCloseTo(radius)
  })

  it('returns false for a shape just outside the tolerance boundary', () => {
    const radius = 5
    const numPoints = 16
    const points: Point[] = []

    // Create a shape where some points exceed the 12% tolerance
    // Use a systematic deformation rather than random to guarantee test consistency
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI

      // Alternate between normal radius and radius with +/- 13% deviation (just outside tolerance)
      let r = radius
      if (i % 4 === 0) r = radius * 1.13 // +13%
      if (i % 4 === 2) r = radius * 0.87 // -13%

      points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) })
    }

    const result = isCircular(points)
    expect(result.isCircle).toBe(false)
  })

  it('returns true for a shape just within the tolerance boundary', () => {
    const radius = 5
    const numPoints = 16
    const points: Point[] = []

    // Create a shape where all points are within but close to the 12% tolerance
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI

      // Alternate between normal radius and radius with +/- 11% deviation (just within tolerance)
      let r = radius
      if (i % 4 === 0) r = radius * 1.11 // +11%
      if (i % 4 === 2) r = radius * 0.89 // -11%

      points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) })
    }

    const result = isCircular(points)
    expect(result.isCircle).toBe(true)
  })

  it('returns true for a slightly irregular circle (within tolerance)', () => {
    const radius = 5
    const numPoints = 16
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      // Add slight irregularity (within 10% of radius for this test)
      const r = radius + (Math.random() - 0.5) * (radius * 0.1)
      points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) })
    }
    const result = isCircular(points)
    expect(result.isCircle).toBe(true)
    // Check if the calculated average radius is within a reasonable range of the original radius
    // Given the +/- 5% variation on points, the average might deviate slightly more/less.
    // Let's check if it's within +/- 10% of the original radius.
    expect(result.radius).toBeGreaterThan(radius * 0.9)
    expect(result.radius).toBeLessThan(radius * 1.1)
  })

  it('returns false for a square', () => {
    const points: Point[] = [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ]
    expect(isCircular(points).isCircle).toBe(false)
  })

  it('returns false for an ellipse', () => {
    const numPoints = 16
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      points.push({ x: 10 * Math.cos(angle), y: 5 * Math.sin(angle) }) // a=10, b=5
    }
    expect(isCircular(points).isCircle).toBe(false)
  })
})

// --- detectShapeType Tests ---
describe('detectShapeType', () => {
  // Note: These tests implicitly rely on the correctness of isCircular

  it('returns "sphere" for circular points', () => {
    const radius = 5
    const numPoints = 16
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })
    }
    const result = detectShapeType(points)
    expect(result.type).toBe('sphere')
    expect(result.radius).toBeCloseTo(radius)
  })

  it('returns "sphere" for circular points with a different radius', () => {
    const radius = 7.5 // Different radius to verify calculation
    const numPoints = 20 // Different number of points
    const points: Point[] = []
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })
    }
    const result = detectShapeType(points)
    expect(result.type).toBe('sphere')
    expect(result.radius).toBeCloseTo(radius)
  })

  it('returns "extrude" for a square-like shape with 11 points', () => {
    // Create a square with 11 points, which should return 'extrude' per the logic
    const points: Point[] = [
      { x: -1, y: -1 },
      { x: -0.5, y: -1 },
      { x: 0, y: -1 },
      { x: 0.5, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -0.5 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('extrude')
  })

  it('returns "box" for a square-like shape with 12 points', () => {
    // Create a square with 12 points, which should return 'box' per the logic
    const points: Point[] = [
      { x: -1, y: -1 },
      { x: -0.5, y: -1 },
      { x: 0, y: -1 },
      { x: 0.5, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -0.5 },
      { x: -1, y: -0.75 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('box')
  })

  it('returns "extrude" for non-square rectangular points', () => {
    // Create a rectangle with aspect ratio far from 1:1
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 2 },
      { x: 0, y: 2 },
      { x: 2.5, y: 0 },
      { x: 5, y: 0 },
      { x: 7.5, y: 0 },
      { x: 10, y: 1 },
      { x: 5, y: 2 },
      { x: 0, y: 1 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('extrude')
  })

  it('returns "extrude" for triangular points', () => {
    // Create a triangular shape
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 4 },
      { x: 0, y: 5 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('extrude')
  })

  it('returns "extrude" for a shape just outside the square-like tolerance', () => {
    // Create a rectangle with width/height ratio of 0.79, slightly outside the 0.8 threshold
    // This tests the logic: Math.abs(width - height) / Math.max(width, height) < 0.2
    // For this shape: (100 - 79) / 100 = 0.21, which is > 0.2
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 79 }, // 79/100 = 0.79 aspect ratio
      { x: 0, y: 79 },
      // Additional points to meet minimum points requirement
      { x: 25, y: 0 },
      { x: 50, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 20 },
      { x: 100, y: 40 },
      { x: 100, y: 60 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('extrude')
  })

  it('returns "extrude" for a square-like shape with 11 points that is just within tolerance', () => {
    // Create a rectangle with width/height ratio of 0.81, just within the 0.8 threshold
    // This tests the logic: Math.abs(width - height) / Math.max(width, height) < 0.2
    // For this shape: (100 - 81) / 100 = 0.19, which is < 0.2
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 81 }, // 81/100 = 0.81 aspect ratio
      { x: 0, y: 81 },
      // Additional points to make exactly 11 points (should give 'extrude')
      { x: 20, y: 0 },
      { x: 40, y: 0 },
      { x: 60, y: 0 },
      { x: 80, y: 0 },
      { x: 100, y: 40 },
      { x: 50, y: 81 },
      { x: 0, y: 40 },
    ]
    const result = detectShapeType(points)
    // This shape is square-like (within tolerance) but has 11 points, so should be 'extrude'
    expect(result.type).toBe('extrude')
  })

  it('returns "box" for a square-like shape with 12 points that is just within tolerance', () => {
    // Create a rectangle with width/height ratio of 0.81, just within the 0.8 threshold
    // This tests the logic: Math.abs(width - height) / Math.max(width, height) < 0.2
    // For this shape: (100 - 81) / 100 = 0.19, which is < 0.2
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 81 }, // 81/100 = 0.81 aspect ratio
      { x: 0, y: 81 },
      // Additional points to make exactly 12 points (should give 'box')
      { x: 20, y: 0 },
      { x: 40, y: 0 },
      { x: 60, y: 0 },
      { x: 80, y: 0 },
      { x: 100, y: 40 },
      { x: 50, y: 81 },
      { x: 0, y: 40 },
      { x: 0, y: 20 },
    ]
    const result = detectShapeType(points)
    // This shape is square-like (within tolerance) and has 12 points, so should be 'box'
    expect(result.type).toBe('box')
  })

  it('returns "extrude" for square points', () => {
    // Need enough points for isCircular check to pass length requirement
    const points: Point[] = [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: -0.5, y: -1 },
      { x: 0.5, y: -1 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('extrude')
  })

  it('returns "extrude" for irregular points', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 5 },
      { x: 8, y: 15 },
      { x: 3, y: 18 },
      { x: -5, y: 10 },
      { x: -8, y: 3 },
      { x: -2, y: -2 },
      { x: 5, y: -3 },
    ]
    const result = detectShapeType(points)
    expect(result.type).toBe('extrude')
  })
})
