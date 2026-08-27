'use client'

import { useMemo, useState } from 'react'

const liquidChlorineFlOzFactor = 78.125
const dichlorOzPerPpmPerGallon = 0.0001334
const dichlorCyaPpmPerFcPpm = 0.9

type SanitizerMode = 'dichlor' | 'liquidChlorine'

function parseStrictNumber(value: string, label: string, min: number, max: number) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) {
    throw new Error(`${label} must be a number.`)
  }
  if (numberValue < min || numberValue > max) {
    throw new Error(`${label} must be between ${min} and ${max}.`)
  }
  return numberValue
}

function formatDose(value: number) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: value > 0 && value < 1 ? 2 : 1,
  })
}

export default function SpaSwitchCalculator() {
  const [mode, setMode] = useState<SanitizerMode>('dichlor')
  const [volumeGallons, setVolumeGallons] = useState('420')
  const [currentFc, setCurrentFc] = useState('1.5')
  const [targetFc, setTargetFc] = useState('4')
  const [dichlorStrength, setDichlorStrength] = useState('56')
  const [liquidStrength, setLiquidStrength] = useState('10')

  const result = useMemo(() => {
    try {
      const volume = parseStrictNumber(volumeGallons, 'Volume', 100, 1000)
      const current = parseStrictNumber(currentFc, 'Current FC', 0, 20)
      const target = parseStrictNumber(targetFc, 'Target FC', 0, 20)
      const rise = target - current
      if (rise <= 0) {
        return {
          error: '',
          rise,
          dose: 0,
          unit: mode === 'dichlor' ? 'oz by weight' : 'fl oz',
          cya: 0,
        }
      }

      if (mode === 'liquidChlorine') {
        const strength = parseStrictNumber(
          liquidStrength,
          'Liquid chlorine strength',
          5,
          12.5,
        )
        return {
          error: '',
          rise,
          dose: (rise * volume) / (strength * liquidChlorineFlOzFactor),
          unit: 'fl oz',
          cya: 0,
        }
      }

      const strength = parseStrictNumber(
        dichlorStrength,
        'Dichlor strength',
        50,
        62,
      )
      return {
        error: '',
        rise,
        dose:
          (rise * volume * dichlorOzPerPpmPerGallon) / (strength / 100),
        unit: 'oz by weight',
        cya: rise * dichlorCyaPpmPerFcPpm,
      }
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }
      return {
        error: error.message,
        rise: 0,
        dose: 0,
        unit: mode === 'dichlor' ? 'oz by weight' : 'fl oz',
        cya: 0,
      }
    }
  }, [currentFc, dichlorStrength, liquidStrength, mode, targetFc, volumeGallons])

  return (
    <section className='rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.16em] text-sky-700'>
            Free web calculator
          </p>
          <h2 className='mt-2 text-2xl font-semibold text-slate-950'>
            Calculate a hot tub chlorine dose
          </h2>
        </div>
        <div className='grid grid-cols-2 rounded-md border border-slate-200 bg-slate-50 p-1 text-sm font-semibold'>
          <button
            className={`rounded px-3 py-2 ${
              mode === 'dichlor'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600'
            }`}
            type='button'
            onClick={() => setMode('dichlor')}
          >
            Dichlor
          </button>
          <button
            className={`rounded px-3 py-2 ${
              mode === 'liquidChlorine'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600'
            }`}
            type='button'
            onClick={() => setMode('liquidChlorine')}
          >
            Liquid
          </button>
        </div>
      </div>

      <div className='mt-6 grid gap-4 sm:grid-cols-2'>
        <label className='space-y-2'>
          <span className='text-sm font-semibold text-slate-700'>
            Tub volume, gallons
          </span>
          <input
            className='w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950'
            inputMode='decimal'
            value={volumeGallons}
            onChange={(event) => setVolumeGallons(event.target.value)}
          />
        </label>
        <label className='space-y-2'>
          <span className='text-sm font-semibold text-slate-700'>
            Current FC, ppm
          </span>
          <input
            className='w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950'
            inputMode='decimal'
            value={currentFc}
            onChange={(event) => setCurrentFc(event.target.value)}
          />
        </label>
        <label className='space-y-2'>
          <span className='text-sm font-semibold text-slate-700'>
            Target FC, ppm
          </span>
          <input
            className='w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950'
            inputMode='decimal'
            value={targetFc}
            onChange={(event) => setTargetFc(event.target.value)}
          />
        </label>
        <label className='space-y-2'>
          <span className='text-sm font-semibold text-slate-700'>
            {mode === 'dichlor'
              ? 'Dichlor available chlorine, %'
              : 'Liquid chlorine strength, %'}
          </span>
          <input
            className='w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950'
            inputMode='decimal'
            value={mode === 'dichlor' ? dichlorStrength : liquidStrength}
            onChange={(event) => {
              if (mode === 'dichlor') {
                setDichlorStrength(event.target.value)
                return
              }
              setLiquidStrength(event.target.value)
            }}
          />
        </label>
      </div>

      <div className='mt-6 rounded-md bg-slate-950 p-5 text-white'>
        {result.error ? (
          <p className='font-semibold text-rose-200'>{result.error}</p>
        ) : (
          <div className='grid gap-4 sm:grid-cols-3'>
            <div>
              <p className='text-sm text-slate-300'>FC rise</p>
              <p className='mt-1 text-2xl font-semibold'>
                {formatDose(Math.max(result.rise, 0))} ppm
              </p>
            </div>
            <div>
              <p className='text-sm text-slate-300'>Dose</p>
              <p className='mt-1 text-2xl font-semibold'>
                {formatDose(result.dose)} {result.unit}
              </p>
            </div>
            <div>
              <p className='text-sm text-slate-300'>CYA from dose</p>
              <p className='mt-1 text-2xl font-semibold'>
                {formatDose(result.cya)} ppm
              </p>
            </div>
          </div>
        )}
      </div>

      <p className='mt-4 text-sm text-slate-500'>
        This calculator uses the same public constants as Spa Switch. Always
        follow chemical labels and your hot tub manufacturer&apos;s guidance.
      </p>
    </section>
  )
}
