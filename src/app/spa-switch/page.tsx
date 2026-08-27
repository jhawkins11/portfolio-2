import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import SpaSwitchPage from './SpaSwitchPage'
import SpaSwitchCalculator from './SpaSwitchCalculator'

const appStoreUrl = 'https://apps.apple.com/us/app/spa-switch/id6765747837'

export const metadata: Metadata = {
  title: 'Spa Switch: Hot Tub Chlorine Calculator and CYA Switch Log',
  description:
    "Calculate today's hot tub chlorine dose, see dichlor CYA impact, and track your switch point with Spa Switch.",
  alternates: {
    canonical: 'https://www.josiahhawkins.com/spa-switch',
  },
}

export default function SpaSwitchLandingPage() {
  return (
    <SpaSwitchPage
      eyebrow='Spa Switch'
      title='Hot Tub Chlorine Calculator for Dichlor and Liquid Chlorine'
    >
      <section className='space-y-5'>
        <div className='flex items-center gap-4'>
          <Image
            alt='Spa Switch app icon'
            className='h-16 w-16 rounded-2xl shadow-sm'
            height={64}
            src='/spa-switch/icon.png'
            width={64}
          />
          <div>
            <p className='font-semibold text-slate-950'>Spa Switch</p>
            <p className='text-sm text-slate-500'>
              Free web calculator. Native app for saved history.
            </p>
          </div>
        </div>
        <p>
          Calculate today&apos;s dichlor or liquid chlorine dose below. If you
          want saved profiles, CYA switch tracking, refill history, pH and
          alkalinity trends, presets, and CSV export, use the iPhone app.
        </p>
      </section>

      <SpaSwitchCalculator />

      <section className='grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-[1fr_18rem] lg:items-center'>
        <div className='space-y-5'>
          <h2 className='text-2xl font-semibold text-slate-950'>
            Save the dose when you want history
          </h2>
          <p>
            The web calculator is for a quick one-off dose. The optional
            lifetime unlock in Spa Switch adds local history, accumulated CYA
            since refill, switch-state tracking, pH and alkalinity trend
            logging, soak-load presets, refill reset, and CSV export.
          </p>
          <p>
            Spa Switch does not certify water safety, replace chemical labels,
            or replace manufacturer guidance. It uses the values you enter.
          </p>
          <a
            className='inline-flex rounded-md bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800'
            href={appStoreUrl}
          >
            Download Spa Switch
          </a>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Image
            alt='Spa Switch setup screen'
            className='h-auto w-full rounded-2xl border border-slate-200 bg-white shadow-sm'
            height={932}
            src='/spa-switch/setup.png'
            width={430}
          />
          <Image
            alt='Spa Switch history screen'
            className='h-auto w-full rounded-2xl border border-slate-200 bg-white shadow-sm'
            height={932}
            src='/spa-switch/history.png'
            width={430}
          />
        </div>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>
          What the calculator supports
        </h2>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='rounded-md border border-slate-200 bg-white p-5'>
            <h3 className='text-xl font-semibold text-slate-950'>
              Dichlor mode
            </h3>
            <p className='mt-3'>
              Calculate dose by weight and see the projected CYA increase from
              the current dose.
            </p>
          </div>
          <div className='rounded-md border border-slate-200 bg-white p-5'>
            <h3 className='text-xl font-semibold text-slate-950'>
              Liquid chlorine mode
            </h3>
            <p className='mt-3'>
              Calculate fluid-ounce dose without adding CYA to the refill-cycle
              log.
            </p>
          </div>
        </div>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>Guides</h2>
        <ul className='space-y-3'>
          <li>
            <Link
              className='font-semibold text-sky-700 hover:text-sky-900'
              href='/spa-switch/how-much-dichlor-to-add-to-hot-tub'
            >
              How much dichlor to add to a hot tub
            </Link>
          </li>
          <li>
            <Link
              className='font-semibold text-sky-700 hover:text-sky-900'
              href='/spa-switch/liquid-chlorine-hot-tub-dose-calculator'
            >
              Liquid chlorine hot tub dose calculator workflow
            </Link>
          </li>
          <li>
            <Link
              className='font-semibold text-sky-700 hover:text-sky-900'
              href='/spa-switch/hot-tub-cya-switch-point'
            >
              Hot tub CYA switch point
            </Link>
          </li>
          <li>
            <Link
              className='font-semibold text-sky-700 hover:text-sky-900'
              href='/spa-switch/hot-tub-ph-alkalinity-tracker'
            >
              Hot tub pH and alkalinity tracker
            </Link>
          </li>
        </ul>
      </section>

      <section className='space-y-5 border-t border-slate-200 pt-8'>
        <h2 className='text-2xl font-semibold text-slate-950'>FAQ</h2>
        <h3 className='text-xl font-semibold text-slate-950'>
          Is the chlorine calculator free?
        </h3>
        <p>
          Yes. The current-dose calculator is free. Paid unlock adds local
          history and advanced tracking.
        </p>
        <h3 className='text-xl font-semibold text-slate-950'>
          Does this app tell me if my water is safe?
        </h3>
        <p>
          No. It is a calculator and log. You still need your own test results,
          product labels, and manufacturer guidance.
        </p>
        <h3 className='text-xl font-semibold text-slate-950'>
          Can I track when to switch from dichlor to liquid chlorine?
        </h3>
        <p>
          Yes. After unlock, logged dichlor doses accumulate CYA and show
          switch-state status relative to your threshold.
        </p>
      </section>
    </SpaSwitchPage>
  )
}
