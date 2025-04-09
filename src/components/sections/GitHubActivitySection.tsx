'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiActivity, FiAlertCircle } from 'react-icons/fi'
import { SectionTitle } from '../ui/SectionTitle'
import useGitHubActivity, {
  formatEvent,
  getRepoInfo,
} from '../../hooks/useGitHubActivity'
import { getEventIcon } from '../../utils/githubEventIcons'

export default function GitHubActivitySection() {
  const { data, isLoading, isError, error, isFetching } = useGitHubActivity()

  return (
    <motion.section
      id='github-activity'
      className='relative py-20 md:py-28 overflow-hidden'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90'></div>

        <motion.div
          className='absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[120px] animate-blob'
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.18, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>
        <div className='absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[100px] animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/15 rounded-full blur-[130px] animate-blob animation-delay-4000'></div>

        <div
          className='absolute inset-0 opacity-30 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        ></div>
      </div>

      <div className='container mx-auto px-4 relative z-20'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-border/30 to-transparent'></div>

        <SectionTitle
          eyebrow='GitHub Activity'
          title='Recent Contributions'
          description='A live look at my public GitHub activity and open-source contributions.'
        />

        <motion.div
          className='max-w-3xl mx-auto bg-card/30 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 relative p-6 md:p-8'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            y: -2,
          }}
        >
          {/* Card glow effect */}
          <div className='absolute -inset-1 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-xl'></div>

          {isLoading && (
            <div className='flex justify-center items-center p-8'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <FiActivity className='h-8 w-8 text-primary' />
              </motion.div>
              <span className='ml-4 text-muted-foreground'>
                Loading activity...
              </span>
            </div>
          )}

          {isError && (
            <div className='flex justify-center items-center p-8 text-error bg-error/10 rounded-lg'>
              <FiAlertCircle className='h-8 w-8 mr-4' />
              <span>
                Error loading activity: {error?.message || 'Unknown error'}
              </span>
            </div>
          )}

          {!isLoading && !isError && data && (
            <ul className='space-y-4'>
              {data.length === 0 && (
                <li className='text-center text-muted-foreground'>
                  No recent public activity found.
                </li>
              )}
              {data.map((event, index) => {
                const { owner } = getRepoInfo(event.repo)
                return (
                  <motion.li
                    key={event.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className='flex items-center space-x-4 pb-4 border-b border-border/30 last:border-b-0 relative p-2 rounded-lg group'
                    whileHover={{
                      x: 3,
                      backgroundColor: 'rgba(var(--card-rgb), 0.5)',
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* Subtle highlight effect on row hover */}
                    <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none'></div>

                    <div className='relative w-16 h-16 rounded-xl bg-card/80 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:shadow-md transition-shadow duration-300'>
                      {/* Repository logo/avatar */}
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5'></div>
                      <Image
                        src={`https://github.com/${owner}.png`}
                        alt={owner}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover opacity-90 absolute inset-0'
                        onError={(e) => {
                          // If owner image fails, hide it
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>

                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm group-hover:bg-primary/15 transition-colors duration-300'>
                      {getEventIcon(event.type)}
                    </div>

                    <div className='flex-1'>
                      <p className='text-sm text-foreground/90 transition-colors duration-300 group-hover:text-foreground'>
                        {formatEvent(event)}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1 transition-colors duration-300 group-hover:text-muted-foreground/80'>
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          )}

          {isFetching && !isLoading && (
            <motion.div
              className='absolute top-4 right-4'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className='flex items-center text-xs text-muted-foreground'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className='w-3 h-3 mr-2'
                >
                  <FiActivity className='w-full h-full' />
                </motion.div>
                <span className='animate-pulse'>Syncing...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/5 to-transparent'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-border/30 to-transparent'></div>
    </motion.section>
  )
}
