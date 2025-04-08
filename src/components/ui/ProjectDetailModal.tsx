'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  FiX,
  FiGithub,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useEffect, useState } from 'react'
type Project = {
  id: string
  title: string
  description: string
  images: string[]
  imageObjectFit?: string
  tags: { name: string; icon: IconType }[]
  links: { live?: string; github?: string }
  highlights: { text: string; icon: IconType }[]
  longDescription?: string
  techStackDetails?: { name: string; icon: IconType; description?: string }[]
  challenges?: string[]
  solutions?: string[]
  outcomes?: string[]
}

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    )
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <motion.div
      onClick={onClose}
      className='fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className='bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-xl'
        layoutId={`card-container-${project.id}`}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 0.5,
        }}
      >
        <motion.button
          onClick={onClose}
          className='absolute top-4 right-4 w-10 h-10 bg-background/80 hover:bg-muted rounded-full flex items-center justify-center z-10 text-foreground shadow-md'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <FiX className='w-5 h-5' />
        </motion.button>

        <motion.div
          className='relative w-full rounded-t-lg overflow-hidden aspect-video'
          layoutId={`card-image-${project.id}`}
        >
          <div className='w-full h-full bg-gray-800'>
            <Image
              src={
                project.images && project.images.length > 0
                  ? project.images[currentImageIndex]
                  : ''
              }
              alt={`${project.title} preview ${currentImageIndex + 1}`}
              fill
              priority
              className={project.imageObjectFit || 'object-contain'}
            />
          </div>

          {project.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/60 hover:bg-background/80 rounded-full flex items-center justify-center text-foreground z-10 transition-all'
                aria-label='Previous image'
              >
                <FiChevronLeft className='w-5 h-5' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/60 hover:bg-background/80 rounded-full flex items-center justify-center text-foreground z-10 transition-all'
                aria-label='Next image'
              >
                <FiChevronRight className='w-5 h-5' />
              </button>

              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10'>
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentImageIndex === index
                        ? 'bg-primary scale-110'
                        : 'bg-background/60 hover:bg-background/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <motion.div
            className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent pointer-events-none'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        </motion.div>

        <motion.div className='p-8' layoutId={`card-content-${project.id}`}>
          <motion.h2
            className='text-3xl font-bold mb-3'
            layoutId={`card-title-${project.id}`}
          >
            {project.title}
          </motion.h2>

          <motion.div
            className='flex space-x-4 mb-6 text-muted-foreground'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            {project.links.github && (
              <a
                href={project.links.github}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary flex items-center gap-2 transition-colors'
              >
                <FiGithub className='w-5 h-5' /> GitHub
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary flex items-center gap-2 transition-colors'
              >
                <FiExternalLink className='w-5 h-5' /> Live Site
              </a>
            )}
          </motion.div>

          <motion.p
            className='text-muted-foreground mb-8 leading-relaxed'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {project.longDescription || project.description}
          </motion.p>

          {project.techStackDetails && project.techStackDetails.length > 0 && (
            <motion.div
              className='mb-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <h3 className='text-xl font-semibold mb-4 text-foreground'>
                Tech Stack
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {project.techStackDetails.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className='flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors'
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.25 }}
                  >
                    <div className='mt-1 text-primary'>
                      <tech.icon className='w-5 h-5' />
                    </div>
                    <div>
                      <h4 className='font-medium text-foreground'>
                        {tech.name}
                      </h4>
                      {tech.description && (
                        <p className='text-sm text-muted-foreground mt-1'>
                          {tech.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            className='mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <h3 className='text-xl font-semibold mb-4 text-foreground'>
              Key Features
            </h3>
            <ul className='space-y-3'>
              {project.highlights.map((highlight, index) => (
                <motion.li
                  key={index}
                  className='flex items-start gap-3 text-muted-foreground'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.25 }}
                >
                  <span className='text-primary mt-1 flex-shrink-0'>
                    <highlight.icon className='w-5 h-5' />
                  </span>
                  <span>{highlight.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {project.challenges && project.solutions && (
            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <div>
                <h3 className='text-xl font-semibold mb-4 text-foreground'>
                  Challenges
                </h3>
                <ul className='space-y-2 list-disc list-inside text-muted-foreground'>
                  {project.challenges.map((challenge, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.05, duration: 0.2 }}
                    >
                      {challenge}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 text-foreground'>
                  Solutions
                </h3>
                <ul className='space-y-2 list-disc list-inside text-muted-foreground'>
                  {project.solutions.map((solution, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.2 }}
                    >
                      {solution}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {project.outcomes && (
            <motion.div
              className='mb-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <h3 className='text-xl font-semibold mb-4 text-foreground'>
                Outcomes
              </h3>
              <motion.div
                className='bg-muted/30 p-4 rounded-lg'
                whileHover={{
                  backgroundColor: 'rgba(var(--muted), 0.4)',
                  transition: { duration: 0.2 },
                }}
              >
                <ul className='space-y-2 list-disc list-inside text-muted-foreground'>
                  {project.outcomes.map((outcome, i) => (
                    <motion.li
                      key={i}
                      className='font-medium'
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.05, duration: 0.2 }}
                    >
                      {outcome}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}

          <motion.div
            className='pt-4 border-t border-border'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <div className='flex flex-wrap gap-2'>
              {project.tags.map((tag, i) => (
                <motion.span
                  key={i}
                  className='text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground flex items-center gap-1.5 hover:bg-muted/80 transition-colors'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.05, duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <tag.icon className='w-3.5 h-3.5' />
                  {tag.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
