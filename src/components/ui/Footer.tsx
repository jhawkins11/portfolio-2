'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi'

const socialLinks = [
  { href: 'https://github.com/jhawkins11', label: 'GitHub', icon: FiGithub },
  {
    href: 'https://linkedin.com/in/josiahhawkins',
    label: 'LinkedIn',
    icon: FiLinkedin,
  },
  { href: 'mailto:josiah.c.hawkins@gmail.com', label: 'Email', icon: FiMail },
]

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className='bg-background border-t border-gray-200 pt-16 pb-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
          {/* Logo and description */}
          <div className='md:col-span-2'>
            <Link
              href='/#hero'
              className='text-2xl font-bold text-gradient mb-4 inline-block'
            >
              Josiah Hawkins
            </Link>
            <p className='text-muted-foreground mb-6 max-w-md'>
              A Full Stack Developer passionate about building exceptional
              digital experiences with modern web technologies and cloud
              infrastructure.
            </p>
            <div className='flex space-x-4'>
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors'
                  aria-label={link.label}
                >
                  <link.icon className='w-5 h-5' />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Navigation</h3>
            <ul className='space-y-2'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Contact Info</h3>
            <ul className='space-y-2'>
              <li className='text-muted-foreground'>
                <span className='font-medium text-foreground'>Email:</span>{' '}
                <a
                  href='mailto:josiah.c.hawkins@gmail.com'
                  className='hover:text-primary transition-colors'
                >
                  josiah.c.hawkins@gmail.com
                </a>
              </li>
              <li className='text-muted-foreground'>
                <span className='font-medium text-foreground'>Phone:</span>{' '}
                <a
                  href='tel:+13092011310'
                  className='hover:text-primary transition-colors'
                >
                  (309) 201-1310
                </a>
              </li>
              <li className='text-muted-foreground'>
                <span className='font-medium text-foreground'>Location:</span>{' '}
                Illinois, USA
              </li>
            </ul>
          </div>
        </div>

        <div className='pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-muted-foreground text-sm mb-4 md:mb-0'>
            © {new Date().getFullYear()} Josiah Hawkins. All rights reserved.
          </p>

          <div className='flex items-center'>
            <p className='text-muted-foreground text-sm mr-2'>
              Built with Next.js, Tailwind CSS & Framer Motion
            </p>

            <motion.button
              onClick={handleScrollToTop}
              className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors ml-4'
              whileHover={{ y: -5 }}
              aria-label='Scroll to top'
            >
              <FiArrowUp className='w-5 h-5' />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
