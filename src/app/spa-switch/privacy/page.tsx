import type { Metadata } from 'next'
import SpaSwitchPage from '../SpaSwitchPage'

export const metadata: Metadata = {
  title: 'Spa Switch Privacy Policy',
  description: 'Privacy policy for Spa Switch.',
  alternates: {
    canonical: 'https://www.josiahhawkins.com/spa-switch/privacy',
  },
}

export default function SpaSwitchPrivacyPage() {
  return (
    <SpaSwitchPage eyebrow='Privacy' title='Spa Switch Privacy Policy'>
      <p className='text-sm font-medium text-slate-500'>
        Effective date: April 28, 2026
      </p>
      <section className='space-y-5'>
        <p>
          Spa Switch stores your spa profile, dose logs, presets, and lifetime
          unlock state locally on your device. The app does not require an
          account, does not use cloud sync, does not show ads, and does not
          publish user content.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Purchases
        </h2>
        <p>
          The lifetime unlock is processed by Apple In-App Purchase. Apple may
          process purchase, refund, and receipt information under Apple&apos;s
          terms and privacy policy.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Analytics
        </h2>
        <p>
          Spa Switch records only non-identifying product events and numeric
          buckets if analytics are enabled. It does not record notes, exact
          water readings, contact information, or spa profile details.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Data Deletion
        </h2>
        <p>
          Use Delete local data in Settings to remove the local profile, logs,
          presets, and local unlock record from the device. Restore purchase can
          recover the unlock from Apple for the purchasing Apple ID.
        </p>
        <h2 className='border-t border-slate-200 pt-7 text-2xl font-semibold text-slate-950'>
          Contact
        </h2>
        <p>Email support@josiahhawkins.com for privacy questions.</p>
      </section>
    </SpaSwitchPage>
  )
}
