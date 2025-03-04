import type { Metadata } from 'next'
import { Inter, Roboto_Mono, Poppins } from 'next/font/google'
import './globals.css'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${poppins.variable} font-sans antialiased bg-gradient-to-br from-base-100 to-base-200 min-h-screen`}
      >
        {children}
      </body>
    </html>
  )
}
