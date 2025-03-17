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
      className='relative py-20 md:py-28 bg-gradient-to-b from-background via-background/80 to-slate-900/95 overflow-hidden'
      ref={ref}
    >
      {/* Decorative elements that match the hero section aesthetic */}
      <div className='absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none z-0'></div>
      <div className='absolute inset-0 bg-noise opacity-20 pointer-events-none z-0'></div>

      {/* Animated background blobs similar to hero with adjusted colors */}
      <div className='blob bg-pink-500/10 w-[600px] h-[600px] -top-48 -left-24 blur-3xl opacity-50 z-0'></div>
      <div className='blob bg-purple-500/10 w-[700px] h-[700px] -right-48 top-1/3 blur-3xl animation-delay-2000 opacity-50 z-0'></div>
      <div className='blob bg-blue-500/10 w-[500px] h-[500px] bottom-0 left-1/3 blur-3xl animation-delay-4000 opacity-50 z-0'></div>

      <div className='container mx-auto px-4 relative z-10'>
        {/* Section Header - Styled to match the hero heading */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-6 tracking-tight'>
            About{' '}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'>
              Me
            </span>
          </h2>

          <motion.div
            className='h-1 w-24 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full mb-6'
            initial={{ width: 0 }}
            animate={isInView ? { width: '6rem' } : { width: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          ></motion.div>

          <motion.p
            className='text-slate-700 max-w-3xl mx-auto mt-6 text-lg'
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            I&apos;m a Full Stack Developer passionate about building modern,
            high-performance web applications that solve real business problems.
            With expertise in React/Next.js and AWS infrastructure, I focus on
            creating scalable solutions with exceptional user experiences.
          </motion.p>
        </motion.div>

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
            <div className='rounded-xl overflow-hidden shadow-2xl shadow-blue-500/5 relative h-[400px] terminal-gradient'>
              {/* Terminal header */}
              <div className='h-8 bg-gray-800/90 flex items-center px-4'>
                <div className='flex space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-red-500'></div>
                  <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                  <div className='w-3 h-3 rounded-full bg-green-500'></div>
                </div>
                <div className='flex-1 text-center text-gray-400 text-xs font-medium'>
                  developer@portfolio ~
                </div>
              </div>

              {/* Terminal content */}
              <div className='p-6 font-mono text-sm sm:text-base h-[calc(100%-64px)] overflow-hidden'>
                <pre className='text-green-400 whitespace-pre-wrap break-words'>
                  {terminalText}
                  <span
                    className={`inline-block w-2 h-4 bg-green-400 ml-1 ${
                      cursorVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></span>
                </pre>
              </div>

              {/* Terminal info line */}
              <div className='absolute bottom-0 left-0 right-0 h-8 bg-gray-800/90 backdrop-blur-sm flex items-center px-4 justify-between'>
                <div className='flex items-center'>
                  <FiTerminal className='text-gray-400 mr-2' />
                  <span className='text-gray-400 text-xs'>bash</span>
                </div>
                <div className='text-gray-400 text-xs'>node v18.15.0</div>
              </div>

              {/* Enhanced decorative elements */}
              <div className='absolute top-12 right-6 w-32 h-32 rounded-full bg-blue-500/10 mix-blend-screen blur-2xl'></div>
              <div className='absolute bottom-16 left-8 w-40 h-40 rounded-full bg-purple-500/10 mix-blend-screen blur-2xl'></div>

              {/* Code particles */}
              <div className='code-particles'></div>
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
                className='bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group'
              >
                {/* Top decoration line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${card.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                ></div>

                <div className='flex items-start space-x-4'>
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold mb-2 text-slate-700'>
                      {card.title}
                    </h3>
                    <p className='text-slate-700 text-sm'>{card.description}</p>
                  </div>
                </div>

                {/* Enhanced subtle particle effects */}
                <div className='absolute -bottom-1 -right-1 w-20 h-20 rounded-full bg-gradient-to-tr from-primary/0 to-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Terminal gradient and particles styles */}
      <style jsx>{`
        .terminal-gradient {
          background: linear-gradient(to bottom right, #1a1a1a, #0c1021);
          position: relative;
          overflow: hidden;
        }

        .terminal-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, #4a9eff, #a431ff, #f26df9);
          z-index: 1;
        }

        .code-particles::before,
        .code-particles::after {
          content: '{ } < / > ( ) => ;';
          position: absolute;
          font-family: monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.1);
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
