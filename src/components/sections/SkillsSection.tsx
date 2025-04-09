'use client'

import { useRef, useState } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import {
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiMysql,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiReactquery,
  SiMui,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiSequelize,
  SiMongodb,
  SiRedis,
  SiGit,
  SiJira,
  SiJest,
  SiCypress,
  SiGithubactions,
  SiCloudflare,
  SiVercel,
  SiGithub,
  SiPostgresql,
} from 'react-icons/si'
import { FaAws, FaCode, FaServer, FaCloud, FaTools } from 'react-icons/fa'
import { SectionTitle } from '../ui/SectionTitle'
import { IconType } from 'react-icons'

// Interface for skill items
interface SkillItem {
  name: string
  icon: IconType
  color: string
}

// SkillCard component for reusable skill cards with consistent hover effects
const SkillCard = ({
  skill,
  hoveredSkill,
  setHoveredSkill,
  custom,
  variants,
  ringColor,
}: {
  skill: SkillItem
  hoveredSkill: string | null
  setHoveredSkill: (name: string | null) => void
  custom: number
  variants: Variants
  ringColor: string
}) => {
  return (
    <motion.div
      key={skill.name}
      custom={custom}
      variants={variants}
      initial='initial'
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      onHoverStart={() => setHoveredSkill(skill.name)}
      onHoverEnd={() => setHoveredSkill(null)}
      className='bg-card/40 backdrop-blur-md border border-border/30 rounded-xl p-5 flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden group hover:border-border/10 hover:shadow-xl'
    >
      {/* Background effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

      {/* Top gradient border effect */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${ringColor} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
      ></div>

      {/* Subtle luminance effect */}
      <div className='absolute -inset-4 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000'></div>

      {/* Inner shadow highlight */}
      <div className='absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

      {/* Icon with glow */}
      <div className='relative h-14 flex items-center justify-center mb-3 z-10 transition-transform duration-300 transform group-hover:scale-[1.05]'>
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        ></div>
        <div
          className={`p-3 relative ${
            hoveredSkill === skill.name ? 'scale-110' : 'scale-100'
          } transition-transform duration-300`}
        >
          <skill.icon className={`w-8 h-8 ${skill.color}`} />
        </div>
      </div>

      {/* Skill name */}
      <div className='text-center relative z-10'>
        <span className='text-base font-medium text-foreground/90 transition-colors duration-300 group-hover:text-foreground'>
          {skill.name}
        </span>
      </div>

      {/* Outer shadow effect */}
      <div className='absolute inset-0 rounded-xl shadow-lg shadow-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
    </motion.div>
  )
}

// Define the skill categories and their icons
const skillGroups = [
  {
    title: 'Frontend',
    description: 'Building exceptional user interfaces',
    icon: FaCode,
    ringColor: 'from-blue-500 to-indigo-600',
    iconBgColor: 'bg-blue-900/90',
    bgGradient:
      'bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-blue-500/5',
    skills: [
      { name: 'React', icon: SiReact, color: 'text-blue-500' },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        color: 'text-slate-800 dark:text-slate-200',
      },
      { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-600' },
      { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-500' },
      { name: 'Redux', icon: SiRedux, color: 'text-purple-600' },
      { name: 'React Query', icon: SiReactquery, color: 'text-red-600' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-500' },
      { name: 'Material UI', icon: SiMui, color: 'text-blue-400' },
      { name: 'HTML5', icon: SiHtml5, color: 'text-orange-600' },
      { name: 'CSS3', icon: SiCss3, color: 'text-blue-500' },
    ],
  },
  {
    title: 'Backend',
    description: 'Crafting robust server-side solutions',
    icon: FaServer,
    ringColor: 'from-emerald-500 to-green-600',
    iconBgColor: 'bg-emerald-900/90',
    bgGradient:
      'bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-500/5',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-600' },
      {
        name: 'Express',
        icon: SiExpress,
        color: 'text-slate-800 dark:text-slate-200',
      },
      { name: 'Sequelize', icon: SiSequelize, color: 'text-blue-600' },
      { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-600' },
      { name: 'MySQL', icon: SiMysql, color: 'text-blue-500' },
      { name: 'Redis', icon: SiRedis, color: 'text-red-600' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    description: 'Scaling applications in the cloud',
    icon: FaCloud,
    ringColor: 'from-purple-500 to-violet-600',
    iconBgColor: 'bg-purple-900/90',
    bgGradient:
      'bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-purple-500/5',
    skills: [
      { name: 'AWS', icon: FaAws, color: 'text-orange-500' },
      { name: 'Elastic Beanstalk', icon: FaAws, color: 'text-orange-500' },
      { name: 'Lambda', icon: FaAws, color: 'text-orange-500' },
      { name: 'S3', icon: FaAws, color: 'text-orange-500' },
      { name: 'EC2', icon: FaAws, color: 'text-orange-500' },
      { name: 'RDS', icon: FaAws, color: 'text-orange-500' },
      { name: 'CloudWatch', icon: FaAws, color: 'text-orange-500' },
      { name: 'Route 53', icon: FaAws, color: 'text-orange-500' },
      { name: 'CloudFront', icon: FaAws, color: 'text-orange-500' },
      { name: 'Cloudflare', icon: SiCloudflare, color: 'text-orange-500' },
      {
        name: 'Vercel',
        icon: SiVercel,
        color: 'text-slate-800 dark:text-slate-200',
      },
    ],
  },
  {
    title: 'Tools & Workflow',
    description: 'Optimizing development processes',
    icon: FaTools,
    ringColor: 'from-amber-500 to-orange-600',
    iconBgColor: 'bg-amber-900/90',
    bgGradient:
      'bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-amber-500/5',
    skills: [
      { name: 'Git', icon: SiGit, color: 'text-orange-600' },
      {
        name: 'GitHub',
        icon: SiGithub,
        color: 'text-slate-800 dark:text-slate-200',
      },
      { name: 'GitHub Actions', icon: SiGithubactions, color: 'text-blue-600' },
      { name: 'Jira', icon: SiJira, color: 'text-blue-500' },
      { name: 'Jest', icon: SiJest, color: 'text-red-600' },
      {
        name: 'Cypress',
        icon: SiCypress,
        color: 'text-slate-700 dark:text-slate-200',
      },
      { name: 'CI/CD', icon: SiGithubactions, color: 'text-green-600' },
    ],
  },
]

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' })
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const skillGroupVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
        delay: i * 0.15,
      },
    }),
  }

  const skillItemVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.1 + i * 0.04,
      },
    }),
    initial: {
      boxShadow: '0 0 0 rgba(var(--primary-rgb), 0)',
      y: 0,
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

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }

  return (
    <section id='skills' className='relative py-24 md:py-32 overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90'></div>

        {/* Animated blobs */}
        <motion.div
          className='absolute inset-0 overflow-hidden'
          variants={backgroundVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className='absolute top-1/3 -right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-blob'></div>
          <div className='absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/10 rounded-full blur-[130px] animate-blob animation-delay-4000'></div>
        </motion.div>

        {/* Grain texture */}
        <div
          className='absolute inset-0 opacity-30 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        ></div>

        {/* Grid pattern */}
        <div className='absolute inset-0 bg-grid-pattern pointer-events-none opacity-30'></div>

        {/* Floating particles */}
        <div className='bg-particles absolute inset-0 z-5 pointer-events-none'>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
          <div className='particle'></div>
        </div>
      </div>

      <div className='container mx-auto px-4 relative z-20'>
        {/* Section Title */}
        <SectionTitle
          eyebrow='SKILLS'
          title='My Technical Arsenal'
          description="A comprehensive toolkit of technologies I've mastered, enabling me to architect, build and deploy sophisticated digital solutions from concept to production."
        />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='mt-16 grid gap-16'
        >
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              variants={skillGroupVariants}
              custom={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
              className={`relative ${group.bgGradient} backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/30 overflow-hidden`}
            >
              {/* Decorative elements */}
              <div className='absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl'></div>
              <div className='absolute -left-20 -top-20 w-80 h-80 bg-gradient-to-tr from-accent/5 to-accent/10 rounded-full blur-3xl'></div>

              {/* Group header with icon */}
              <div className='flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-10 relative'>
                <motion.div
                  className={`w-16 h-16 rounded-2xl ${group.iconBgColor} flex items-center justify-center shadow-lg relative z-10`}
                  whileHover={{
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <group.icon className='text-white w-8 h-8' />
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${group.ringColor} opacity-30 blur-sm`}
                    animate={pulseAnimation}
                  />
                </motion.div>

                <div className='flex-1'>
                  <h3 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
                    {group.title}
                  </h3>
                  <p className='text-lg text-muted-foreground mt-1'>
                    {group.description}
                  </p>
                </div>

                <div
                  className={`hidden md:block h-12 w-[2px] rounded-full bg-gradient-to-b ${group.ringColor} opacity-40 mx-4`}
                ></div>

                <div className='hidden md:flex items-center gap-2'>
                  <motion.div
                    className={`w-3 h-3 rounded-full ${
                      group.title === 'Frontend'
                        ? 'bg-blue-500'
                        : group.title === 'Backend'
                        ? 'bg-green-600'
                        : group.title === 'Cloud & DevOps'
                        ? 'bg-purple-600'
                        : 'bg-amber-500'
                    }`}
                    animate={pulseAnimation}
                  />
                  <span className='text-sm font-medium text-muted-foreground'>
                    {group.skills.length} Technologies
                  </span>
                </div>
              </div>

              {/* Skills grid */}
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10'>
                {group.skills.map((skill, skillIndex) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    hoveredSkill={hoveredSkill}
                    setHoveredSkill={setHoveredSkill}
                    custom={skillIndex}
                    variants={skillItemVariants}
                    ringColor={group.ringColor}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom border/gradient effect */}
      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/5 to-transparent'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-border/30 to-transparent'></div>
    </section>
  )
}
