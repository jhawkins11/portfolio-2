import Link from 'next/link'

type SpaSwitchPageProps = {
  children: React.ReactNode
  eyebrow: string
  title: string
}

export default function SpaSwitchPage({
  children,
  eyebrow,
  title,
}: SpaSwitchPageProps) {
  return (
    <main className='min-h-screen bg-slate-50 text-slate-950'>
      <div className='mx-auto max-w-3xl px-6 py-10 sm:py-14'>
        <header className='border-b border-slate-200 pb-8'>
          <nav className='flex items-center justify-between gap-4 text-sm'>
            <Link
              className='font-semibold text-slate-950 hover:text-sky-700'
              href='/'
            >
              Josiah Hawkins
            </Link>
            <span className='rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600'>
              Spa Switch
            </span>
          </nav>
          <p className='mt-12 text-sm font-semibold uppercase tracking-[0.16em] text-sky-700'>
            {eyebrow}
          </p>
          <h1 className='mt-3 text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl'>
            {title}
          </h1>
        </header>

        <div className='space-y-8 py-10 text-base leading-7 text-slate-700'>
          {children}
        </div>
      </div>
    </main>
  )
}
