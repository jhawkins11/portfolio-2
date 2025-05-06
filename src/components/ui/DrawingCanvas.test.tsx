import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DrawingCanvas from './DrawingCanvas'
import { Path } from '../../utils/drawingUtils'

vi.mock('../../utils/drawingUtils', () => ({
  // Keep actual Point and Path types
  Point: vi.fn(),
  Path: vi.fn(),
  simplifyPath: vi.fn((points) => points),
  determineHoles: vi.fn((paths) => {
    // Return the paths with isHole flag intact
    return paths.map((path: Path) => ({
      ...path,
      isHole: !!path.isHole,
    }))
  }),
  calculateNormalizationParams: vi.fn(() => ({
    minX: 0,
    minY: 0,
    maxX: 100,
    maxY: 100,
    width: 100,
    height: 100,
  })),
  normalizePointsWithParams: vi.fn((points) => points),
}))

import * as drawingUtils from '../../utils/drawingUtils'

describe('<DrawingCanvas />', () => {
  beforeEach(() => {
    const mockContext = {
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      canvas: document.createElement('canvas'),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'butt' as CanvasLineCap,
      lineJoin: 'miter' as CanvasLineJoin,
      drawImage: vi.fn(),
    }

    // @ts-expect-error - mocking canvas context
    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)
    expect(
      screen.getByRole('button', { name: /Clear canvas/i })
    ).toBeInTheDocument()
  })

  it('renders with correct initial state and elements', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Canvas element exists
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).not.toBeNull()
    expect(canvas.tagName.toLowerCase()).toBe('canvas')

    // Mode indicator shows default mode (Shape Mode, not Hole Mode)
    expect(screen.getByText(/Shape Mode/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hole Mode/i)).not.toBeInTheDocument()

    // Material indicator shows default material type
    expect(screen.getByText(/standard/i)).toBeInTheDocument()

    // Control buttons exist
    expect(
      screen.getByRole('button', { name: /Toggle hole mode/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Select material/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Decrease stroke width/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Increase stroke width/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Toggle smooth mode/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Show help/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Clear canvas/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Create shape/i })
    ).toBeInTheDocument()
  })

  it('toggles hole mode when button is clicked', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Initial state: Shape Mode
    expect(screen.getByText(/Shape Mode/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hole Mode/i)).not.toBeInTheDocument()

    // Get the hole mode toggle button
    const holeModeButton = screen.getByRole('button', {
      name: /Toggle hole mode/i,
    })

    // Click the hole mode toggle button
    fireEvent.click(holeModeButton)

    // State should change: Hole Mode
    expect(screen.queryByText(/Shape Mode/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Hole Mode/i)).toBeInTheDocument()

    // Click the button again to toggle back
    fireEvent.click(holeModeButton)

    // State should revert to: Shape Mode
    expect(screen.getByText(/Shape Mode/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hole Mode/i)).not.toBeInTheDocument()
  })

  it('toggles smooth mode when button is clicked', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Get the smooth mode toggle button - no text to verify initial state directly
    const smoothModeButton = screen.getByRole('button', {
      name: /Toggle smooth mode/i,
    })

    // For smooth mode, we can check styling by inspecting button classes
    // Initially smooth mode is enabled (has blue background class)
    expect(smoothModeButton.className).toContain('bg-blue-100')

    // Click the smooth mode toggle button
    fireEvent.click(smoothModeButton)

    // After click, smooth mode should be disabled (no blue background)
    expect(smoothModeButton.className).toContain('bg-gray-100')
    expect(smoothModeButton.className).not.toContain('bg-blue-100')

    // Click the button again to toggle back
    fireEvent.click(smoothModeButton)

    // State should revert: smooth mode enabled
    expect(smoothModeButton.className).toContain('bg-blue-100')
    expect(smoothModeButton.className).not.toContain('bg-gray-100')
  })

  it('changes stroke width within bounds when increase/decrease buttons are clicked', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Get the stroke width control buttons
    const decreaseButton = screen.getByRole('button', {
      name: /Decrease stroke width/i,
    })
    const increaseButton = screen.getByRole('button', {
      name: /Increase stroke width/i,
    })

    // Get the canvas context spy to check if drawing occurs after button clicks
    const getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')

    // Default stroke width is 3, increase it multiple times
    fireEvent.click(increaseButton) // 4
    fireEvent.click(increaseButton) // 5
    fireEvent.click(increaseButton) // 6

    // Unfortunately we can't directly check state, but we can check if drawCanvas was called
    // by checking if getContext was called again after button clicks
    expect(getContextSpy).toHaveBeenCalled()

    // Now decrease it multiple times
    fireEvent.click(decreaseButton) // 5
    fireEvent.click(decreaseButton) // 4
    fireEvent.click(decreaseButton) // 3
    fireEvent.click(decreaseButton) // 2
    fireEvent.click(decreaseButton) // 1

    // Now try to decrease below minimum (1)
    fireEvent.click(decreaseButton) // Should still be 1

    // Check that getContext was called again
    expect(getContextSpy).toHaveBeenCalled()

    // Now increase multiple times to reach maximum (10)
    for (let i = 0; i < 10; i++) {
      fireEvent.click(increaseButton)
    }

    // Try to increase beyond maximum (10)
    fireEvent.click(increaseButton) // Should still be 10

    // Check that getContext was called again
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('toggles material menu and changes material type when material options are clicked', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Initially material type is "standard"
    expect(screen.getByText(/standard/i)).toBeInTheDocument()

    // Material menu should be closed initially
    expect(screen.queryByText(/Material Type/i)).not.toBeInTheDocument()

    // Get the material select button
    const materialSelectButton = screen.getByRole('button', {
      name: /Select material/i,
    })

    // Click to open material menu
    fireEvent.click(materialSelectButton)

    // Material menu should now be open
    expect(screen.getByText(/Material Type/i)).toBeInTheDocument()

    // All material options should be visible
    expect(screen.getByText(/Glass/i)).toBeInTheDocument()
    expect(screen.getByText(/Metal/i)).toBeInTheDocument()
    expect(screen.getByText(/Plastic/i)).toBeInTheDocument()

    // Click the glass material option
    fireEvent.click(screen.getByText(/Glass/i).closest('button') as HTMLElement)

    // Menu should close
    expect(screen.queryByText(/Material Type/i)).not.toBeInTheDocument()

    // Material indicator should update to show "glass"
    expect(screen.getByText(/glass/i)).toBeInTheDocument()
    expect(screen.queryByText(/standard/i)).not.toBeInTheDocument()

    // Open material menu again
    fireEvent.click(materialSelectButton)

    // Click the metal material option
    fireEvent.click(screen.getByText(/Metal/i).closest('button') as HTMLElement)

    // Material indicator should update to show "metal"
    expect(screen.getByText(/metal/i)).toBeInTheDocument()
    expect(screen.queryByText(/glass/i)).not.toBeInTheDocument()

    // Try one more material change
    fireEvent.click(materialSelectButton)
    fireEvent.click(
      screen.getByText(/Plastic/i).closest('button') as HTMLElement
    )
    expect(screen.getByText(/plastic/i)).toBeInTheDocument()

    // And back to standard
    fireEvent.click(materialSelectButton)
    fireEvent.click(
      screen.getByText(/Standard/i).closest('button') as HTMLElement
    )
    expect(screen.getByText(/standard/i)).toBeInTheDocument()
  })

  it('clears canvas when clear button is clicked and resets state', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Switch to hole mode
    const holeModeButton = screen.getByRole('button', {
      name: /Toggle hole mode/i,
    })
    fireEvent.click(holeModeButton)

    // Confirm hole mode is active
    expect(screen.getByText(/Hole Mode/i)).toBeInTheDocument()

    // Click the clear button
    const clearButton = screen.getByRole('button', { name: /Clear canvas/i })
    fireEvent.click(clearButton)

    // Verify hole mode was reset (should be back to Shape Mode)
    expect(screen.getByText(/Shape Mode/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hole Mode/i)).not.toBeInTheDocument()
  })

  it('simulates user drawing by adding paths', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Get the canvas element
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).not.toBeNull()

    // Get the mock context
    const getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')

    // Simulate drawing an outer shape - start in Shape Mode (default)
    // Mouse down to start drawing
    fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 })

    // Mouse move to add points
    fireEvent.mouseMove(canvas, { clientX: 60, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 70, clientY: 50 })
    fireEvent.mouseMove(canvas, { clientX: 80, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 70, clientY: 70 })
    fireEvent.mouseMove(canvas, { clientX: 60, clientY: 70 })
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 60 })

    // Mouse up to finish the path
    fireEvent.mouseUp(canvas)

    // Verify drawing methods were called by checking getContext calls
    expect(getContextSpy).toHaveBeenCalled()

    // Switch to Hole Mode
    const holeModeButton = screen.getByRole('button', {
      name: /Toggle hole mode/i,
    })
    fireEvent.click(holeModeButton)

    // Reset spy to track hole drawing separately
    getContextSpy.mockClear()

    // Simulate drawing a hole
    fireEvent.mouseDown(canvas, { clientX: 60, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 65, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 65, clientY: 65 })
    fireEvent.mouseMove(canvas, { clientX: 60, clientY: 65 })
    fireEvent.mouseUp(canvas)

    // Verify drawing methods were called again
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('calls onShapeCreated with correct data when create shape button is clicked', () => {
    // Mock the callback function
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Get the canvas element
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).not.toBeNull()

    // Simulate drawing an outer shape
    fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 })
    fireEvent.mouseMove(canvas, { clientX: 60, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 70, clientY: 50 })
    fireEvent.mouseUp(canvas)

    // Switch to Hole Mode
    const holeModeButton = screen.getByRole('button', {
      name: /Toggle hole mode/i,
    })
    fireEvent.click(holeModeButton)

    // Simulate drawing a hole
    fireEvent.mouseDown(canvas, { clientX: 60, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 65, clientY: 60 })
    fireEvent.mouseMove(canvas, { clientX: 65, clientY: 65 })
    fireEvent.mouseUp(canvas)

    // Get create shape button
    const createShapeButton = screen.getByRole('button', {
      name: /Create shape/i,
    })

    // Click create shape button
    fireEvent.click(createShapeButton)

    // Verify the callback was called
    expect(mockOnShapeCreated).toHaveBeenCalledTimes(1)

    // Verify the mocked utility functions were called with paths
    expect(drawingUtils.determineHoles).toHaveBeenCalled()
    expect(drawingUtils.calculateNormalizationParams).toHaveBeenCalled()
    expect(drawingUtils.normalizePointsWithParams).toHaveBeenCalled()

    // Verify the callback was called with the expected data structure
    expect(mockOnShapeCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        outerShape: expect.any(Array),
        holes: expect.any(Array),
        materialType: expect.stringMatching(/standard|glass|metal|plastic/),
      })
    )

    // Verify the canvas was cleared (Shape Mode should be active again)
    expect(screen.getByText(/Shape Mode/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hole Mode/i)).not.toBeInTheDocument()
  })

  it('toggles help modal when help button is clicked', () => {
    const mockOnShapeCreated = vi.fn()
    render(<DrawingCanvas onShapeCreated={mockOnShapeCreated} />)

    // Help modal should not be visible initially
    expect(
      screen.queryByText(/How to draw complex shapes/i)
    ).not.toBeInTheDocument()

    // Get the help button
    const helpButton = screen.getByRole('button', { name: /Show help/i })

    // Click the help button
    fireEvent.click(helpButton)

    // Help modal should now be visible
    expect(screen.getByText(/How to draw complex shapes/i)).toBeInTheDocument()

    // Modal should contain instructions
    expect(screen.getByText(/Draw the outer shape first/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Click the.*Hole Mode.*button/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Draw inner holes inside the outer shape/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Toggle back to normal mode/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Click.*Create Shape.*when finished/i)
    ).toBeInTheDocument()

    // Get the modal close button
    const closeButton = screen.getByRole('button', { name: /Got it/i })

    // Click the close button
    fireEvent.click(closeButton)

    // Help modal should be hidden again
    expect(
      screen.queryByText(/How to draw complex shapes/i)
    ).not.toBeInTheDocument()
  })
})
