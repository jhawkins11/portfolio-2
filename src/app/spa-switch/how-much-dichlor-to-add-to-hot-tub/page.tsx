import Link from 'next/link'
import type { Metadata } from 'next'
import SpaSwitchPage from '../SpaSwitchPage'

const appStoreUrl = 'https://apps.apple.com/us/app/spa-switch/id6765747837'

export const metadata: Metadata = {
  title: 'How Much Dichlor to Add to a Hot Tub: Practical Dose Workflow',
  description:
    'Use a repeatable method to calculate dichlor dose from current FC, target FC, and volume, plus estimate CYA added by each dose.',
  alternates: {
    canonical:
      'https://www.josiahhawkins.com/spa-switch/how-much-dichlor-to-add-to-hot-tub',
  },
}

export default function DichlorDosePage() {
  return (
    <SpaSwitchPage
      eyebrow='Dichlor Dose'
      title='How Much Dichlor to Add to a Hot Tub'
    >
      <section className='space-y-5'>
        <p>
          You need your tub volume, current free chlorine, target free chlorine,
          and dichlor strength. The needed dose rises as the FC gap and volume
          increase. Each dichlor dose also adds cyanuric acid, so repeat dosing
          should be tracked over the refill window.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Step-by-Step Method
        </h2>
        <ol className='list-decimal space-y-2 pl-6'>
          <li>Test and record current FC.</li>
          <li>Choose a target FC for today&apos;s condition.</li>
          <li>Calculate FC rise as target minus current.</li>
          <li>Apply dichlor strength and volume to calculate dose.</li>
          <li>Record estimated CYA increase for that dose.</li>
        </ol>
        <p>If FC rise is zero or negative, no dose is needed for that target.</p>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Worked Example
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <tbody className='divide-y divide-slate-200'>
              <tr>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Tub volume
                </th>
                <td className='py-3'>420 gallons</td>
              </tr>
              <tr>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Current FC
                </th>
                <td className='py-3'>1.5 ppm</td>
              </tr>
              <tr>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Target FC
                </th>
                <td className='py-3'>4.0 ppm</td>
              </tr>
              <tr>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  FC rise
                </th>
                <td className='py-3'>2.5 ppm</td>
              </tr>
              <tr>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Dichlor strength
                </th>
                <td className='py-3'>56%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The final dose depends on the exact product assumptions. Spa Switch
          uses your saved profile values so the calculation stays consistent.
        </p>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Why CYA Tracking Matters
        </h2>
        <p>
          Dichlor adds both chlorine and CYA. Repeated additions can move CYA to
          a point where many owners switch to liquid chlorine for ongoing
          sanitation.
        </p>
        <p>
          The CDC notes that cyanuric acid is a chlorine stabilizer and that
          stabilized chlorines add it over time. Read the CDC context on{' '}
          <a
            className='font-semibold text-sky-700 hover:text-sky-900'
            href='https://www.cdc.gov/healthy-swimming/toolkit/cyanuric-acid-and-chlorine-stabilizers.html'
          >
            cyanuric acid and chlorine stabilizers
          </a>
          .
        </p>
        <p>
          Use manufacturer and product-label guidance for your exact tub and
          sanitizer routine.
        </p>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Calculate It in Spa Switch
        </h2>
        <p>
          Set Dichlor mode, enter current and target FC, and calculate. The
          result shows both dose and projected CYA for that dose. If unlocked,
          tap Save dose to build accumulated CYA history since refill.
        </p>
        <a
          className='inline-flex rounded-md bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800'
          href={appStoreUrl}
        >
          Use Spa Switch
        </a>
        <p>
          Next: read the{' '}
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
