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

    try {
      // In a real application, you would send the form data to your backend or a form service
      // For demo purposes, we'll simulate a successful submission after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Example response validation
      if (formData.email && formData.name && formData.message) {
        setSubmitSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Please fill out all required fields')
      }
    } catch (error) {
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
      value: 'github.com/josiahhawkins',
      href: 'https://github.com/josiahhawkins',
    },
  ]

  return (
    <section id='contact' className='py-20 md:py-28 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className='max-w-4xl mx-auto mb-16 text-center'
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Get In <span className='text-gradient'>Touch</span>
          </h2>

          <p className='text-lg text-muted-foreground'>
            Have a project in mind or want to discuss opportunities? Feel free
            to reach out!
          </p>
        </motion.div>

        <div
          ref={ref}
          className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto'
        >
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='bg-background border border-gray-200 rounded-xl shadow-lg p-6 md:p-8'
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
                      className='w-full px-4 py-2 rounded-md border border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50'
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
                      className='w-full px-4 py-2 rounded-md border border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50'
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
                    className='w-full px-4 py-2 rounded-md border border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50'
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
                    className='w-full px-4 py-2 rounded-md border border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50'
                    required
                  ></textarea>
                </div>

                {submitError && (
                  <div className='bg-error/10 text-error p-4 rounded-lg'>
                    <p>{submitError}</p>
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
              className='bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mt-8 border border-primary/20'
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
    </section>
  )
}
