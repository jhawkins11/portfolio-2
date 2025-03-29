'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FiCode,
  FiDatabase,
  FiCloud,
  FiLayers,
  FiServer,
  FiBriefcase,
  FiBox,
  FiGitBranch,
} from 'react-icons/fi'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Point, Points } from '@react-three/drei'
import * as THREE from 'three'
import { SectionTitle } from '../ui/SectionTitle'

const skills = {
  languages: [
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'HTML5', level: 95 },
    { name: 'CSS', level: 90 },
    { name: 'SQL', level: 85 },
  ],
  frontend: [
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 90 },
    { name: 'Redux', level: 85 },
    { name: 'React Query', level: 85 },
    { name: 'Material UI', level: 90 },
    { name: 'Tailwind CSS', level: 95 },
  ],
  backend: [
    { name: 'Node.js', level: 90 },
    { name: 'Express', level: 90 },
    { name: 'Sequelize', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'Redis', level: 75 },
  ],
  cloud: [
    { name: 'AWS Elastic Beanstalk', level: 90 },
    { name: 'AWS RDS', level: 85 },
    { name: 'AWS Lambda', level: 85 },
    { name: 'AWS S3', level: 95 },
    { name: 'AWS CloudFront', level: 85 },
  ],
  tools: [
    { name: 'Git', level: 90 },
    { name: 'Jira', level: 85 },
    { name: 'Jest', level: 80 },
    { name: 'Cypress', level: 75 },
    { name: 'CI/CD', level: 85 },
  ],
}

const skillCategories = [
  { name: 'Languages', icon: FiCode, skills: skills.languages },
  { name: 'Frontend', icon: FiLayers, skills: skills.frontend },
  { name: 'Backend', icon: FiServer, skills: skills.backend },
  { name: 'Cloud', icon: FiCloud, skills: skills.cloud },
  { name: 'Tools', icon: FiBriefcase, skills: skills.tools },
]

// 3D Skill Cloud component
const SkillCloud = () => {
  const points = Object.values(skills)
    .flat()
    .map((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / 50)
      const theta = Math.sqrt(50 * Math.PI) * phi

      return {
        position: [
          2.5 * Math.cos(theta) * Math.sin(phi),
          2.5 * Math.sin(theta) * Math.sin(phi),
          2.5 * Math.cos(phi),
        ] as [number, number, number],
        name: skill.name,
      }
    })

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 90 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

      {points.map((point, i) => (
        <group key={i} position={point.position}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color='#3490dc' />
          </mesh>
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.15}
            color='#ffffff'
            anchorX='center'
            anchorY='middle'
          >
            {point.name}
          </Text>
        </group>
      ))}
    </Canvas>
  )
}

export default function SkillsSection() {
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
    <section id='skills' className='py-20 md:py-28'>
      <div className='container mx-auto px-4'>
        <SectionTitle
          eyebrow='Expertise'
          title='Technical Skills'
          description='My proficiency across various technologies and tools.'
        />

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* 3D Skill Cloud (Mobile View) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='lg:hidden w-full h-[300px] mb-12'
          >
            <SkillCloud />
          </motion.div>

          {/* Skills List */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            className='col-span-3'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {skillCategories.map((category, catIndex) => (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  className='bg-background border border-gray-200 rounded-lg p-6 shadow-md'
                >
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3'>
                      <category.icon className='w-5 h-5 text-primary' />
                    </div>
                    <h3 className='text-xl font-semibold'>{category.name}</h3>
                  </div>

                  <div className='space-y-4'>
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name}>
                        <div className='flex justify-between mb-1 text-sm'>
                          <span>{skill.name}</span>
                          <span className='text-muted-foreground'>
                            {skill.level}%
                          </span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2.5'>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={
                              isInView
                                ? { width: `${skill.level}%` }
                                : { width: 0 }
                            }
                            transition={{
                              duration: 0.8,
                              delay: 0.2 + 0.05 * skillIndex,
                            }}
                            className='h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary'
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3D Skill Cloud (Desktop View) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='hidden lg:block col-span-2 h-full'
          >
            <div className='h-[500px] w-full'>
              <SkillCloud />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
