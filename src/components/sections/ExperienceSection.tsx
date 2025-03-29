'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiTrendingUp,
  FiCode,
  FiAward,
} from 'react-icons/fi'
import { SectionTitle } from '../ui/SectionTitle'

const experiences = [
  {
    title: 'Full Stack Developer',
    company: 'DLD-VIP',
    location: 'Peoria Heights, IL',
    period: '04/2022 – Present',
    metrics: [
      { icon: FiTrendingUp, value: '173%', label: 'SEO Increase' },
      { icon: FiCode, value: '30%', label: 'Code Reduction' },
      { icon: FiAward, value: '$11K', label: 'Cost Savings' },
    ],
    description: [
      {
        highlight: 'Real-time Dashboards',
        text: 'Designed and built real-time React/Material UI dashboards to monitor 675K product orders, implementing advanced filtering/exporting features to enhance data visibility and user experience.',
        impact: 'Enhanced operational visibility across 675K+ orders',
        highlightPhrase: '675K product orders',
      },
      {
        highlight: 'Performance Optimization',
        text: 'Reduced load times by 1.5s (per Lighthouse) by serving S3 images via Cloudfront CDN with auto compression and Next.js caching.',
        impact: '1.5s faster load times',
        highlightPhrase: 'Reduced load times by 1.5s',
      },
      {
        highlight: 'SEO Enhancement',
        text: 'Achieved a 173% increase in organic keywords validated by SEMrush by implementing programmatic SEO with Next.js Server-Side Rendering (SSR), dynamic routing, and semantic HTML5 optimization.',
        impact: '173% more organic keywords',
        highlightPhrase: '173% increase in organic keywords',
      },
      {
        highlight: 'Scalability Improvements',
        text: 'Prevented backend latency during traffic spikes (up to 2,300 req/min) by optimizing auto-scaling triggers on Elastic Beanstalk based on EC2 CPU utilization. Reduced median response times by 79%.',
        impact: '79% faster response times',
        highlightPhrase: 'Reduced median response times by 79%',
      },
      {
        highlight: 'Cost Optimization',
        text: 'Saved $11K yearly migrating video processing to serverless AWS Lambda and Elastic Transcoder.',
        impact: '$11K annual savings',
        highlightPhrase: 'Saved $11K yearly',
      },
      {
        highlight: 'Code Quality',
        text: 'Elevated code robustness and streamlined database interactions by incorporating TypeScript and Sequelize ORM. Reduced duplicate code by 30% by developing a modular Express.js controller framework.',
        impact: '30% reduction in duplicate code',
        highlightPhrase: 'Reduced duplicate code by 30%',
      },
      {
        highlight: 'CI/CD Improvement',
        text: 'Accelerated production releases by 30 min through a streamlined CI/CD framework using AWS CodePipeline and Jest.',
        impact: '30 min faster deployments',
        highlightPhrase: 'Accelerated production releases by 30 min',
      },
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Smiley Graphix',
    location: 'Peoria, IL',
    period: '09/2021 - 04/2022',
    metrics: [
      { icon: FiTrendingUp, value: '1000+', label: 'Daily Users' },
      { icon: FiCode, value: '30%', label: 'Faster API Responses' },
      { icon: FiAward, value: '30K+', label: 'Monthly Transactions' },
    ],
    description: [
      {
        highlight: 'Webinar Platform',
        text: 'Engineered webinar streaming platform with JavaScript, React, AWS Chime, and Tailwind CSS serving 1000+ daily users; enabled integrated audio/video preview and chat.',
        impact: 'Served 1000+ daily users',
        highlightPhrase: 'serving 1000+ daily users',
      },
      {
        highlight: 'Performance Boost',
        text: 'Cut Express.js response times by 30% with Redis caching on AWS ElastiCache.',
        impact: '30% faster API responses',
        highlightPhrase: 'Cut Express.js response times by 30%',
      },
      {
        highlight: 'Payment Processing',
        text: 'Developed PCI-compliant payments system handling 30K+ secure transactions per month.',
        impact: '30K+ secure monthly transactions',
        highlightPhrase: '30K+ secure transactions per month',
      },
      {
        highlight: 'Agile Development',
        text: 'Quickly iterated user-tested features utilizing Jira agile management with CI/CD enabled by Github.',
        impact: 'Rapid feature deployment',
        highlightPhrase: 'Quickly iterated user-tested features',
      },
    ],
  },
]

export default function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(timelineRef, { once: true, margin: '-100px 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  })

  const timelineProgress = useTransform(
    scrollYProgress,
    [0.25, 0.9],
    ['0%', '100%']
  )

  return (
    <section
      id='experience'
      className='relative py-20 md:py-28 overflow-hidden'
      ref={sectionRef}
    >
      {/* Enhanced atmospheric background effects */}
      <div className='absolute inset-0'>
        {/* Primary gradient background */}
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90'></div>

        {/* Animated blobs with stronger presence */}
        <div className='absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[120px] animate-blob'></div>
        <div className='absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[100px] animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/15 rounded-full blur-[130px] animate-blob animation-delay-4000'></div>

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
        {/* Subtle section divider */}
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-border/30 to-transparent'></div>

        <SectionTitle
          eyebrow='Professional Experience'
          title='Work Experience'
          description='My professional journey building impactful digital solutions that drive results.'
        />

        <div ref={timelineRef} className='max-w-[1400px] mx-auto relative'>
          {/* Timeline line with enhanced gradient effect - positioned on the left */}
          <div className='absolute left-0 sm:left-[80px] md:left-[120px] lg:left-[160px] top-0 bottom-0 w-[3px]'>
            <div className='absolute inset-0 bg-gradient-to-b from-border/5 via-border/20 to-border/5 rounded-full'></div>
            <div
              className='absolute inset-0 bg-[length:100%_8px] bg-repeat-y opacity-20 rounded-full'
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, var(--border) 50%, transparent 50%)',
              }}
            ></div>
          </div>

          <motion.div
            className='absolute left-0 sm:left-[80px] md:left-[120px] lg:left-[160px] top-0 w-[3px] bg-gradient-to-b from-primary/30 via-primary/80 to-primary/30 origin-top rounded-full'
            style={{ height: timelineProgress }}
          />

          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className='mb-24 relative'
            >
              {/* Timeline node with enhanced pulse effect - positioned on the left */}
              <div className='absolute left-[-9px] sm:left-[71px] md:left-[111px] lg:left-[151px] top-12 z-10'>
                {/* Outer pulse effect */}
                <motion.div
                  className='w-[36px] h-[36px] rounded-full bg-primary/10 backdrop-blur-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  initial={{ scale: 1, opacity: 0.2 }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.1, 0.2] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Middle pulse effect */}
                <motion.div
                  className='w-[26px] h-[26px] rounded-full bg-primary/20 backdrop-blur-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.15, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
                {/* Core node */}
                <div className='w-[20px] h-[20px] rounded-full bg-gradient-to-tr from-primary to-primary/90 shadow-lg shadow-primary/25 relative'></div>
              </div>

              {/* Content container - shifted right of timeline */}
              <div className='ml-8 sm:ml-[120px] md:ml-[180px] lg:ml-[240px]'>
                {/* Experience header - Left aligned */}
                <div className='mb-5'>
                  {/* Date badge floating to the right */}
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/90'>
                      {experience.title}
                    </h3>

                    <motion.div
                      className='inline-flex items-center h-10 py-1 px-5 rounded-full bg-primary/[0.08] border border-primary/20 text-primary font-medium backdrop-blur-sm shadow-md shadow-primary/5'
                      whileHover={{
                        y: -2,
                        backgroundColor: 'rgba(var(--primary-rgb), 0.15)',
                        boxShadow:
                          '0 8px 20px -6px rgba(var(--primary-rgb), 0.25)',
                      }}
                    >
                      <FiCalendar className='w-4 h-4 mr-2 text-primary/90' />
                      {experience.period}
                    </motion.div>
                  </div>

                  <div className='flex items-center mb-1'>
                    <div className='w-10 h-10 rounded-xl bg-primary/[0.08] flex items-center justify-center mr-3 shadow-inner shadow-primary/5 backdrop-blur-sm border border-primary/10'>
                      <FiBriefcase className='text-primary w-5 h-5' />
                    </div>
                    <div>
                      <p className='text-lg font-medium text-primary/90'>
                        {experience.company}
                      </p>
                      <div className='flex items-center text-sm text-muted-foreground/90'>
                        <FiMapPin className='mr-1.5 w-3.5 h-3.5' />
                        {experience.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Card */}
                <motion.div
                  className='bg-card/30 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 relative group'
                  whileHover={{
                    y: -5,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {/* Background glow effect */}
                  <div className='absolute -inset-1 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-xl'></div>

                  {/* Key Metrics banner */}
                  <div className='grid grid-cols-3 bg-card/40 border-b border-border/30'>
                    {experience.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className='relative overflow-hidden group/metric transition-all duration-300 p-4 flex flex-col items-center justify-center border-r last:border-r-0 border-border/20 hover:bg-primary/[0.08]'
                      >
                        {/* Subtle shimmer effect on hover */}
                        <div className='absolute inset-0 -translate-x-full group-hover/metric:translate-x-full transition-all duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12'></div>

                        <metric.icon className='w-5 h-5 mb-2 text-primary/90' />
                        <div className='text-lg md:text-xl font-bold text-primary mb-0.5'>
                          {metric.value}
                        </div>
                        <div className='text-[11px] md:text-xs text-muted-foreground/75 font-medium'>
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Achievement Cards */}
                  <div className='p-6 grid md:grid-cols-2 gap-4'>
                    {experience.description.map((item, i) => {
                      // Simple function to highlight the specified phrase in the text
                      const highlightSpecificPhrase = () => {
                        if (!item.highlightPhrase) return item.text

                        // Create safe regex by escaping special characters
                        const safePhrase = item.highlightPhrase.replace(
                          /[-[\]{}()*+?.,\\^$|#\s]/g,
                          '\\$&'
                        )
                        const phraseRegex = new RegExp(`(${safePhrase})`, 'i')

                        // Split the text by the phrase
                        const parts = item.text.split(phraseRegex)

                        // If no match found, return the text as is
                        if (parts.length === 1) return item.text

                        // Map parts, highlighting the matched phrase
                        return parts.map((part, index) => {
                          if (index % 2 === 1) {
                            // This is the matching part
                            return (
                              <span
                                key={index}
                                className='relative inline-block text-primary font-medium group-hover/achievement:text-primary transition-all duration-300'
                                style={{ isolation: 'isolate' }}
                              >
                                <span className='relative z-10'>{part}</span>
                                <span className='absolute inset-0 bg-primary/5 rounded opacity-0 group-hover/achievement:opacity-100 transition-opacity duration-300 -z-10'></span>
                                <span className='absolute inset-x-0 -bottom-[1px] h-[1px] bg-gradient-to-r from-primary/40 via-primary/80 to-primary/40 transform scale-x-0 group-hover/achievement:scale-x-100 transition-transform duration-300 origin-left'></span>
                              </span>
                            )
                          }
                          return part
                        })
                      }

                      return (
                        <div
                          key={i}
                          className='border border-border/30 rounded-xl p-4 transition-all duration-500 bg-card/20 backdrop-blur-sm group/achievement h-full relative overflow-hidden will-change-transform hover:border-border/10 hover:-translate-y-[2px]'
                        >
                          {/* Premium subtle hover effect */}
                          <div className='absolute inset-0 opacity-0 group-hover/achievement:opacity-100 transition-all duration-400'>
                            {/* Top gradient border effect */}
                            <div className='absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent transform origin-left scale-x-0 group-hover/achievement:scale-x-100 transition-transform duration-500'></div>

                            {/* Subtle luminance effect */}
                            <div className='absolute -inset-4 bg-primary/5 blur-3xl opacity-0 group-hover/achievement:opacity-100 transition-opacity duration-1000'></div>

                            {/* Inner shadow highlight */}
                            <div className='absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.03)] opacity-0 group-hover/achievement:opacity-100 transition-opacity duration-500'></div>
                          </div>

                          {/* Content with refined animation */}
                          <div className='relative z-1 h-full transition-all duration-300 ease-out group-hover/achievement:scale-[1.01] origin-bottom-left'>
                            <h4 className='font-semibold text-foreground/90 group-hover/achievement:text-foreground text-sm md:text-base transition-colors duration-300 mb-3'>
                              {item.highlight}
                            </h4>

                            <p className='text-muted-foreground/90 text-xs md:text-sm leading-relaxed group-hover/achievement:text-muted-foreground group-hover/achievement:opacity-95 transition-all duration-500'>
                              {highlightSpecificPhrase()}
                            </p>
                          </div>

                          {/* Premium hover state enhancement */}
                          <div className='absolute inset-0 rounded-xl shadow-lg shadow-primary/5 opacity-0 group-hover/achievement:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle decorative elements at the bottom of the section */}
      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/5 to-transparent'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-border/30 to-transparent'></div>
    </section>
  )
}
