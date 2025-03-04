'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiSliders,
  FiCode,
  FiX,
  FiSettings,
  FiRotateCcw,
  FiLayers,
  FiDroplet,
  FiZap,
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
}

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
    'sphere' | 'floatingObjects' | 'background' | 'animation'
  >(
    activeControlPoint === 'color'
      ? 'sphere'
      : activeControlPoint === 'distort'
      ? 'sphere'
      : activeControlPoint === 'objects'
      ? 'floatingObjects'
      : activeControlPoint === 'speed'
      ? 'animation'
      : 'sphere'
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
    }
  }, [activeControlPoint])

  // Sync visibility with parent component
  useEffect(() => {
    console.log('PlaygroundControls: isVisible prop changed to', isVisible)
    setVisible(isVisible)
  }, [isVisible])

  // Notify parent of visibility changes
  useEffect(() => {
    console.log('PlaygroundControls: visible state changed to', visible)
    if (onVisibilityChange && visible !== isVisible) {
      onVisibilityChange(visible)
    }
  }, [visible, onVisibilityChange, isVisible])

  // Update parent component when settings change
  const handleSettingChange = (
    category: keyof PlaygroundSettings,
    property: string,
    value: number | string | boolean
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [property]: value,
      },
    }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const resetSettings = () => {
    setSettings(initialSettings)
    onSettingsChange(initialSettings)
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
        }
  }

  const theme = getThemeClasses()

  return (
    <div className='fixed bottom-8 right-8 z-50 flex flex-col items-end'>
      {/* Main controls */}
      <motion.div
        className={`${theme.panel} overflow-hidden ${
          visible ? 'w-80' : 'w-0 h-0 overflow-hidden'
        }`}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width: visible ? 320 : 0,
          height: visible ? 'auto' : 0,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
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
              <button
                onClick={() => setVisible(false)}
                className={`p-2 rounded ${theme.button.secondary}`}
                title='Close Panel'
              >
                <FiX size={16} />
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
                    activeTab === 'sphere' ? theme.activeTab : theme.inactiveTab
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
                              handleSettingChange(
                                'sphere',
                                'color',
                                e.target.value
                              )
                            }
                            className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                          />
                        </div>
                        {colorPickerOpen === 'sphereColor' && (
                          <div className='mt-2 p-2 rounded bg-white shadow-lg'>
                            <HexColorPicker
                              color={settings.sphere.color}
                              onChange={(color) =>
                                handleSettingChange('sphere', 'color', color)
                              }
                            />
                          </div>
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
                              handleSettingChange(
                                'sphere',
                                'emissive',
                                e.target.value
                              )
                            }
                            className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                          />
                        </div>
                        {colorPickerOpen === 'emissive' && (
                          <div className='mt-2 p-2 rounded bg-white shadow-lg'>
                            <HexColorPicker
                              color={settings.sphere.emissive}
                              onChange={(color) =>
                                handleSettingChange('sphere', 'emissive', color)
                              }
                            />
                          </div>
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
                            handleSettingChange(
                              'background',
                              'primaryBlob',
                              e.target.value
                            )
                          }
                          className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                        />
                      </div>
                      {colorPickerOpen === 'primaryBlob' && (
                        <div className='mt-2 p-2 rounded bg-white shadow-lg'>
                          <HexColorPicker
                            color={settings.background.primaryBlob}
                            onChange={(color) =>
                              handleSettingChange(
                                'background',
                                'primaryBlob',
                                color
                              )
                            }
                          />
                        </div>
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
                            backgroundColor: settings.background.secondaryBlob,
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
                            handleSettingChange(
                              'background',
                              'secondaryBlob',
                              e.target.value
                            )
                          }
                          className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                        />
                      </div>
                      {colorPickerOpen === 'secondaryBlob' && (
                        <div className='mt-2 p-2 rounded bg-white shadow-lg'>
                          <HexColorPicker
                            color={settings.background.secondaryBlob}
                            onChange={(color) =>
                              handleSettingChange(
                                'background',
                                'secondaryBlob',
                                color
                              )
                            }
                          />
                        </div>
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
                            handleSettingChange(
                              'background',
                              'accentBlob',
                              e.target.value
                            )
                          }
                          className={`${theme.input} text-sm px-2 py-1 rounded w-full`}
                        />
                      </div>
                      {colorPickerOpen === 'accentBlob' && (
                        <div className='mt-2 p-2 rounded bg-white shadow-lg'>
                          <HexColorPicker
                            color={settings.background.accentBlob}
                            onChange={(color) =>
                              handleSettingChange(
                                'background',
                                'accentBlob',
                                color
                              )
                            }
                          />
                        </div>
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
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Toggle button - only shown if not controlled by parent */}
      {!onVisibilityChange && (
        <motion.button
          onClick={() => setVisible(!visible)}
          className='flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform transition-transform duration-200 hover:scale-110'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            rotate: visible ? 180 : 0,
          }}
        >
          <FiSettings size={20} />
        </motion.button>
      )}
    </div>
  )
}
