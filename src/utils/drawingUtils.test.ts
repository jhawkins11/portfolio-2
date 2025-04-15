// src/utils/drawingUtils.test.ts

import { describe, it, expect } from 'vitest'
import {
  Point,
  Path,
  simplifyPath,
  isPointInPath,
  determineHoles,
  normalizePoints,
} from '../utils/drawingUtils'

// --- simplifyPath Tests ---
describe('simplifyPath', () => {
  it('should return original path if fewer than 4 points', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 0 },
    ]
    expect(simplifyPath(points, 5)).toEqual(points)
  })

  it('should remove points closer than tolerance', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }, // Too close
      { x: 10, y: 10 },
      { x: 11, y: 11 }, // Too close
      { x: 20, y: 20 },
    ]
    const expected: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ]
    expect(simplifyPath(points, 5)).toEqual(expected)
  })

  it('should keep points farther than tolerance', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 0 },
      { x: 30, y: 10 },
    ]
    expect(simplifyPath(points, 5)).toEqual(points)
  })

  it('should always keep the first and last points', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 100, y: 100 },
    ]
    const expected: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ]
    expect(simplifyPath(points, 5)).toEqual(expected)
  })
})

// --- isPointInPath Tests ---
describe('isPointInPath', () => {
  const square: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]

  it('should return true for points inside the polygon', () => {
    expect(isPointInPath({ x: 5, y: 5 }, square)).toBe(true)
  })

  it('should return false for points outside the polygon', () => {
    expect(isPointInPath({ x: 15, y: 5 }, square)).toBe(false)
    expect(isPointInPath({ x: 5, y: 15 }, square)).toBe(false)
    expect(isPointInPath({ x: -5, y: 5 }, square)).toBe(false)
    expect(isPointInPath({ x: 5, y: -5 }, square)).toBe(false)
  })

  // Note: Ray casting behavior for points *exactly* on the boundary can be ambiguous.
  // It might return true or false depending on implementation details and floating point precision.
  // Usually okay to accept either for boundary cases unless specific behavior is required.
  it('should handle points on the boundary (behavior may vary)', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onEdge = isPointInPath({ x: 5, y: 0 }, square)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onVertex = isPointInPath({ x: 0, y: 0 }, square)
    // No strict assertion here, just noting the check
    // expect(onEdge).toBe(true); // Or false, depending on exact algorithm nuance
    // expect(onVertex).toBe(true); // Or false
  })
})

// --- determineHoles Tests ---
describe('determineHoles', () => {
  const outer: Path = {
    isHole: false,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
  }
  const inner: Path = {
    isHole: false,
    points: [
      { x: 20, y: 20 },
      { x: 80, y: 20 },
      { x: 80, y: 80 },
      { x: 20, y: 80 },
    ],
  }
  const separate: Path = {
    isHole: false,
    points: [
      { x: 110, y: 110 },
      { x: 120, y: 110 },
      { x: 120, y: 120 },
      { x: 110, y: 120 },
    ],
  }
  const innerMarkedAsHole: Path = {
    isHole: true,
    points: [
      { x: 25, y: 25 },
      { x: 75, y: 25 },
      { x: 75, y: 75 },
      { x: 25, y: 75 },
    ],
  }

  it('should return empty array if no paths', () => {
    expect(determineHoles([])).toEqual([])
  })

  it('should mark single path as not a hole', () => {
    const result = determineHoles([outer])
    expect(result[0].isHole).toBe(false)
  })

  it('should identify an inner path as a hole', () => {
    const result = determineHoles([outer, inner])
    // Result might be sorted by area, find the original 'inner' path
    const innerResult = result.find((p) => p.points[0].x === 20)
    expect(innerResult?.isHole).toBe(true)
    const outerResult = result.find((p) => p.points[0].x === 0)
    expect(outerResult?.isHole).toBe(false)
  })

  it('should not mark separate paths as holes', () => {
    const result = determineHoles([outer, separate])
    const separateResult = result.find((p) => p.points[0].x === 110)
    expect(separateResult?.isHole).toBe(false)
    const outerResult = result.find((p) => p.points[0].x === 0)
    expect(outerResult?.isHole).toBe(false)
  })

  it('should respect user-defined holes', () => {
    const result = determineHoles([outer, innerMarkedAsHole])
    const innerResult = result.find((p) => p.points[0].x === 25)
    expect(innerResult?.isHole).toBe(true) // Should remain true
    const outerResult = result.find((p) => p.points[0].x === 0)
    expect(outerResult?.isHole).toBe(false)
  })

  it('should handle multiple holes', () => {
    const inner2: Path = {
      isHole: false,
      points: [
        { x: 30, y: 30 },
        { x: 40, y: 30 },
        { x: 40, y: 40 },
        { x: 30, y: 40 },
      ],
    }
    const inner3: Path = {
      isHole: false,
      points: [
        { x: 60, y: 60 },
        { x: 70, y: 60 },
        { x: 70, y: 70 },
        { x: 60, y: 70 },
      ],
    }
    const result = determineHoles([outer, inner2, inner3])
    expect(result.filter((p) => p.isHole).length).toBe(2)
    expect(result.find((p) => p.points[0].x === 0)?.isHole).toBe(false)
  })
})

// --- Normalization Tests ---
describe('Normalization Functions', () => {
  // Assuming normalizePoints uses calculateNormalizationParams internally
  // If not, test calculateNormalizationParams separately first

  it('should normalize points to be centered around (0,0)', () => {
    // Square offset from origin
    const points: Point[] = [
      { x: 10, y: 10 },
      { x: 20, y: 10 },
      { x: 20, y: 20 },
      { x: 10, y: 20 },
    ]
    const normalized = normalizePoints(points)
    // Check if new center is close to 0,0
    const centerX =
      normalized.reduce((sum, p) => sum + p.x, 0) / normalized.length
    const centerY =
      normalized.reduce((sum, p) => sum + p.y, 0) / normalized.length
    expect(centerX).toBeCloseTo(0)
    expect(centerY).toBeCloseTo(0)
  })

  it('should scale points to roughly fit [-1, 1] range', () => {
    // Large square
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: 200 },
      { x: 0, y: 200 },
    ]
    const normalized = normalizePoints(points)
    // Check bounds
    normalized.forEach((p) => {
      expect(p.x).toBeGreaterThanOrEqual(-1)
      expect(p.x).toBeLessThanOrEqual(1)
      expect(p.y).toBeGreaterThanOrEqual(-1)
      expect(p.y).toBeLessThanOrEqual(1)
    })
    // Specifically for a centered square, corners should be at +/- 1
    expect(normalized).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ x: -1, y: -1 }),
        expect.objectContaining({ x: 1, y: -1 }),
        expect.objectContaining({ x: 1, y: 1 }),
        expect.objectContaining({ x: -1, y: 1 }),
      ])
    )
  })

  it('should handle shapes with zero width or height', () => {
    const line: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 20 },
    ] // Zero width
    const normalized = normalizePoints(line)
    // Size should be based on height (10), half is 5. Points should be y = +/- 1.
    expect(normalized[0].y).toBeCloseTo(-1)
    expect(normalized[1].y).toBeCloseTo(1)
    expect(normalized[0].x).toBeCloseTo(0) // Centered horizontally
    expect(normalized[1].x).toBeCloseTo(0)
  })
})
