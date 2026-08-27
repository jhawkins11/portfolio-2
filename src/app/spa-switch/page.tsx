import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SpaSwitchCalculator from './SpaSwitchCalculator'

const appStoreUrl = 'https://apps.apple.com/us/app/spa-switch/id6765747837'

export const metadata: Metadata = {
  title: 'Spa Switch — Hot Tub Chlorine Calculator & CYA Tracker',
  description:
    'Calculate hot tub chlorine doses, understand dichlor CYA impact, and keep refill-cycle history with Spa Switch.',
  alternates: {
    canonical: 'https://www.josiahhawkins.com/spa-switch',
  },
}

function PhoneMockup({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={`rounded-[2.8rem] border-[9px] border-slate-950 bg-slate-950 p-[2px] shadow-[0_30px_80px_rgba(15,23,42,0.22)] ${className}`}
    >
      <Image
        alt={alt}
        className='h-auto w-full rounded-[2.15rem] bg-white'
        height={932}
        src={src}
        width={430}
      />
    </div>
  )
}

const featureCards = [
  {
    number: '01',
    title: 'Fast dose math',
    copy: 'Enter your current and target free chlorine and get the amount to add without doing the conversion by hand.',
  },
  {
    number: '02',
    title: 'CYA awareness',
    copy: 'See the projected stabilizer increase from each dichlor dose and keep the switch point visible instead of guessing.',
  },
  {
    number: '03',
    title: 'Refill-cycle history',
    copy: 'Save doses, chemistry notes, presets, and refill history locally so the next adjustment starts with context.',
  },
]

export default function SpaSwitchLandingPage() {
  return (
    <main className='min-h-screen overflow-hidden bg-[#f6fafb] text-[#07111f]'>
      <section className='relative isolate overflow-hidden border-b border-slate-200/80 bg-white'>
        <div
          aria-hidden='true'
          className='absolute -left-48 top-40 -z-10 h-[34rem] w-[34rem] rounded-full opacity-70 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(14,165,164,.18) 0%, rgba(14,165,164,.05) 46%, transparent 72%)',
          }}
        />
        <div
          aria-hidden='true'
          className='absolute -right-52 -top-32 -z-10 h-[42rem] w-[42rem] rounded-full opacity-80 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(56,189,248,.14) 0%, rgba(56,189,248,.04) 48%, transparent 72%)',
          }}
        />

        <nav className='mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8'>
          <Link
            className='text-sm font-semibold tracking-tight text-slate-900 transition hover:text-teal-700'
            href='/'
          >
            Josiah Hawkins
          </Link>
          <a
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-teal-300 hover:text-teal-700'
            href={appStoreUrl}
            rel='noreferrer'
            target='_blank'
          >
            App Store <span aria-hidden='true'>↗</span>
          </a>
        </nav>

        <div className='mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-16'>
          <div className='max-w-2xl'>
            <div className='mb-9 flex items-center gap-4'>
              <Image
                alt='Spa Switch app icon'
                className='h-14 w-14 rounded-2xl shadow-[0_12px_30px_rgba(13,148,136,.22)]'
                height={64}
                priority
                src='/spa-switch/icon.png'
                width={64}
              />
              <div>
                <p className='text-xl font-bold tracking-tight text-slate-950'>
                  Spa Switch
                </p>
                <p className='mt-0.5 text-sm font-medium text-slate-500'>
                  Hot tub chemistry, simplified
                </p>
              </div>
            </div>

            <p className='text-xs font-bold uppercase tracking-[0.22em] text-teal-700'>
              Chlorine dosing · CYA tracking · iPhone
            </p>
            <h1 className='mt-5 max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.75rem]'>
              Know your dose{' '}
              <span className='text-teal-600'>instantly.</span>
            </h1>
            <p className='mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl'>
              Spa Switch turns the everyday hot tub chemistry routine into a
              focused workflow: calculate the dose, see the CYA impact, and keep
              the refill cycle from turning into guesswork.
            </p>

            <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <a
                className='inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_34px_rgba(15,23,42,.16)] transition hover:-translate-y-0.5 hover:bg-slate-800'
                href={appStoreUrl}
                rel='noreferrer'
                target='_blank'
              >
                View on the App Store <span aria-hidden='true'>↗</span>
              </a>
              <a
                className='inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700'
                href='#calculator'
              >
                Try the free calculator
              </a>
            </div>

            <div className='mt-10 grid max-w-xl gap-3 sm:grid-cols-3'>
              {[
                ['Dose math', 'Dichlor + liquid'],
                ['CYA impact', 'Shown per dose'],
                ['History', 'Stored locally'],
              ].map(([label, value]) => (
                <div
                  className='rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 shadow-sm backdrop-blur'
                  key={label}
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-400'>
                    {label}
                  </p>
                  <p className='mt-1.5 text-sm font-bold text-slate-900'>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='relative mx-auto min-h-[620px] w-full max-w-[620px] sm:min-h-[700px]'>
            <div
              aria-hidden='true'
              className='absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-sky-50 shadow-[inset_0_0_70px_rgba(14,165,164,.08)] sm:h-[36rem] sm:w-[36rem]'
            />
            <div
              aria-hidden='true'
              className='absolute left-[8%] top-[18%] h-20 w-20 rounded-full border border-sky-100 bg-white/70 shadow-[0_12px_35px_rgba(14,165,164,.08)] backdrop-blur sm:h-24 sm:w-24'
            />
            <div
              aria-hidden='true'
              className='absolute bottom-[9%] right-[3%] h-28 w-28 rounded-full border border-teal-100 bg-teal-50/70 sm:h-36 sm:w-36'
            />

            <PhoneMockup
              alt='Spa Switch chlorine dose calculator screen'
              className='absolute left-1/2 top-1/2 z-20 w-[265px] -translate-x-1/2 -translate-y-1/2 rotate-[-1deg] sm:w-[310px]'
              src='/spa-switch/calculator.png'
            />

            <div className='absolute right-0 top-[14%] z-30 hidden w-48 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_18px_50px_rgba(15,23,42,.12)] backdrop-blur sm:block'>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>
                Projected CYA
              </p>
              <p className='mt-2 text-3xl font-bold tracking-tight text-blue-600'>
                +3.6
                <span className='ml-1 text-sm font-semibold text-slate-500'>ppm</span>
              </p>
              <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100'>
                <div className='h-full w-2/3 rounded-full bg-teal-500' />
              </div>
            </div>

            <div className='absolute bottom-[15%] left-0 z-30 hidden w-48 rounded-2xl border border-white/80 bg-slate-950 p-4 text-white shadow-[0_20px_55px_rgba(15,23,42,.2)] sm:block'>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>
                Dose needed
              </p>
              <p className='mt-2 text-3xl font-bold tracking-tight text-teal-300'>
                0.33 oz
              </p>
              <p className='mt-1 text-xs leading-5 text-slate-400'>
                by weight · dichlor
              </p>
            </div>

            <div className='absolute left-[12%] top-[9%] z-30 rounded-full bg-[#f58a07] px-3 py-1.5 text-xs font-bold text-white shadow-lg'>
              Built for hot tubs
            </div>
          </div>
        </div>
      </section>

      <section className='border-b border-slate-200/80 bg-[#07111f] text-white'>
        <div className='mx-auto grid max-w-7xl gap-px bg-white/10 lg:grid-cols-3'>
          {featureCards.map((feature) => (
            <article
              className='bg-[#07111f] px-6 py-10 lg:px-10 lg:py-12'
              key={feature.number}
            >
              <p className='text-xs font-bold tracking-[0.22em] text-teal-300'>
                {feature.number}
              </p>
              <h2 className='mt-5 text-2xl font-bold tracking-tight'>{feature.title}</h2>
              <p className='mt-4 max-w-md leading-7 text-slate-300'>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28'>
        <div className='grid gap-16 lg:grid-cols-[.88fr_1.12fr] lg:items-center'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-teal-700'>
              More than a one-off calculator
            </p>
            <h2 className='mt-5 text-4xl font-bold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl'>
              Keep the whole refill cycle in view.
            </h2>
            <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
              The free web tool handles a quick dose. The iPhone app adds the
              context that matters over time: saved history, accumulated CYA,
              switch-state tracking, pH and alkalinity trends, presets, refill
              reset, and CSV export.
            </p>

            <div className='mt-9 space-y-5'>
              {[
                ['No account required', 'Profiles and history stay on the device.'],
                ['Two sanitizer workflows', 'Dichlor by weight and liquid chlorine by volume.'],
                ['Built around real maintenance', 'Refills, presets, trends, and switch-state context live together.'],
              ].map(([title, copy]) => (
                <div className='flex gap-4' key={title}>
                  <span className='mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-black text-teal-700'>
                    ✓
                  </span>
                  <div>
                    <h3 className='font-bold text-slate-950'>{title}</h3>
                    <p className='mt-1 leading-7 text-slate-600'>{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='relative min-h-[650px] overflow-hidden rounded-[2.5rem] border border-teal-100 bg-gradient-to-br from-white via-teal-50/70 to-sky-50 p-6 sm:min-h-[720px] sm:p-10'>
            <div className='absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent' />
            <PhoneMockup
              alt='Spa Switch setup screen'
              className='absolute left-[8%] top-[12%] z-10 w-[230px] rotate-[-5deg] sm:w-[270px]'
              src='/spa-switch/setup.png'
            />
            <PhoneMockup
              alt='Spa Switch history screen'
              className='absolute bottom-[9%] right-[8%] z-20 w-[235px] rotate-[4deg] sm:w-[275px]'
              src='/spa-switch/history.png'
            />
            <div className='absolute bottom-[8%] left-[7%] max-w-[15rem] rounded-2xl border border-white bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,.09)] backdrop-blur'>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-teal-700'>
                Local-first
              </p>
              <p className='mt-2 text-lg font-bold tracking-tight text-slate-950'>
                Your maintenance history stays with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className='border-y border-slate-200/80 bg-white py-20 lg:py-28'
        id='calculator'
      >
        <div className='mx-auto max-w-5xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-teal-700'>
              Try it in the browser
            </p>
            <h2 className='mt-5 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl'>
              Calculate a dose right now.
            </h2>
            <p className='mt-5 text-lg leading-8 text-slate-600'>
              The web calculator uses the same public dose constants as Spa
              Switch. No signup, no saved data—just the current calculation.
            </p>
          </div>
          <div className='mt-12'>
            <SpaSwitchCalculator />
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28'>
        <div className='grid gap-12 lg:grid-cols-[1fr_1fr]'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-teal-700'>
              Chemistry workflows
            </p>
            <h2 className='mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl'>
              Designed around the way spa owners actually dose.
            </h2>
            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 font-black text-teal-700'>
                  D
                </div>
                <h3 className='mt-5 text-xl font-bold text-slate-950'>Dichlor mode</h3>
                <p className='mt-3 leading-7 text-slate-600'>
                  Calculate dose by weight and see the projected CYA increase
                  from the same addition.
                </p>
              </div>
              <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 font-black text-sky-700'>
                  L
                </div>
                <h3 className='mt-5 text-xl font-bold text-slate-950'>
                  Liquid chlorine
                </h3>
                <p className='mt-3 leading-7 text-slate-600'>
                  Calculate fluid-ounce dose without adding CYA to the
                  refill-cycle log.
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-[2rem] bg-[#07111f] p-7 text-white sm:p-9'>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-teal-300'>
              Guides
            </p>
            <h2 className='mt-4 text-3xl font-bold tracking-tight'>
              The math, explained.
            </h2>
            <div className='mt-7 divide-y divide-white/10'>
              {[
                ['/spa-switch/how-much-dichlor-to-add-to-hot-tub', 'How much dichlor to add to a hot tub'],
                ['/spa-switch/liquid-chlorine-hot-tub-dose-calculator', 'Liquid chlorine dose calculator workflow'],
                ['/spa-switch/hot-tub-cya-switch-point', 'Hot tub CYA switch point'],
                ['/spa-switch/hot-tub-ph-alkalinity-tracker', 'Hot tub pH and alkalinity tracker'],
              ].map(([href, title]) => (
                <Link
                  className='group flex items-center justify-between gap-5 py-5 text-base font-semibold text-slate-200 transition hover:text-white'
                  href={href}
                  key={href}
                >
                  {title}
                  <span
                    aria-hidden='true'
                    className='text-teal-300 transition group-hover:translate-x-1'
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='border-t border-slate-200/80 bg-white'>
        <div className='mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-24'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.22em] text-teal-700'>FAQ</p>
            <h2 className='mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950'>
              A focused tool, not a water-safety verdict.
            </h2>
          </div>
          <div className='divide-y divide-slate-200'>
            {[
              [
                'Is the chlorine calculator free?',
                'Yes. The current-dose calculator is free. The optional app unlock adds local history and advanced tracking.',
              ],
              [
                'Does Spa Switch tell me if my water is safe?',
                'No. Spa Switch is a calculator and log. Use your own test results and always follow chemical labels and your hot tub manufacturer’s guidance.',
              ],
              [
                'Can I track when to switch from dichlor to liquid chlorine?',
                'Yes. Logged dichlor doses can accumulate CYA across the refill cycle and show switch-state status relative to the threshold you set.',
              ],
            ].map(([question, answer]) => (
              <div className='py-7 first:pt-0' key={question}>
                <h3 className='text-lg font-bold text-slate-950'>{question}</h3>
                <p className='mt-3 max-w-2xl leading-7 text-slate-600'>{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-teal-600 text-white'>
        <div className='mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-center sm:justify-between lg:px-8'>
          <div>
            <p className='text-sm font-bold uppercase tracking-[0.2em] text-teal-100'>
              Spa Switch
            </p>
            <h2 className='mt-2 text-3xl font-bold tracking-tight'>
              Less chemistry math. More time in the water.
            </h2>
          </div>
          <a
            className='inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-teal-800 shadow-lg transition hover:-translate-y-0.5'
            href={appStoreUrl}
            rel='noreferrer'
            target='_blank'
          >
            View on the App Store <span aria-hidden='true'>↗</span>
          </a>
        </div>
      </section>

      <footer className='bg-[#07111f] text-slate-400'>
        <div className='mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8'>
          <p>© 2026 Josiah Hawkins · Spa Switch</p>
          <div className='flex gap-5'>
            <Link className='transition hover:text-white' href='/spa-switch/support'>
              Support
            </Link>
            <Link className='transition hover:text-white' href='/spa-switch/privacy'>
              Privacy
            </Link>
            <Link className='transition hover:text-white' href='/'>
              Josiah Hawkins
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
