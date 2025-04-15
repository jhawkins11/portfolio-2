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
