import Link from 'next/link'
import type { Metadata } from 'next'
import SpaSwitchPage from '../SpaSwitchPage'

const appStoreUrl = 'https://apps.apple.com/us/app/spa-switch/id6765747837'

export const metadata: Metadata = {
  title: 'Liquid Chlorine Hot Tub Dose Calculator Workflow',
  description:
    'Calculate liquid chlorine dose for your hot tub using current FC, target FC, volume, and chlorine strength in one repeatable workflow.',
  alternates: {
    canonical:
      'https://www.josiahhawkins.com/spa-switch/liquid-chlorine-hot-tub-dose-calculator',
  },
}

export default function LiquidChlorineDosePage() {
  return (
    <SpaSwitchPage
      eyebrow='Liquid Chlorine'
      title='Liquid Chlorine Hot Tub Dose Calculator'
    >
      <section className='space-y-5'>
        <p>
          Liquid chlorine dosing needs four inputs: tub volume, current FC,
          target FC, and liquid chlorine strength. The dose scales with the FC
          increase needed and the size of the spa.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Repeatable Process
        </h2>
        <ol className='list-decimal space-y-2 pl-6'>
          <li>Test current FC before dosing.</li>
          <li>Set target FC based on your routine.</li>
          <li>Enter volume and liquid chlorine strength.</li>
          <li>Calculate dose in fluid ounces.</li>
          <li>Re-test after circulation and adjust future targets as needed.</li>
        </ol>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Dose Checklist
        </h2>
        <ul className='list-disc space-y-2 pl-6'>
          <li>Fresh FC reading taken</li>
          <li>Current FC entered</li>
          <li>Target FC entered</li>
          <li>Strength verified from product label</li>
          <li>Dose calculated and recorded</li>
        </ul>
        <p>
          Label concentrations vary. Use product label directions and tub
          manufacturer guidance for handling and dosing boundaries.
        </p>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Calculate It in Spa Switch
        </h2>
        <p>
          Switch sanitizer mode to Liquid chlorine, enter FC readings, and
          calculate. The app shows fluid-ounce dose and keeps the same
          calculator flow used in dichlor mode.
        </p>
        <a
          className='inline-flex rounded-md bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800'
          href={appStoreUrl}
        >
          Open Spa Switch on the App Store
        </a>
        <p>
          If you are switching from dichlor, also read the{' '}
          <Link
            className='font-semibold text-sky-700 hover:text-sky-900'
            href='/spa-switch/hot-tub-cya-switch-point'
          >
            CYA switch-point guide
          </Link>
          .
        </p>
      </section>
    </SpaSwitchPage>
  )
}
