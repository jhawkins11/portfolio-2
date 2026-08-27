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

  const inputClassName =
    'w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10'

  return (
    <section className='overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.08)]'>
      <div className='border-b border-slate-100 px-6 py-6 sm:px-8 sm:py-7'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.18em] text-teal-700'>
              Free web calculator
            </p>
            <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl'>
              Current chlorine dose
            </h2>
          </div>

          <div className='grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-bold'>
            <button
              className={`rounded-lg px-4 py-2.5 transition ${
                mode === 'dichlor'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              type='button'
              onClick={() => setMode('dichlor')}
            >
              Dichlor
            </button>
            <button
              className={`rounded-lg px-4 py-2.5 transition ${
                mode === 'liquidChlorine'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              type='button'
              onClick={() => setMode('liquidChlorine')}
            >
              Liquid
            </button>
          </div>
        </div>
      </div>

      <div className='grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_.9fr] lg:items-start'>
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-1'>
          <label className='space-y-2'>
            <span className='text-sm font-bold text-slate-700'>Tub volume, gallons</span>
            <input
              className={inputClassName}
              inputMode='decimal'
              value={volumeGallons}
              onChange={(event) => setVolumeGallons(event.target.value)}
            />
          </label>

          <label className='space-y-2'>
            <span className='text-sm font-bold text-slate-700'>Current FC, ppm</span>
            <input
              className={inputClassName}
              inputMode='decimal'
              value={currentFc}
              onChange={(event) => setCurrentFc(event.target.value)}
            />
          </label>

          <label className='space-y-2'>
            <span className='text-sm font-bold text-slate-700'>Target FC, ppm</span>
            <input
              className={inputClassName}
              inputMode='decimal'
              value={targetFc}
              onChange={(event) => setTargetFc(event.target.value)}
            />
          </label>

          <label className='space-y-2'>
            <span className='text-sm font-bold text-slate-700'>
              {mode === 'dichlor'
                ? 'Dichlor available chlorine, %'
                : 'Liquid chlorine strength, %'}
            </span>
            <input
              className={inputClassName}
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

        <div className='rounded-[1.65rem] bg-[#07111f] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.14)] sm:p-7'>
          {result.error ? (
            <div className='rounded-xl border border-rose-300/20 bg-rose-400/10 p-4'>
              <p className='font-semibold text-rose-100'>{result.error}</p>
            </div>
          ) : (
            <>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>
                Dose needed
              </p>
              <p className='mt-3 text-5xl font-bold tracking-[-0.045em] text-teal-300'>
                {formatDose(result.dose)}
              </p>
              <p className='mt-1 font-semibold text-slate-300'>{result.unit}</p>

              <div className='my-6 h-px bg-white/10' />

              <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                    FC rise
                  </p>
                  <p className='mt-1.5 text-2xl font-bold'>
                    {formatDose(Math.max(result.rise, 0))}{' '}
                    <span className='text-sm font-semibold text-slate-400'>ppm</span>
                  </p>
                </div>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                    CYA from dose
                  </p>
                  <p className='mt-1.5 text-2xl font-bold text-blue-300'>
                    {formatDose(result.cya)}{' '}
                    <span className='text-sm font-semibold text-slate-400'>ppm</span>
                  </p>
                </div>
              </div>

              <div className='mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4'>
                <p className='text-sm leading-6 text-slate-300'>
                  {mode === 'dichlor'
                    ? 'Dichlor raises free chlorine and contributes CYA. Spa Switch can keep that accumulation tied to the refill cycle.'
                    : 'Liquid chlorine raises free chlorine without adding CYA to the refill-cycle total.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8'>
        <p className='text-sm leading-6 text-slate-500'>
          Calculator only. Use your own test readings and always follow product
          labels and your hot tub manufacturer&apos;s guidance.
        </p>
      </div>
    </section>
  )
}
