'use client'

import { motion } from 'framer-motion'

interface SectionTitleProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  eyebrowColor?: string
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  eyebrowColor = 'text-primary',
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-5xl mx-auto mb-16 ${
        align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      <div className='relative mb-4'>
        {/* Minimal accent line */}
        <div
          className={`${
            align === 'center' ? 'mx-auto w-12' : 'ml-0 w-12'
          } h-[2px] bg-primary/80 mb-4`}
        />

        {/* Eyebrow - small category label */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span
            className={`text-xs uppercase tracking-[0.2em] font-medium ${eyebrowColor}`}
          >
            {eyebrow}
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h2
          className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mt-1 mb-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {title}
        </motion.h2>

        {/* Dot accent element */}
        <div
          className={`${
            align === 'center' ? 'mx-auto' : 'ml-0'
          } h-1.5 w-1.5 rounded-full bg-primary mt-2`}
        ></div>
      </div>

      {description && (
        <motion.p
          className='text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
