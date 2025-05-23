'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import {
  FiSliders,
  FiCode,
  FiX,
  FiRotateCcw,
  FiLayers,
  FiDroplet,
  FiZap,
  FiEdit3,
} from 'react-icons/fi'
import { HexColorPicker } from 'react-colorful'

type PlaygroundControlsProps = {
  initialSettings: PlaygroundSettings
  onSettingsChange: (settings: PlaygroundSettings) => void
  activeControlPoint?: string | null
  isVisible?: boolean
  onVisibilityChange?: (visible: boolean) => void
  lightTheme?: boolean
}

export type PlaygroundSettings = {
  sphere: {
    color: string
    emissive: string
    distort: number
    speed: number
    roughness: number
    metalness: number
  }
  floatingObjects: {
    visible: boolean
    speed: number
  }
  background: {
    primaryBlob: string
    secondaryBlob: string
    accentBlob: string
  }
  animation: {
    speed: number
  }
  customShapes: {
    enabled: boolean
    speed: number
  }
}

// Create a stable wrapper component for the color picker with internal state management
const ColorPickerWrapper = memo(
  ({
    isOpen,
    color,
    onChange,
    onClose,
  }: {
    isOpen: boolean
    color: string
    onChange: (color: string) => void
    onClose: () => void
  }) => {
    const pickerRef = useRef<HTMLDivElement>(null)
    const [internalColor, setInternalColor] = useState(color)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Sync internal color when prop changes
    useEffect(() => {
      setInternalColor(color)
    }, [color])

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          pickerRef.current &&
          !pickerRef.current.contains(event.target as Node) &&
          isOpen
        ) {
          onClose()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        // Clear any pending timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [isOpen, onClose])

    // Handle color change with debouncing to reduce state updates
    const handleColorChange = useCallback(
      (newColor: string) => {
        setInternalColor(newColor)

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // Set a new timeout to actually update the parent
        timeoutRef.current = setTimeout(() => {
          // Only propagate valid hex colors
          if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
            onChange(newColor)
          }
        }, 100)
      },
      [onChange]
    )

    if (!isOpen) return null

    return (
      <div className='mt-2 p-2 rounded bg-white shadow-lg' ref={pickerRef}>
        <HexColorPicker color={internalColor} onChange={handleColorChange} />
      </div>
    )
  }
)

ColorPickerWrapper.displayName = 'ColorPickerWrapper'

export default function PlaygroundControls({
  initialSettings,
  onSettingsChange,
  activeControlPoint = null,
  isVisible = false,
  onVisibilityChange,
  lightTheme = false,
}: PlaygroundControlsProps) {
  const [visible, setVisible] = useState(isVisible)
  const [activeTab, setActiveTab] = useState<
    'sphere' | 'floatingObjects' | 'background' | 'animation' | 'shapes'
  >(
    activeControlPoint === 'color'
      ? 'sphere'
      : activeControlPoint === 'distort'
      ? 'sphere'
      : activeControlPoint === 'objects'
      ? 'floatingObjects'
      : activeControlPoint === 'speed'
      ? 'animation'
      : 'shapes'
  )
  const [settings, setSettings] = useState<PlaygroundSettings>(initialSettings)
  const [showingCode, setShowingCode] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null)

  // Auto-activate tab based on control point
  useEffect(() => {
    if (activeControlPoint === 'color') {
      setActiveTab('sphere')
    } else if (activeControlPoint === 'distort') {
      setActiveTab('sphere')
    } else if (activeControlPoint === 'objects') {
      setActiveTab('floatingObjects')
    } else if (activeControlPoint === 'speed') {
      setActiveTab('animation')
    } else if (activeControlPoint === 'shapes') {
      setActiveTab('shapes')
    }
  }, [activeControlPoint])

  // Sync visibility with parent component
  useEffect(() => {
    setVisible(isVisible)

    // When the panel becomes visible again, sync settings with latest from parent
    if (isVisible) {
      setSettings(initialSettings)
    }
  }, [isVisible, initialSettings])

  // Notify parent of visibility changes, but only when closing through UI
  // This prevents an infinite loop from the two-way binding
  const handleClose = () => {
    setVisible(false)
    if (onVisibilityChange) {
      onVisibilityChange(false)
    }
  }

  // Create a debounced function for handling setting changes
  const handleSettingChange = useCallback(
    (
      category: keyof PlaygroundSettings,
      property: string,
      value: number | string | boolean
    ) => {
      // Create a new settings object to avoid mutating the existing one
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [property]: value,
        },
      }

      // Update local state first
      setSettings(newSettings)

      // Update parent component
      onSettingsChange(newSettings)
    },
    [settings, onSettingsChange]
  )

  const resetSettings = () => {
    // Use a fresh copy of the initial settings
    const resetValues = JSON.parse(JSON.stringify(initialSettings))
    setSettings(resetValues)
    onSettingsChange(resetValues)
  }

  const formatSettingsCode = () => {
    return `<AnimatedSphere\n  color="${settings.sphere.color}"\n  emissive="${settings.sphere.emissive}"\n  distort={${settings.sphere.distort}}\n  speed={${settings.sphere.speed}}\n  roughness={${settings.sphere.roughness}}\n  metalness={${settings.sphere.metalness}}\n/>`
  }

  const getThemeClasses = () => {
    return lightTheme
      ? {
          panel: 'bg-white/95 border border-gray-200 rounded-lg shadow-xl',
          header: 'border-b border-gray-200',
          title: 'text-gray-800',
          highlight: 'text-blue-600',
          tabs: 'border-b border-gray-200',
          activeTab: 'text-blue-600 border-b-2 border-blue-600',
          inactiveTab: 'text-gray-600 hover:text-gray-800',
          button: {
            primary: 'bg-blue-500 text-white hover:bg-blue-600',
            secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          },
          input:
            'bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500',
          codeBlock: 'bg-gray-100 text-gray-800',
          closeButton: 'bg-red-500 hover:bg-red-600 text-white',
        }
      : {
          panel:
            'bg-neutral-900/95 border border-neutral-700 rounded-lg shadow-xl',
          header: 'border-b border-neutral-700',
          title: 'text-white',
          highlight: 'text-blue-400',
          tabs: 'border-b border-neutral-700',
          activeTab: 'text-blue-400 border-b-2 border-blue-400',
          inactiveTab: 'text-neutral-400 hover:text-neutral-200',
          button: {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            secondary: 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700',
          },
          input:
            'bg-neutral-800 border border-neutral-700 text-neutral-200 focus:border-blue-500',
          codeBlock: 'bg-neutral-800 text-neutral-300',
          closeButton: 'bg-red-500 hover:bg-red-600 text-white',
        }
  }

  const theme = getThemeClasses()

  // Simplified color change handler
  const handleColorChange = useCallback(
    (category: keyof PlaygroundSettings, property: string, color: string) => {
      // Only update if color is valid (prevents erratic behavior)
      if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        handleSettingChange(category, property, color)
      }
    },
    [handleSettingChange]
  )

  const closeColorPicker = useCallback(() => {
    setColorPickerOpen(null)
  }, [])

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${theme.panel}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        visible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{ duration: 0.3 }}
    >
      {visible && (
        <div className='relative'>
          {/* Close button */}
          <motion.button
            className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center ${theme.closeButton}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
          >
            <FiX />
          </motion.button>
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className={`text-lg font-bold ${theme.title}`}>
                <span className={theme.highlight}>Live</span> React Playground
              </h3>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setShowingCode(!showingCode)}
                  className={`p-2 rounded ${
                    showingCode ? theme.button.primary : theme.button.secondary
                  }`}
                  title='Show Code'
                >
                  <FiCode size={16} />
                </button>
                <button
                  onClick={resetSettings}
                  className={`p-2 rounded ${theme.button.secondary}`}
                  title='Reset Settings'
                >
                  <FiRotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Show code preview or tabs */}
            {showingCode ? (
              <div
                className={`${theme.codeBlock} p-3 rounded overflow-auto text-xs font-mono max-h-72`}
              >
                <pre>{formatSettingsCode()}</pre>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className={`flex ${theme.tabs} mb-4`}>
                  <button
                    onClick={() => setActiveTab('sphere')}
                    className={`flex items-center p-2 ${
                      activeTab === 'sphere'
                        ? theme.activeTab
                        : theme.inactiveTab
                    }`}
                  >
                    <FiSliders className='mr-2' size={16} />
                    <span>Sphere</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('floatingObjects')}
                    className={`flex items-center p-2 ${
                      activeTab === 'floatingObjects'
                        ? theme.activeTab
                        : theme.inactiveTab
                    }`}
                  >
                    <FiLayers className='mr-2' size={16} />
                    <span>Objects</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('background')}
                    className={`flex items-center p-2 ${
                      activeTab === 'background'
                        ? theme.activeTab
                        : theme.inactiveTab
                    }`}
                  >
                    <FiDroplet className='mr-2' size={16} />
                    <span>Bg</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('animation')}
                    className={`flex items-center p-2 ${
                      activeTab === 'animation'
                        ? theme.activeTab
                        : theme.inactiveTab
                    }`}
                  >
                    <FiZap className='mr-2' size={16} />
                    <span>Anim</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('shapes')}
                    className={`p-2 rounded-md ${
                      activeTab === 'shapes'
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-label='Custom Shapes Settings'
                  >
                    <FiEdit3 className='w-5 h-5' />
                  </button>
                </div>

                {/* Tab content */}
                <div className='space-y-4'>
                  {/* Sphere Settings */}
                  {activeTab === 'sphere' && (
                    <>
                      <div className='space-y-3'>
                        <div>
                          <label
                            className={`block mb-1 text-sm font-medium ${theme.title}`}
                          >
                            Sphere Color
                          </label>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-8 h-8 rounded cursor-pointer border border-white/20'
                              style={{ backgroundColor: settings.sphere.color }}
                              onClick={() =>
                                setColorPickerOpen(
                                  colorPickerOpen === 'sphereColor'
                                    ? null
                                    : 'sphereColor'
                                )
                              }
                            />
                            <input
                              type='text'
                              value={settings.sphere.color}
                              onChange={(e) =>
                                handleColorChange(
                                  'sphere',
                                  'color',
                                  e.target.value
                                )
                              }
                              className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                            />
                          </div>
                          {colorPickerOpen === 'sphereColor' && (
                            <ColorPickerWrapper
                              isOpen={colorPickerOpen === 'sphereColor'}
                              color={settings.sphere.color}
                              onChange={(color) =>
                                handleColorChange('sphere', 'color', color)
                              }
                              onClose={closeColorPicker}
                            />
                          )}
                        </div>

                        <div>
                          <label
                            className={`block mb-1 text-sm font-medium ${theme.title}`}
                          >
                            Emissive Color
                          </label>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-8 h-8 rounded cursor-pointer border border-white/20'
                              style={{
                                backgroundColor: settings.sphere.emissive,
                              }}
                              onClick={() =>
                                setColorPickerOpen(
                                  colorPickerOpen === 'emissive'
                                    ? null
                                    : 'emissive'
                                )
                              }
                            />
                            <input
                              type='text'
                              value={settings.sphere.emissive}
                              onChange={(e) =>
                                handleColorChange(
                                  'sphere',
                                  'emissive',
                                  e.target.value
                                )
                              }
                              className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                            />
                          </div>
                          {colorPickerOpen === 'emissive' && (
                            <ColorPickerWrapper
                              isOpen={colorPickerOpen === 'emissive'}
                              color={settings.sphere.emissive}
                              onChange={(color) =>
                                handleColorChange('sphere', 'emissive', color)
                              }
                              onClose={closeColorPicker}
                            />
                          )}
                        </div>

                        <div>
                          <label
                            className={`block mb-1 text-sm font-medium ${theme.title}`}
                          >
                            Distortion: {settings.sphere.distort.toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.01'
                            value={settings.sphere.distort}
                            onChange={(e) =>
                              handleSettingChange(
                                'sphere',
                                'distort',
                                parseFloat(e.target.value)
                              )
                            }
                            className='w-full'
                          />
                        </div>

                        <div>
                          <label
                            className={`block mb-1 text-sm font-medium ${theme.title}`}
                          >
                            Speed: {settings.sphere.speed.toFixed(2)}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='3'
                            step='0.1'
                            value={settings.sphere.speed}
                            onChange={(e) =>
                              handleSettingChange(
                                'sphere',
                                'speed',
                                parseFloat(e.target.value)
                              )
                            }
                            className='w-full'
                          />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label
                              className={`block mb-1 text-sm font-medium ${theme.title}`}
                            >
                              Roughness: {settings.sphere.roughness.toFixed(2)}
                            </label>
                            <input
                              type='range'
                              min='0'
                              max='1'
                              step='0.01'
                              value={settings.sphere.roughness}
                              onChange={(e) =>
                                handleSettingChange(
                                  'sphere',
                                  'roughness',
                                  parseFloat(e.target.value)
                                )
                              }
                              className='w-full'
                            />
                          </div>
                          <div>
                            <label
                              className={`block mb-1 text-sm font-medium ${theme.title}`}
                            >
                              Metalness: {settings.sphere.metalness.toFixed(2)}
                            </label>
                            <input
                              type='range'
                              min='0'
                              max='1'
                              step='0.01'
                              value={settings.sphere.metalness}
                              onChange={(e) =>
                                handleSettingChange(
                                  'sphere',
                                  'metalness',
                                  parseFloat(e.target.value)
                                )
                              }
                              className='w-full'
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Floating Objects Settings */}
                  {activeTab === 'floatingObjects' && (
                    <>
                      <div className='flex items-center justify-between'>
                        <label
                          className={`block text-sm font-medium ${theme.title}`}
                        >
                          Show Floating Objects
                        </label>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={settings.floatingObjects.visible}
                            onChange={(e) =>
                              handleSettingChange(
                                'floatingObjects',
                                'visible',
                                e.target.checked
                              )
                            }
                            className='sr-only peer'
                          />
                          <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      <div>
                        <label
                          className={`block mb-1 text-sm font-medium ${theme.title}`}
                        >
                          Floating Speed:{' '}
                          {settings.floatingObjects.speed.toFixed(2)}
                        </label>
                        <input
                          type='range'
                          min='0.1'
                          max='3'
                          step='0.1'
                          value={settings.floatingObjects.speed}
                          onChange={(e) =>
                            handleSettingChange(
                              'floatingObjects',
                              'speed',
                              parseFloat(e.target.value)
                            )
                          }
                          className='w-full'
                        />
                      </div>
                    </>
                  )}

                  {/* Background Settings */}
                  {activeTab === 'background' && (
                    <>
                      <div>
                        <label
                          className={`block mb-1 text-sm font-medium ${theme.title}`}
                        >
                          Primary Blob
                        </label>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-8 h-8 rounded cursor-pointer border border-white/20'
                            style={{
                              backgroundColor: settings.background.primaryBlob,
                            }}
                            onClick={() =>
                              setColorPickerOpen(
                                colorPickerOpen === 'primaryBlob'
                                  ? null
                                  : 'primaryBlob'
                              )
                            }
                          />
                          <input
                            type='text'
                            value={settings.background.primaryBlob}
                            onChange={(e) =>
                              handleColorChange(
                                'background',
                                'primaryBlob',
                                e.target.value
                              )
                            }
                            className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                          />
                        </div>
                        {colorPickerOpen === 'primaryBlob' && (
                          <ColorPickerWrapper
                            isOpen={colorPickerOpen === 'primaryBlob'}
                            color={settings.background.primaryBlob}
                            onChange={(color) =>
                              handleColorChange(
                                'background',
                                'primaryBlob',
                                color
                              )
                            }
                            onClose={closeColorPicker}
                          />
                        )}
                      </div>

                      <div>
                        <label
                          className={`block mb-1 text-sm font-medium ${theme.title}`}
                        >
                          Secondary Blob
                        </label>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-8 h-8 rounded cursor-pointer border border-white/20'
                            style={{
                              backgroundColor:
                                settings.background.secondaryBlob,
                            }}
                            onClick={() =>
                              setColorPickerOpen(
                                colorPickerOpen === 'secondaryBlob'
                                  ? null
                                  : 'secondaryBlob'
                              )
                            }
                          />
                          <input
                            type='text'
                            value={settings.background.secondaryBlob}
                            onChange={(e) =>
                              handleColorChange(
                                'background',
                                'secondaryBlob',
                                e.target.value
                              )
                            }
                            className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                          />
                        </div>
                        {colorPickerOpen === 'secondaryBlob' && (
                          <ColorPickerWrapper
                            isOpen={colorPickerOpen === 'secondaryBlob'}
                            color={settings.background.secondaryBlob}
                            onChange={(color) =>
                              handleColorChange(
                                'background',
                                'secondaryBlob',
                                color
                              )
                            }
                            onClose={closeColorPicker}
                          />
                        )}
                      </div>

                      <div>
                        <label
                          className={`block mb-1 text-sm font-medium ${theme.title}`}
                        >
                          Accent Blob
                        </label>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-8 h-8 rounded cursor-pointer border border-white/20'
                            style={{
                              backgroundColor: settings.background.accentBlob,
                            }}
                            onClick={() =>
                              setColorPickerOpen(
                                colorPickerOpen === 'accentBlob'
                                  ? null
                                  : 'accentBlob'
                              )
                            }
                          />
                          <input
                            type='text'
                            value={settings.background.accentBlob}
                            onChange={(e) =>
                              handleColorChange(
                                'background',
                                'accentBlob',
                                e.target.value
                              )
                            }
                            className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                          />
                        </div>
                        {colorPickerOpen === 'accentBlob' && (
                          <ColorPickerWrapper
                            isOpen={colorPickerOpen === 'accentBlob'}
                            color={settings.background.accentBlob}
                            onChange={(color) =>
                              handleColorChange(
                                'background',
                                'accentBlob',
                                color
                              )
                            }
                            onClose={closeColorPicker}
                          />
                        )}
                      </div>
                    </>
                  )}

                  {/* Animation Settings */}
                  {activeTab === 'animation' && (
                    <>
                      <div>
                        <label
                          className={`block mb-1 text-sm font-medium ${theme.title}`}
                        >
                          Global Animation Speed:{' '}
                          {settings.animation.speed.toFixed(2)}
                        </label>
                        <input
                          type='range'
                          min='0.1'
                          max='3'
                          step='0.1'
                          value={settings.animation.speed}
                          onChange={(e) =>
                            handleSettingChange(
                              'animation',
                              'speed',
                              parseFloat(e.target.value)
                            )
                          }
                          className='w-full'
                        />
                      </div>
                    </>
                  )}

                  {/* Custom Shapes Tab */}
                  {activeTab === 'shapes' && (
                    <div className='w-full p-4'>
                      <h3 className='text-lg font-semibold mb-3'>
                        Custom Shapes
                      </h3>

                      <div className='mb-4'>
                        <div className='flex justify-between items-center mb-2'>
                          <span>Enable Custom Shapes</span>
                          <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={settings.customShapes.enabled}
                              onChange={() =>
                                handleSettingChange(
                                  'customShapes',
                                  'enabled',
                                  !settings.customShapes.enabled
                                )
                              }
                              className='sr-only peer'
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <label className='block mb-2'>Animation Speed</label>
                        <input
                          type='range'
                          min='0.1'
                          max='2'
                          step='0.1'
                          value={settings.customShapes.speed}
                          onChange={(e) =>
                            handleSettingChange(
                              'customShapes',
                              'speed',
                              parseFloat(e.target.value)
                            )
                          }
                          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                        />
                        <div className='flex justify-between text-xs mt-1'>
                          <span>Slow</span>
                          <span>Fast</span>
                        </div>
                      </div>

                      <div className='mt-6 bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm'>
                        <p>
                          Draw shapes to create unique 3D objects that will
                          appear in your scene!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
