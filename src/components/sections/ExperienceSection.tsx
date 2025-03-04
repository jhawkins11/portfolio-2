'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FiBriefcase,
  FiChevronRight,
  FiCalendar,
  FiMapPin,
} from 'react-icons/fi'

const experiences = [
  {
    title: 'Full Stack Developer',
    company: 'DLD-VIP',
    location: 'Peoria Heights, IL',
    period: '04/2022 – Present',
    description: [
      'Designed and built real-time React/Material UI dashboards to monitor 675K product orders, implementing advanced filtering/exporting features to enhance data visibility and user experience.',
      'Reduced load times (LCP) by 1.5s (per Lighthouse) by serving S3 images via Cloudfront CDN with auto compression and Next.js caching.',
      'Achieved a 173% increase in organic keywords validated by SEMrush by implementing programmatic SEO with Next.js Server-Side Rendering (SSR), dynamic routing, and semantic HTML5 optimization.',
      'Prevented backend latency during traffic spikes (up to 2,300 req/min) by optimizing auto-scaling triggers on Elastic Beanstalk based on EC2 CPU utilization. Reduced median response times by 79%.',
      'Saved $11K yearly migrating video processing to serverless AWS Lambda and Elastic Transcoder.',
      'Elevated code robustness and streamlined database interactions by incorporating TypeScript and Sequelize ORM. Reduced duplicate code by 30% by developing a modular Express.js controller framework.',
      'Accelerated production releases by 30 min through a streamlined CI/CD framework using AWS CodePipeline and Jest.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Smiley Graphix',
    location: 'Peoria, IL',
    period: '09/2021 - 04/2022',
    description: [
      'Engineered webinar streaming platform with JavaScript, React, AWS Chime, and Tailwind CSS serving 1000+ daily users; enabled integrated audio/video preview and chat.',
      'Cut Express.js response times by 30% with Redis caching on AWS ElastiCache.',
      'Developed PCI-compliant payments system handling 30K+ secure transactions per month.',
      'Quickly iterated user-tested features utilizing Jira agile management with CI/CD enabled by Github.',
    ],
  },
]

export default function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })

  return (
    <section id='experience' className='py-20 md:py-28'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className='max-w-4xl mx-auto mb-16 text-center'
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Work <span className='text-gradient'>Experience</span>
          </h2>

          <p className='text-lg text-muted-foreground'>
            My professional journey building impactful digital solutions.
          </p>
        </motion.div>

        <div ref={ref} className='max-w-4xl mx-auto relative'>
          {/* Timeline line */}
          <div className='absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-border'></div>

          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row md:items-center mb-12 relative ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className='absolute left-0 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary z-10'></div>

              {/* Content box */}
              <div
                className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}
              >
                <div className='bg-background border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow glass-card'>
                  <div className='flex items-center mb-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4'>
                      <FiBriefcase className='text-primary w-5 h-5' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold'>
                        {experience.title}
                      </h3>
                      <p className='text-muted-foreground'>
                        {experience.company}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground'>
                    <div className='flex items-center'>
                      <FiCalendar className='mr-1 w-4 h-4' />
                      {experience.period}
                    </div>
                    <div className='flex items-center'>
                      <FiMapPin className='mr-1 w-4 h-4' />
                      {experience.location}
                    </div>
                  </div>

                  <ul className='space-y-2'>
                    {experience.description.map((item, i) => (
                      <li key={i} className='flex'>
                        <FiChevronRight className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                        <span className='ml-2'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
