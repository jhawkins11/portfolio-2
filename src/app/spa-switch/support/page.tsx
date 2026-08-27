import type { Metadata } from 'next'
import SpaSwitchPage from '../SpaSwitchPage'

export const metadata: Metadata = {
  title: 'Spa Switch Support',
  description: 'Support information for Spa Switch.',
  alternates: {
    canonical: 'https://www.josiahhawkins.com/spa-switch/support',
  },
}

export default function SpaSwitchSupportPage() {
  return (
    <SpaSwitchPage eyebrow='Support' title='Spa Switch Support'>
      <section className='space-y-5'>
        <p>
          Spa Switch calculates hot tub chlorine doses from the profile and
          readings you enter. It does not verify water safety, replace chemical
          labels, local rules, or hot tub manufacturer guidance.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Purchase Help
        </h2>
        <p>
          Open Settings in Spa Switch and tap Restore purchase to restore the
          lifetime unlock for the Apple ID that bought it.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Contact
        </h2>
        <p>Email support@josiahhawkins.com for Spa Switch support.</p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Known Limits
        </h2>
        <p>
          V1 supports one local spa profile, dichlor and liquid chlorine dosing,
          local history after unlock, pH and alkalinity tracking, presets,
          refill reset, and CSV export. It does not support bromine, pool
          dosing, strip scanning, cloud sync, or correction-dose advice for pH
          and alkalinity.
        </p>
      </section>
    </SpaSwitchPage>
  )
}
