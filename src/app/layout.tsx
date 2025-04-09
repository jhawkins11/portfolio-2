import type { Metadata } from 'next'
import { Inter, Roboto_Mono, Poppins } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Josiah Hawkins | Full Stack Developer',
  description:
    'Portfolio of Josiah Hawkins, a Full Stack Developer with expertise in React, Next.js, and AWS.',
  keywords: [
    'React',
    'Next.js',
    'Full Stack Developer',
    'JavaScript',
    'TypeScript',
    'AWS',
  ],
  authors: [{ name: 'Josiah Hawkins', url: 'https://josiahhawkins.com' }],
  creator: 'Josiah Hawkins',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <head>
        <link rel='icon' href='/favicon.png' type='image/png' sizes='64x64' />
        <link
          rel='icon'
          href='/favicon-32x32.png'
          type='image/png'
          sizes='32x32'
        />
        <link
          rel='icon'
          href='/favicon-16x16.png'
          type='image/png'
          sizes='16x16'
        />
        <link
          rel='apple-touch-icon'
          href='/apple-touch-icon.png'
          sizes='180x180'
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${poppins.variable} font-sans antialiased bg-gradient-to-br from-base-100 to-base-200 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
