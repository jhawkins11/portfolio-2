import Link from 'next/link'
import type { Metadata } from 'next'
import SpaSwitchPage from '../SpaSwitchPage'

const appStoreUrl = 'https://apps.apple.com/us/app/spa-switch/id6765747837'

export const metadata: Metadata = {
  title: 'Hot Tub CYA Switch Point: When to Move from Dichlor to Liquid Chlorine',
  description:
    'Track cumulative CYA from dichlor doses and decide when your planned switch point to liquid chlorine is due.',
  alternates: {
    canonical: 'https://www.josiahhawkins.com/spa-switch/hot-tub-cya-switch-point',
  },
}

export default function CyaSwitchPointPage() {
  return (
    <SpaSwitchPage eyebrow='CYA Switch' title='Hot Tub CYA Switch Point'>
      <section className='space-y-5'>
        <p>
          Dichlor provides chlorine and adds CYA. A planned switch point helps
          keep dosing predictable over a refill cycle by limiting continuous
          stabilizer accumulation.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Simple Tracking Model
        </h2>
        <ol className='list-decimal space-y-2 pl-6'>
          <li>Set one CYA threshold in your profile.</li>
          <li>Log each dichlor dose.</li>
          <li>Add each dose&apos;s estimated CYA contribution.</li>
          <li>Mark whether the threshold is building, due, or switched.</li>
        </ol>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Example Status Table
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='border-b border-slate-200'>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Accumulated CYA
                </th>
                <th className='py-3 pr-4 font-semibold text-slate-950'>
                  Threshold
                </th>
                <th className='py-3 font-semibold text-slate-950'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              <tr>
                <td className='py-3 pr-4'>18 ppm</td>
                <td className='py-3 pr-4'>30 ppm</td>
                <td className='py-3'>building</td>
              </tr>
              <tr>
                <td className='py-3 pr-4'>30 ppm</td>
                <td className='py-3 pr-4'>30 ppm</td>
                <td className='py-3'>switch due</td>
              </tr>
              <tr>
                <td className='py-3 pr-4'>30+ ppm</td>
                <td className='py-3 pr-4'>30 ppm</td>
                <td className='py-3'>switched to liquid mode</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Authoritative Context
        </h2>
        <p>
          Cyanuric acid is a chlorine stabilizer, and stabilized chlorines
          increase it over time. Read the CDC context on{' '}
          <a
            className='font-semibold text-sky-700 hover:text-sky-900'
            href='https://www.cdc.gov/healthy-swimming/toolkit/cyanuric-acid-and-chlorine-stabilizers.html'
          >
            cyanuric acid and chlorine stabilizers
          </a>
          .
        </p>
        <p>
          For operational targets and treatment specifics, follow local
          guidance, chemical labels, and manufacturer documentation.
        </p>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          Track It in Spa Switch
        </h2>
        <p>
          Spa Switch keeps the calculator free. The paid history view tracks
          accumulated CYA across logged dichlor doses since refill and shows
          when your threshold is reached.
        </p>
        <a
          className='inline-flex rounded-md bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800'
          href={appStoreUrl}
        >
          Track your switch point
        </a>
        <p>
          Related: read the{' '}
          <Link
            className='font-semibold text-sky-700 hover:text-sky-900'
            href='/spa-switch/liquid-chlorine-hot-tub-dose-calculator'
          >
            liquid chlorine dose workflow
          </Link>
          .
        </p>
      </section>
    </SpaSwitchPage>
  )
}
