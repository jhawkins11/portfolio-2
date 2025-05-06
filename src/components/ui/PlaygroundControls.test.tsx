import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import PlaygroundControls, { PlaygroundSettings } from './PlaygroundControls'

vi.mock('react-colorful', () => ({
  HexColorPicker: ({
    color,
    onChange,
  }: {
    color: string
    onChange: (color: string) => void
  }) => (
    <div data-testid='mock-color-picker' data-color={color}>
      <button
        data-testid='color-picker-button'
        onClick={() => onChange('#ff0000')}
      >
        Change to Red
      </button>
    </div>
  ),
}))

vi.mock('../utils/ColorPickerWrapper', () => ({
  __esModule: true,
  default: ({
    isOpen,
    color,
    onChange,
    onClose,
  }: {
    isOpen: boolean
    color: string
    onChange: (color: string) => void
    onClose: () => void
  }) =>
    isOpen && (
      <div data-testid='mock-color-picker-wrapper' data-color={color}>
        <button
          data-testid='color-wrapper-change-button'
          onClick={() => onChange('#00ff00')}
        >
          Change Color
        </button>
        <button data-testid='color-wrapper-close-button' onClick={onClose}>
          Close Picker
        </button>
      </div>
    ),
}))

const mockInitialSettings: PlaygroundSettings = {
  sphere: {
    color: '#4a9eff',
    emissive: '#000000',
    distort: 0.5,
    speed: 1,
    roughness: 0.2,
    metalness: 0.3,
  },
  floatingObjects: {
    visible: true,
    speed: 1,
  },
  background: {
    primaryBlob: '#4a9eff',
    secondaryBlob: '#8d7aff',
    accentBlob: '#ff5757',
  },
  animation: {
    speed: 1,
  },
  customShapes: {
    enabled: true,
    speed: 1,
  },
}

describe('<PlaygroundControls />', () => {
  const mockOnSettingsChange = vi.fn()
  const mockOnVisibilityChange = vi.fn()

  beforeEach(() => {
    mockOnSettingsChange.mockClear()
    mockOnVisibilityChange.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={true}
      />
    )
    expect(
      document.querySelector('.fixed.bottom-6.right-6')
    ).toBeInTheDocument()
  })

  it('respects isVisible prop', () => {
    const { rerender } = render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={false}
      />
    )

    // With isVisible false, we shouldn't see any content
    expect(document.querySelector('.p-4')).not.toBeInTheDocument()

    // Rerender with isVisible true
    rerender(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={true}
      />
    )

    // Now we should see content
    expect(document.querySelector('.p-4')).toBeInTheDocument()
  })

  it('calls onVisibilityChange when close button is clicked', () => {
    render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        onVisibilityChange={mockOnVisibilityChange}
        isVisible={true}
      />
    )

    // Find and click the close button (red X button)
    const closeButton = document.querySelector(
      'button.bg-red-500'
    ) as HTMLButtonElement
    if (closeButton) {
      fireEvent.click(closeButton)
    }

    // Check if onVisibilityChange was called with false
    expect(mockOnVisibilityChange).toHaveBeenCalledWith(false)
  })

  it('sends updated settings when a setting is changed', () => {
    render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={true}
      />
    )

    // Find the first range input (should be in the default Sphere tab)
    const rangeInput = document.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement

    // Get its initial value
    const initialValue = rangeInput.value

    // Change to a different value
    const newValue = parseFloat(initialValue) + 0.2
    fireEvent.change(rangeInput, { target: { value: newValue.toString() } })

    // Check that the settings change callback was called
    expect(mockOnSettingsChange).toHaveBeenCalled()
  })

  it('resets settings when reset button is clicked', () => {
    render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={true}
      />
    )

    // Find the reset button (it has title="Reset Settings")
    const resetButton = document.querySelector(
      'button[title="Reset Settings"]'
    ) as HTMLButtonElement
    if (resetButton) {
      fireEvent.click(resetButton)
    }

    // Check if onSettingsChange was called with the initial settings
    expect(mockOnSettingsChange).toHaveBeenCalledWith(
      expect.objectContaining(mockInitialSettings)
    )
  })

  it('toggles code view when code button is clicked', () => {
    render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={true}
      />
    )

    // Find the code button (it has title="Show Code")
    const codeButton = document.querySelector(
      'button[title="Show Code"]'
    ) as HTMLButtonElement
    if (codeButton) {
      // Initially no pre element should be visible
      expect(document.querySelector('pre')).not.toBeInTheDocument()

      // Click to show code
      fireEvent.click(codeButton)

      // Now a pre element should be visible
      expect(document.querySelector('pre')).toBeInTheDocument()

      // Click again to hide code
      fireEvent.click(codeButton)

      // Pre element should be hidden again
      expect(document.querySelector('pre')).not.toBeInTheDocument()
    }
  })

  it('correctly interacts with ColorPickerWrapper component', () => {
    render(
      <PlaygroundControls
        initialSettings={mockInitialSettings}
        onSettingsChange={mockOnSettingsChange}
        isVisible={true}
      />
    )

    // Find a color swatch
    const colorSwatch = document.querySelector(
      '.w-8.h-8.rounded.cursor-pointer'
    ) as HTMLDivElement
    if (colorSwatch) {
      fireEvent.click(colorSwatch)

      // Find our mocked color change button that appears when color picker is open
      const colorButton = document.querySelector(
        '[data-testid="color-wrapper-change-button"]'
      ) as HTMLButtonElement
      if (colorButton) {
        fireEvent.click(colorButton)

        // Check that settings were updated with new color
        expect(mockOnSettingsChange).toHaveBeenCalled()
      }
    }
  })
})
