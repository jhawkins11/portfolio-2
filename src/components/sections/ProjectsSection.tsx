'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiExternalLink, FiFolder, FiGithub } from 'react-icons/fi'
import { SectionTitle } from '../ui/SectionTitle'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiMongodb,
  SiOpenai,
} from 'react-icons/si'
import { IconType } from 'react-icons'

const ProjectDetailModal = dynamic(() => import('../ui/ProjectDetailModal'), {
  ssr: false,
})

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

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzMzMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1NTUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+UHJvamVjdCBJbWFnZTwvdGV4dD48L3N2Zz4='

const projects: Project[] = [
  {
    id: 'doc-genie',
    title: 'Doc Genie',
    description:
      'An AI-powered document tree builder that enables collaborative authoring and leverages OpenAI GPT-4 for automated drafting and revisions.',
    images: [
      'https://github.com/jhawkins11/doc-genie/raw/main/public/screenshot-1.png',
      'https://github.com/jhawkins11/doc-genie/raw/main/public/screenshot-2.png',
    ],
    imageObjectFit: 'object-contain',
    tags: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'OpenAI', icon: SiOpenai },
    ],
    links: {
      live: 'https://doc-genie-6b615.web.app/',
      github: 'https://github.com/jhawkins11/doc-genie',
    },
    highlights: [
      {
        text: 'One-click content expansion with AI assistance',
        icon: SiOpenai,
      },
      {
        text: 'Co-authoring with real-time collaboration',
        icon: SiReact,
      },
      {
        text: 'Secure authentication with Firebase Auth',
        icon: SiNextdotjs,
      },
    ],
    longDescription:
      'Doc Genie is an innovative document management system that leverages AI to help teams collaborate on complex document structures. The application addresses the challenge of maintaining large, hierarchical documentation by providing an intuitive visual interface and powerful AI assistance. Users can quickly expand document sections with one-click AI-powered content generation, while maintaining full editorial control over the final output.',
    techStackDetails: [
      {
        name: 'React',
        icon: SiReact,
        description:
          'Frontend UI development with robust component architecture',
      },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        description: 'Server-side rendering and API routes',
      },
      {
        name: 'TypeScript',
        icon: SiTypescript,
        description: 'Type safety and enhanced developer experience',
      },
      {
        name: 'MongoDB',
        icon: SiMongodb,
        description: 'Document database for flexible schema design',
      },
      {
        name: 'OpenAI',
        icon: SiOpenai,
        description: 'AI integration for content generation using GPT-4',
      },
      {
        name: 'Firebase',
        icon: SiReact,
        description: 'Authentication and real-time database',
      },
      {
        name: 'Material UI',
        icon: SiReact,
        description: 'React component library for UI design',
      },
      {
        name: 'Redux Toolkit',
        icon: SiReact,
        description: 'State management for complex application state',
      },
      {
        name: 'Tailwind CSS',
        icon: SiReact,
        description: 'Utility-first CSS framework for styling',
      },
    ],
    challenges: [
      'Creating an intuitive UI for complex document hierarchies',
      'Ensuring reliable AI-generated content while maintaining user control',
      'Implementing real-time collaboration without conflicts',
      'Designing a flexible document tree structure that can accommodate various content types',
    ],
    solutions: [
      'Developed a drag-and-drop interface with visual node connections',
      'Implemented a review and edit system for AI suggestions',
      'Used optimistic UI updates with conflict resolution',
      'Created a modular document schema in MongoDB for maximum flexibility',
    ],
    outcomes: [
      'Streamlined documentation process',
      'Enhanced content quality through AI assistance',
      'Improved team collaboration efficiency',
      'Significant reduction in document creation time',
    ],
  },
  {
    id: 'stocks-dashboard',
    title: 'Stocks Dashboard',
    description:
      'A full-stack real-time stock data dashboard built with Next.js and Express. Features WebSocket integration for live updates and a clean, modern UI using shadcn/ui components.',
    images: [
      'https://github.com/jhawkins11/stocks-dashboard/raw/main/StocksDash.png',
      'https://github.com/jhawkins11/stocks-dashboard/raw/main/StocksDash.png',
    ],
    imageObjectFit: 'object-contain',
    tags: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'WebSocket', icon: SiTypescript },
      { name: 'MySQL', icon: SiMongodb },
    ],
    links: {
      live: 'https://stocks-dashboard-pi.vercel.app',
      github: 'https://github.com/jhawkins11/stocks-dashboard',
    },
    highlights: [
      {
        text: 'Real-time stock data updates via WebSocket',
        icon: SiReact,
      },
      {
        text: 'Interactive stock watchlist management',
        icon: SiTypescript,
      },
      {
        text: 'Clean and modern UI with shadcn/ui components',
        icon: SiNextdotjs,
      },
    ],
    longDescription:
      'A full-stack real-time stock data dashboard that provides users with up-to-date market information. Built using Next.js and Express, the application leverages WebSocket technology for efficient real-time updates without compromising performance. The clean and intuitive user interface is implemented using shadcn/ui components, providing a modern look and feel.',
    techStackDetails: [
      {
        name: 'React',
        icon: SiReact,
        description: 'Frontend UI development with modern React patterns',
      },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        description: 'Server-side rendering and API optimization',
      },
      {
        name: 'TypeScript',
        icon: SiTypescript,
        description: 'Type-safe development environment',
      },
      {
        name: 'WebSocket',
        icon: SiTypescript,
        description: 'Real-time data communication',
      },
      {
        name: 'MySQL',
        icon: SiMongodb,
        description: 'Relational database for data storage',
      },
      {
        name: 'shadcn/ui',
        icon: SiReact,
        description: 'Modern UI component library',
      },
      {
        name: 'Express',
        icon: SiNextdotjs,
        description: 'Backend server framework',
      },
      {
        name: 'Tailwind CSS',
        icon: SiReact,
        description: 'Utility-first CSS framework',
      },
    ],
    challenges: [
      'Implementing real-time data updates without compromising performance',
      'Creating responsive and interactive watchlist management',
      'Building a clean and intuitive user interface',
      'Ensuring data consistency across multiple clients',
    ],
    solutions: [
      'Used WebSocket for efficient real-time updates',
      'Implemented optimized state management for watchlist tracking',
      'Leveraged shadcn/ui for a consistent and modern design',
      'Developed a robust backend architecture with MySQL database',
    ],
    outcomes: [
      'Smooth and responsive user experience',
      'Real-time stock data updates',
      'Intuitive watchlist management',
      'Scalable architecture for future feature expansion',
    ],
  },

  {
    id: 'visual-reader',
    title: 'VisualReader',
    description:
      'A React Native mobile app that enhances the reading experience by generating AI-powered visual representations of book scenes in real-time. Built with Expo for cross-platform compatibility.',
    images: [
      '/images/VisualReader3.PNG',
      '/images/VisualReader2.PNG',
      '/images/VisualReader1.PNG',
    ],
    imageObjectFit: 'object-contain',
    tags: [
      { name: 'React Native', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Expo', icon: SiReact },
      { name: 'OpenAI', icon: SiOpenai },
      { name: 'Node.js', icon: SiNextdotjs },
    ],
    links: {
      github: 'https://github.com/jhawkins11/VisualReader',
    },
    highlights: [
      {
        text: 'Real-time visual generation of book scenes',
        icon: SiOpenai,
      },
      {
        text: 'Character description extraction and visualization',
        icon: SiReact,
      },
      {
        text: 'Seamless toggle between text and generated images',
        icon: SiTypescript,
      },
    ],
    longDescription:
      "VisualReader is a React Native mobile app that enhances the reading experience by generating AI-powered visual representations of book scenes in real-time. The app uses natural language processing to extract scene descriptions from ebooks and creates visual interpretations through OpenAI's image generation API. Users can seamlessly toggle between reading text and viewing generated visuals, creating a more immersive reading experience.",
    techStackDetails: [
      {
        name: 'React Native',
        icon: SiReact,
        description: 'Cross-platform mobile development framework',
      },
      {
        name: 'Expo',
        icon: SiReact,
        description: 'Framework and platform for universal React applications',
      },
      {
        name: 'TypeScript',
        icon: SiTypescript,
        description: 'Type-safe development for improved code quality',
      },
      {
        name: 'OpenAI API',
        icon: SiOpenai,
        description: 'AI-powered image generation capabilities',
      },
      {
        name: 'Node.js',
        icon: SiNextdotjs,
        description: 'Backend server for processing requests',
      },
      {
        name: 'EPub.js',
        icon: SiReact,
        description: 'Javascript library for parsing and rendering EPUBs',
      },
      {
        name: 'React Navigation',
        icon: SiReact,
        description: 'Navigation library for React Native apps',
      },
      {
        name: 'Axios',
        icon: SiReact,
        description: 'Promise-based HTTP client for API requests',
      },
      {
        name: 'Express',
        icon: SiNextdotjs,
        description: 'Web application framework for the backend API',
      },
    ],
    challenges: [
      'Processing and understanding complex narrative text in real-time',
      'Generating visually accurate representations of textual descriptions',
      'Optimizing image generation and delivery for mobile devices',
      'Extracting relevant character and scene details from book content',
    ],
    solutions: [
      'Developed an optimized image generation pipeline',
      'Implemented background processing for seamless reading',
      'Used context-aware text analysis to identify key visual elements',
      'Built a caching system to improve performance for frequently viewed scenes',
    ],
    outcomes: [
      'Enhanced reading engagement through visual content',
      'Smooth and responsive user experience',
      'Efficient processing of complex text for visual interpretation',
    ],
  },
]

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      y: 25,
      opacity: 0,
      scale: 0.95,
      rotate: -1,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1], // cubic-bezier ease-out-quad
      },
    },
    hover: {
      y: -12,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const imageHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  const glowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  const borderVariants = {
    initial: { borderColor: 'rgba(255,255,255,0)' },
    hover: {
      borderColor: 'rgba(var(--primary), 0.2)',
      transition: {
        duration: 0.4,
      },
    },
  }

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
    <>
      <section id='projects' className='relative py-24 overflow-hidden'>
        {/* Background Gradient Layer */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/98'></div>

          {/* Grain texture */}
          <div
            className='absolute inset-0 opacity-25 mix-blend-soft-light'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </div>

        {/* Background Blobs */}
        <motion.div
          className='absolute inset-0 overflow-hidden'
          variants={backgroundVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className='absolute -top-[30%] -left-[30%] w-[120vw] h-[120vh] bg-primary/10 rounded-full blur-3xl animate-blob' />
          <div className='absolute -bottom-[30%] -right-[30%] w-[120vw] h-[120vh] bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000' />
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-4000' />
        </motion.div>

        <div className='container mx-auto px-4 relative z-10'>
          <SectionTitle
            eyebrow='Portfolio'
            title='Featured Projects'
            description='Showcasing my best work and technical capabilities.'
          />

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover='hover'
                initial='initial'
                className='relative group cursor-pointer'
                onClick={() => handleProjectClick(project)}
              >
                <div
                  className='bg-background border border-gray-200 rounded-lg p-6 h-full flex flex-col transition-all duration-300
                               shadow-md hover:shadow-xl group-hover:-translate-y-2 overflow-hidden'
                >
                  {/* Background Glow Effect */}
                  <motion.div
                    className='absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'
                    variants={glowVariants}
                  />

                  {/* Border Highlight */}
                  <motion.div
                    className='absolute inset-0 rounded-lg border border-transparent group-hover:border-primary/20 transition-colors duration-300'
                    variants={borderVariants}
                  />

                  {/* Inner Shadow */}
                  <div className='absolute inset-0 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] transition-shadow duration-300' />

                  {/* Content Container */}
                  <motion.div className='relative z-10 flex flex-col h-full'>
                    {/* Top header */}
                    <div className='flex justify-between items-center mb-4'>
                      <div className='bg-primary/10 rounded-lg p-2'>
                        <FiFolder className='w-5 h-5' />
                      </div>

                      <div className='flex space-x-4'>
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-muted-foreground hover:text-primary transition-colors z-20'
                            aria-label='View GitHub repository'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiGithub className='w-5 h-5' />
                          </a>
                        )}

                        {project.links.live && (
                          <a
                            href={project.links.live}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-muted-foreground hover:text-primary transition-colors z-20'
                            aria-label='View live site'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiExternalLink className='w-5 h-5' />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Project Image */}
                    <motion.div className='w-full h-48 mb-5 rounded-lg overflow-hidden relative'>
                      <motion.div
                        className={`w-full h-full relative overflow-hidden ${
                          project.id === 'stocks-dashboard' ||
                          project.id === 'doc-genie'
                            ? 'bg-black'
                            : ''
                        }`}
                        variants={imageHoverVariants}
                      >
                        <Image
                          src={project.images[0] || PLACEHOLDER_IMAGE}
                          alt={`Screenshot of ${project.title} project`}
                          className='transition-transform duration-300 object-cover'
                          priority={index === 0}
                          fill
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          placeholder='blur'
                          blurDataURL={PLACEHOLDER_IMAGE}
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-300' />

                        {/* View details overlay that appears on hover */}
                        <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <span className='px-4 py-2 bg-primary text-white rounded-md text-sm font-medium'>
                            View Details
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Content */}
                    <motion.h3 className='text-xl font-bold mb-2 text-foreground'>
                      {project.title}
                    </motion.h3>

                    <p className='text-muted-foreground mb-5 text-sm leading-relaxed'>
                      {project.description}
                    </p>

                    {/* Tags Section (moved up for card view simplicity) */}
                    <div className='flex flex-wrap gap-2 mt-auto'>
                      {project.tags.map((tag, i) => (
                        <motion.span
                          key={i}
                          className='text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground flex items-center gap-1.5'
                          whileHover={{ scale: 1.05 }}
                        >
                          <tag.icon className='w-3.5 h-3.5' />
                          {tag.name}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Decorative gradient - moved outside the content container and positioned at bottom */}
                  <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

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

      <AnimatePresence>
        <ProjectDetailModal
          key={selectedProject?.id || 'modal-closed'}
          project={selectedProject}
          onClose={handleCloseModal}
        />
      </AnimatePresence>
    </>
  )
}
