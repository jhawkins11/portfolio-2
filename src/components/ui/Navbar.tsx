'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiMenu, FiX } from 'react-icons/fi'

const navLinks = [
  { href: '#hero', label: 'Home', priority: 'high' },
  { href: '#about', label: 'About', priority: 'high' },
  { href: '#experience', label: 'Experience', priority: 'high' },
  { href: '#projects', label: 'Projects', priority: 'high' },
  { href: '#skills', label: 'Skills', priority: 'low' },
  { href: '#github-activity', label: 'Contributions', priority: 'low' },
  { href: '#contact', label: 'Contact', priority: 'high' },
]

const socialLinks = [
  { href: 'https://github.com/jhawkins11', label: 'GitHub', icon: FiGithub },
  {
    href: 'https://linkedin.com/in/josiahhawkins',
    label: 'LinkedIn',
    icon: FiLinkedin,
  },
  { href: 'mailto:josiah.c.hawkins@gmail.com', label: 'Email', icon: FiMail },
]

const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  e.preventDefault()
  const targetId = href.replace('#', '')
  const element = document.getElementById(targetId)
  if (element) {
    const offset = 80
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#hero')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Check which section is currently in view
      const sections = navLinks.map((link) => link.href.replace('#', ''))
      const sectionElements = sections.map((id) => document.getElementById(id))

      const currentSection = sectionElements.findIndex((element) => {
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection !== -1) {
        setActiveSection('#' + sections[currentSection])
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-lg shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <motion.div
          className='flex-shrink-0 font-bold text-2xl relative'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href='/#hero' className='relative z-10 flex items-center'>
            <div className='relative inline-flex items-center justify-center'>
              <motion.img
                src='/logo.png'
                width={80}
                height={80}
                alt='JH Logo'
                className='logo transition-all duration-300'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center space-x-1 bg-background/30 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10'>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`${link.priority === 'low' ? 'hidden lg:block' : ''}`}
            >
              <Link
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-all relative ${
                  activeSection === link.href
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 mx-auto w-1/2'
                    layoutId='navIndicator'
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Social Links - Desktop */}
        <div className='hidden md:flex items-center space-x-4'>
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-foreground/70 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5'
              aria-label={link.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon className='w-5 h-5' />
            </motion.a>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className='md:hidden'>
          <button
            type='button'
            className='text-foreground p-2 rounded-full bg-background/50 backdrop-blur-md border border-white/10 focus:outline-none'
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <FiX className='h-5 w-5' />
            ) : (
              <FiMenu className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className='md:hidden pt-4 pb-6 px-4 space-y-2 bg-background/95 backdrop-blur-lg border-t border-white/10 rounded-b-2xl shadow-lg'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                activeSection === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-background/80 text-foreground/70 hover:text-foreground'
              }`}
              onClick={(e) => {
                setMobileMenuOpen(false)
                scrollToSection(e, link.href)
              }}
            >
              {link.label}
              {activeSection === link.href && (
                <div className='h-full w-1 bg-primary absolute left-0 top-0 rounded-r-full'></div>
              )}
            </Link>
          ))}
          <div className='flex items-center space-x-3 pt-4 px-2 border-t border-white/5 mt-4'>
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-foreground/70 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5 flex items-center justify-center'
                aria-label={link.label}
              >
                <link.icon className='w-5 h-5' />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
