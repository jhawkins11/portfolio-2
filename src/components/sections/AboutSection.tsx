'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCode, FiCloud, FiLayers, FiDatabase } from 'react-icons/fi'

const skills = [
  {
    icon: FiCode,
    title: 'Frontend Development',
    description:
      'Creating responsive, interactive UIs with React, TypeScript, and modern CSS frameworks.',
  },
  {
    icon: FiCloud,
    title: 'Cloud Infrastructure',
    description:
      'Building scalable systems with AWS services like Lambda, S3, EC2, and Elastic Beanstalk.',
  },
  {
    icon: FiLayers,
    title: 'Full Stack Expertise',
    description:
      'End-to-end development with Next.js, Express, and various databases.',
  },
  {
    icon: FiDatabase,
    title: 'Database Design',
    description:
      'Working with SQL, NoSQL, and ORM technologies to create efficient data systems.',
  },
]

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
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

  return (
    <section id='about' className='py-20 md:py-28 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <motion.div
          ref={ref}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className='max-w-4xl mx-auto mb-16 text-center'
        >
          <motion.h2
            variants={itemVariants}
            className='text-3xl md:text-4xl font-bold mb-6'
          >
            About <span className='text-gradient'>Me</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className='text-lg text-muted-foreground mb-8'
          >
            I&apos;m a Full Stack Developer passionate about building modern,
            high-performance web applications that solve real business problems.
            With expertise in React/Next.js and AWS infrastructure, I focus on
            creating scalable solutions with exceptional user experiences.
          </motion.p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          {/* Image with decorative elements */}
          <motion.div
            className='relative rounded-lg overflow-hidden shadow-xl aspect-[4/3]'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-0'></div>

            <div className='w-full h-full bg-neutral-900 relative z-10 flex items-center justify-center'>
              {/* This would be your profile photo */}
              <div className='text-xl text-center p-8 text-white'>
                [Your profile photo will go here]
                <br />
                <span className='text-sm opacity-70'>
                  (Upload a professional photo for best results)
                </span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute -top-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-xl'></div>
            <div className='absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/30 rounded-full blur-xl'></div>

            {/* Code-like decorative overlay */}
            <div className='absolute inset-0 bg-grid-pattern opacity-20 mix-blend-overlay'></div>
          </motion.div>

          {/* Skills grid */}
          <motion.div
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            variants={containerVariants}
            className='grid grid-cols-1 sm:grid-cols-2 gap-6'
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='p-6 rounded-lg bg-background shadow-md border border-gray-200 card-hover'
              >
                <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                  <skill.icon className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>{skill.title}</h3>
                <p className='text-muted-foreground'>{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
