import type { Metadata } from 'next'
import SpaSwitchPage from '../SpaSwitchPage'

const appStoreUrl = 'https://apps.apple.com/us/app/spa-switch/id6765747837'

export const metadata: Metadata = {
  title: 'Hot Tub pH and Alkalinity Tracker: Log Trends Without Spreadsheets',
  description:
    'Track pH and alkalinity readings over time in a simple hot tub log so drift patterns are visible and refill-cycle decisions are easier.',
  alternates: {
    canonical:
      'https://www.josiahhawkins.com/spa-switch/hot-tub-ph-alkalinity-tracker',
  },
}

export default function PhAlkalinityTrackerPage() {
  return (
    <SpaSwitchPage
      eyebrow='Trend Log'
      title='Hot Tub pH and Alkalinity Tracker'
    >
      <section className='space-y-5'>
        <p>
          A tracker helps you spot drift patterns instead of reacting to one
          reading in isolation. The goal is recordkeeping, not replacing product
          labels or manufacturer guidance.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Minimal Logging Framework
        </h2>
        <ul className='list-disc space-y-2 pl-6'>
          <li>Date and time</li>
          <li>pH</li>
          <li>Alkalinity in ppm</li>
          <li>Current sanitizer mode</li>
          <li>Optional notes for soak load or unusual usage</li>
        </ul>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Weekly Review Pattern
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='border-b border-slate-200'>
                <th className='py-3 pr-4 font-semibold text-slate-950'>Week</th>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  pH trend
                </th>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Alkalinity trend
                </th>
                <th className='py-3 font-semibold text-slate-950'>
                  Action note
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              <tr>
                <td className='py-3 pr-4'>Week 1</td>
                <td className='py-3 pr-4'>Stable</td>
                <td className='py-3 pr-4'>Slightly down</td>
                <td className='py-3'>Keep logging</td>
              </tr>
              <tr>
                <td className='py-3 pr-4'>Week 2</td>
                <td className='py-3 pr-4'>Rising</td>
                <td className='py-3 pr-4'>Stable</td>
                <td className='py-3'>Re-check test method and usage changes</td>
              </tr>
              <tr>
                <td className='py-3 pr-4'>Week 3</td>
                <td className='py-3 pr-4'>Stable</td>
                <td className='py-3 pr-4'>Stable</td>
                <td className='py-3'>No change</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>This page is about tracking patterns, not prescribing chemicals.</p>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Log It in Spa Switch
        </h2>
        <p>
          After unlock, Spa Switch can attach pH and alkalinity values to each
          saved dose entry and display trend history in one place.
        </p>
        <a
          className='inline-flex rounded-md bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800'
          href={appStoreUrl}
        >
          Download Spa Switch
        </a>
      </section>
    </SpaSwitchPage>
  )
}
