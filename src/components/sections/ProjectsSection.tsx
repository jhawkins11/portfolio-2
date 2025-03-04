'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiExternalLink, FiGithub, FiFolder } from 'react-icons/fi'

const projects = [
  {
    title: 'Doc Genie',
    description:
      'AI-Powered Document Tree Builder with React, Next.js, TypeScript, MongoDB and OpenAI GPT-4 API integration.',
    tags: ['React', 'Next.js', 'TypeScript', 'MongoDB', 'AI'],
    links: {
      live: '#',
      github: '#',
    },
    highlights: [
      'Reactive editor for co-authoring in-depth document trees using AI with React/Next.js',
      'Leverages NoSQL schemas and MongoDB for persisting docs',
      'Utilizes OpenAI GPT-4 to automate drafting and revisions with one-click content expansion',
      'Integrated authentication using Firebase Auth',
    ],
  },
  // You can add more projects here
]

export default function ProjectsSection() {
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
    <section id='projects' className='py-20 md:py-28 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className='max-w-4xl mx-auto mb-16 text-center'
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Featured <span className='text-gradient'>Projects</span>
          </h2>

          <p className='text-lg text-muted-foreground'>
            Showcasing my best work and technical capabilities.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='relative group'
            >
              <div
                className='bg-background border border-gray-200 rounded-lg p-6 h-full flex flex-col transition-all duration-300
                               shadow-md hover:shadow-xl group-hover:-translate-y-2 overflow-hidden'
              >
                {/* Top header */}
                <div className='flex justify-between items-center mb-6'>
                  <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <FiFolder className='w-6 h-6 text-primary' />
                  </div>

                  <div className='flex space-x-4'>
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-muted-foreground hover:text-primary transition-colors'
                        aria-label='View GitHub repository'
                      >
                        <FiGithub className='w-5 h-5' />
                      </a>
                    )}

                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-muted-foreground hover:text-primary transition-colors'
                        aria-label='View live site'
                      >
                        <FiExternalLink className='w-5 h-5' />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className='text-xl font-semibold mb-2'>{project.title}</h3>
                <p className='text-muted-foreground mb-4 flex-grow'>
                  {project.description}
                </p>

                {/* Highlights */}
                <div className='mb-4'>
                  <h4 className='text-sm font-semibold mb-2 text-primary'>
                    Key Features:
                  </h4>
                  <ul className='space-y-1 text-sm'>
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className='flex items-start'>
                        <span className='text-primary mr-2'>›</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-2 mt-auto'>
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className='text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground'
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Decorative gradient */}
                <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left'></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add a "View More" button if you have more projects */}
        {projects.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className='flex justify-center mt-12'
          >
            <a
              href='/projects'
              className='btn bg-transparent border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-medium transition-all'
            >
              View all projects
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
