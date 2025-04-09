'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiSend,
} from 'react-icons/fi'
import { SectionTitle } from '../ui/SectionTitle'

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fallbackMessage, setFallbackMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)
    setFallbackMessage('')

    try {
      // Call our API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Parse the response
      const result = await response.json()

      // Check if the request was successful
      if (!response.ok) {
        // Handle fallback scenario
        if (result.fallback && result.fallbackMessage) {
          setFallbackMessage(result.fallbackMessage)
        }

        throw new Error(
          result.error || `Error: ${response.status} ${response.statusText}`
        )
      }

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(
        (error as Error).message || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'josiah.c.hawkins@gmail.com',
      href: 'mailto:josiah.c.hawkins@gmail.com',
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '(309) 201-1310',
      href: 'tel:+13092011310',
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: 'Illinois, USA',
      href: null,
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/josiahhawkins',
      href: 'https://linkedin.com/in/josiahhawkins',
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: 'github.com/jhawkins11',
      href: 'https://github.com/jhawkins11',
    },
  ]

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id='contact' className='relative py-20 md:py-28 overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90'></div>

        {/* Animated blobs */}
        <motion.div
          className='absolute inset-0 overflow-hidden'
          variants={backgroundVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className='absolute -top-1/3 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-blob'></div>
          <div className='absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-2000'></div>
          <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] bg-secondary/5 rounded-full blur-[130px] animate-blob animation-delay-4000'></div>
        </motion.div>

        {/* Grain texture */}
        <div
          className='absolute inset-0 opacity-30 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        ></div>

        {/* Grid pattern */}
        <div className='absolute inset-0 bg-grid-pattern pointer-events-none opacity-30'></div>

        {/* Floating particles */}
        <div className='bg-particles absolute inset-0 z-5 pointer-events-none'>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
        </div>
      </div>

      <div className='container mx-auto px-4 relative z-20'>
        <SectionTitle
          eyebrow='Connect'
          title='Get In Touch'
          description='Have a project in mind or want to discuss opportunities? Feel free to reach out!'
        />

        <div
          ref={ref}
          className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto'
        >
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='bg-card/50 backdrop-blur-xl border border-border/40 rounded-xl shadow-lg p-6 md:p-8'
          >
            <h3 className='text-2xl font-semibold mb-6'>Send Me a Message</h3>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-success/10 text-success p-4 rounded-lg mb-6'
              >
                <p>
                  Thank you for your message! I&apos;ll get back to you as soon
                  as possible.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium mb-2'
                    >
                      Name <span className='text-error'>*</span>
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='w-full px-4 py-2 rounded-md border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium mb-2'
                    >
                      Email <span className='text-error'>*</span>
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='w-full px-4 py-2 rounded-md border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='subject'
                    className='block text-sm font-medium mb-2'
                  >
                    Subject
                  </label>
                  <input
                    type='text'
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    className='w-full px-4 py-2 rounded-md border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
                  />
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium mb-2'
                  >
                    Message <span className='text-error'>*</span>
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className='w-full px-4 py-2 rounded-md border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
                    required
                  ></textarea>
                </div>

                {submitError && (
                  <div className='bg-error/10 text-error p-4 rounded-lg mb-6'>
                    <p>{submitError}</p>
                    {fallbackMessage && (
                      <p className='mt-2 text-sm font-medium'>
                        {fallbackMessage}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-all flex items-center justify-center'
                >
                  {isSubmitting ? (
                    <span className='flex items-center'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className='flex items-center'>
                      <FiSend className='mr-2' />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='flex flex-col justify-between'
          >
            <div>
              <h3 className='text-2xl font-semibold mb-8'>
                Contact Information
              </h3>

              <div className='space-y-6'>
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className='flex items-start'
                  >
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0'>
                      <item.icon className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <h4 className='text-lg font-medium'>{item.label}</h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={
                            item.href.startsWith('http') ? '_blank' : undefined
                          }
                          rel={
                            item.href.startsWith('http')
                              ? 'noopener noreferrer'
                              : undefined
                          }
                          className='text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline hover:underline-offset-4 rounded px-1 py-0.5 -mx-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left'
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className='text-muted-foreground'>{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1 }}
              className='bg-card/50 backdrop-blur-xl rounded-xl p-6 mt-8 border border-border/40 shadow-lg'
            >
              <h4 className='text-xl font-semibold mb-4'>
                Open to Opportunities
              </h4>
              <p className='text-muted-foreground'>
                I&apos;m currently available for freelance projects, full-time
                positions, and consulting opportunities. Let&apos;s build
                something amazing together!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom border/gradient effect */}
      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/5 to-transparent'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-border/30 to-transparent'></div>
    </section>
  )
}
