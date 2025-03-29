'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FiCode,
  FiCloud,
  FiDatabase,
  FiLayers,
  FiTerminal,
} from 'react-icons/fi'
import { SectionTitle } from '../ui/SectionTitle'

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Terminal animation state
  const [terminalText, setTerminalText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)

  // Lines of code to type out
  const codeLines = [
    '> whoami',
    'Full Stack Developer',
    '> skills.list()',
    '["React", "Next.js", "TypeScript", "AWS", "Node.js"]',
    '> experience.years()',
    '3+',
    '> passion',
    '"Building exceptional digital experiences"',
  ]

  // Type writer effect with improved reliability
  useEffect(() => {
    if (!isInView) return

    // Blink cursor
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    // Type text - completely rewritten for fixed version
    let timeoutId: NodeJS.Timeout | null = null

    const typeNextLine = () => {
      if (currentLine >= codeLines.length) {
        return
      }

      const line = codeLines[currentLine]
      let charIndex = 0
      let currentLineText = ''

      const typeSingleChar = () => {
        if (charIndex < line.length) {
          currentLineText += line.charAt(charIndex)
          setTerminalText((prev) => {
            // Split previous text by newlines to get all lines
            const lines = prev.split('\n')

            // If we already have content and we're starting a new line,
            // we need to make sure we're not replacing an existing line
            if (charIndex === 0 && lines.length <= currentLine) {
              return prev + currentLineText
            } else {
              // Replace the current line with our updated text
              lines[currentLine] = currentLineText
              return lines.join('\n')
            }
          })

          charIndex++

          // Schedule next character
          const typingSpeed = currentLine % 2 === 0 ? 80 : 40 // Commands type slower, responses faster
          timeoutId = setTimeout(typeSingleChar, typingSpeed)
        } else {
          // Line is complete, move to next line
          timeoutId = setTimeout(() => {
            setTerminalText((prev) => prev + '\n')
            setCurrentLine((prev) => prev + 1)
          }, 600)
        }
      }

      typeSingleChar()
    }

    // Only trigger the typing effect when the current line changes or when we first come into view
    // This is a key fix - we were triggering this effect when terminalText changed, causing issues
    const lineChangeEffect = () => {
      // Start typing new line
      if (currentLine < codeLines.length) {
        typeNextLine()
      }
    }

    // Call the effect when we first come into view or when the line changes
    lineChangeEffect()

    return () => {
      clearInterval(cursorInterval)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isInView, currentLine, codeLines.length])

  // Card data
  const cards = [
    {
      title: 'Frontend Development',
      description:
        'Creating responsive, interactive UIs with React, TypeScript, and modern CSS frameworks.',
      icon: FiCode,
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Cloud Infrastructure',
      description:
        'Building scalable systems with AWS services like Lambda, S3, EC2, and Elastic Beanstalk.',
      icon: FiCloud,
      color: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Full Stack Expertise',
      description:
        'End-to-end development with Next.js, Express, and various databases.',
      icon: FiLayers,
      color: 'from-violet-500 to-purple-600',
      iconColor: 'text-violet-500',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
      title: 'Database Design',
      description:
        'Working with SQL, NoSQL, and ORM technologies to create efficient data systems.',
      icon: FiDatabase,
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ]

  return (
    <section
      id='about'
      className='relative py-20 md:py-28 overflow-hidden'
      ref={ref}
    >
      {/* Enhanced atmospheric background effects */}
      <div className='absolute inset-0'>
        {/* Primary gradient background */}
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/90'></div>

        {/* Animated blobs with stronger presence */}
        <div className='absolute top-0 -right-1/4 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] animate-blob'></div>
        <div className='absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[130px] animate-blob animation-delay-4000'></div>

        {/* Enhanced grain texture */}
        <div
          className='absolute inset-0 opacity-30 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        ></div>
      </div>

      <div className='container mx-auto px-4 relative'>
        {/* Section Header */}
        <SectionTitle
          eyebrow='About Me'
          title='Full Stack Developer'
          description="I'm a Full Stack Developer passionate about building modern, high-performance web applications that solve real business problems. With expertise in React/Next.js and AWS infrastructure, I focus on creating scalable solutions with exceptional user experiences."
        />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
          {/* Terminal Visualization */}
          <motion.div
            className='order-2 md:order-1 col-span-1'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className='rounded-xl overflow-hidden shadow-2xl shadow-primary/5 relative h-[400px] bg-card/40 backdrop-blur-xl border border-border/30'>
              {/* Terminal header */}
              <div className='h-8 bg-background/50 backdrop-blur-sm flex items-center px-4 border-b border-border/20'>
                <div className='flex space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-red-500/80'></div>
                  <div className='w-3 h-3 rounded-full bg-yellow-500/80'></div>
                  <div className='w-3 h-3 rounded-full bg-green-500/80'></div>
                </div>
                <div className='flex-1 text-center text-muted-foreground/70 text-xs font-medium'>
                  developer@portfolio ~
                </div>
              </div>

              {/* Terminal content */}
              <div className='p-6 font-mono text-sm sm:text-base h-[calc(100%-64px)] overflow-hidden relative'>
                <div className='relative z-10'>
                  <pre className='text-primary/90 whitespace-pre-wrap break-words'>
                    {terminalText}
                    <span
                      className={`inline-block w-2 h-4 bg-primary ml-1 ${
                        cursorVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                    ></span>
                  </pre>
                </div>

                {/* Terminal decorative elements */}
                <div className='absolute top-1/4 right-0 w-32 h-32 rounded-full bg-primary/5 mix-blend-screen blur-2xl'></div>
                <div className='absolute bottom-1/4 left-0 w-40 h-40 rounded-full bg-accent/5 mix-blend-screen blur-2xl'></div>
              </div>

              {/* Terminal info line */}
              <div className='absolute bottom-0 left-0 right-0 h-8 bg-background/50 backdrop-blur-sm flex items-center px-4 justify-between border-t border-border/20'>
                <div className='flex items-center'>
                  <FiTerminal className='text-muted-foreground/70 mr-2' />
                  <span className='text-muted-foreground/70 text-xs'>bash</span>
                </div>
                <div className='text-muted-foreground/70 text-xs'>
                  node v18.15.0
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Cards Grid */}
          <motion.div
            className='order-1 md:order-2 col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='bg-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group'
              >
                {/* Top decoration line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-gradient-to-r ${card.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                ></div>

                <div className='flex items-start space-x-4'>
                  <div
                    className={`${card.bgColor} bg-opacity-20 backdrop-blur-sm p-3 rounded-lg border border-border/20`}
                  >
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold mb-2 text-foreground/90'>
                      {card.title}
                    </h3>
                    <p className='text-muted-foreground/90 text-sm leading-relaxed'>
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Enhanced hover effect */}
                <div className='absolute -inset-px rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Terminal gradient and particles styles */}
      <style jsx>{`
        .code-particles::before,
        .code-particles::after {
          content: '{ } < / > ( ) => ;';
          position: absolute;
          font-family: monospace;
          font-size: 10px;
          color: rgba(var(--primary-rgb), 0.1);
          pointer-events: none;
          white-space: nowrap;
        }

        .code-particles::before {
          top: 30%;
          left: 10%;
          animation: float 15s linear infinite;
        }

        .code-particles::after {
          bottom: 25%;
          right: 15%;
          animation: float 12s linear infinite reverse;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, 15px) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
