'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import PlaygroundControls, {
  PlaygroundSettings,
} from '../ui/PlaygroundControls'
import { FiChevronRight, FiTool } from 'react-icons/fi'
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
} from 'react-icons/si'

type AnimatedSphereProps = {
  color: string
  emissive: string
  distort: number
  speed: number
  roughness: number
  metalness: number
}

const AnimatedSphere = ({
  color = '#3490dc',
  emissive = '#094c8d',
  distort = 0.3,
  speed = 1.5,
  roughness = 0.15,
  metalness = 0.9,
}: AnimatedSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01 * speed
      // Add subtle pulse effect when hovered
      meshRef.current.scale.x =
        meshRef.current.scale.y =
        meshRef.current.scale.z =
          1 + (hovered ? Math.sin(Date.now() * 0.005) * 0.1 : 0)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere
        args={[1.4, 128, 128]} // Adjusted size for better profile picture integration
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={color}
          attach='material'
          distort={hovered ? distort + 0.1 : distort}
          speed={speed}
          roughness={roughness}
          metalness={metalness}
          emissive={emissive}
          emissiveIntensity={hovered ? 0.7 : 0.5}
        />
      </Sphere>
    </Float>
  )
}

type FloatingObjectsProps = {
  visible: boolean
  speed: number
}

const FloatingObjects = ({
  visible = true,
  speed = 1.0,
}: FloatingObjectsProps) => {
  if (!visible) return null

  return (
    <>
      <Float
        position={[-1.8, -1.2, 0]} // Adjusted position to prevent clipping
        speed={1.5 * speed}
        rotationIntensity={1.5 * speed}
        floatIntensity={0.8 * speed}
      >
        <mesh>
          <octahedronGeometry args={[0.6, 0]} /> {/* Slightly smaller */}
          <meshStandardMaterial
            color='#FB7185'
            wireframe
            roughness={0.1}
            metalness={0.8}
            emissive='#b91c1c'
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      <Float
        position={[2.0, 0.5, -1]} // Adjusted position to prevent clipping
        speed={2 * speed}
        rotationIntensity={1 * speed}
        floatIntensity={0.5 * speed}
      >
        <mesh>
          <torusGeometry args={[0.5, 0.25, 16, 32]} /> {/* Slightly smaller */}
          <meshStandardMaterial
            color='#6EE7B7'
            roughness={0.3}
            metalness={0.7}
            emissive='#047857'
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      <Float
        position={[0, 1.8, -0.5]} // Adjusted position to prevent clipping
        speed={1.2 * speed}
        rotationIntensity={0.8 * speed}
        floatIntensity={0.7 * speed}
      >
        <mesh>
          <dodecahedronGeometry args={[0.6, 0]} /> {/* Slightly smaller */}
          <meshStandardMaterial
            color='#FDE68A'
            roughness={0.5}
            metalness={0.6}
            emissive='#a16207'
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
    </>
  )
}

export default function HeroSection() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [playgroundSettings, setPlaygroundSettings] =
    useState<PlaygroundSettings>({
      sphere: {
        color: '#3490dc',
        emissive: '#094c8d',
        distort: 0.3,
        speed: 1.5,
        roughness: 0.15,
        metalness: 0.9,
      },
      floatingObjects: {
        visible: true,
        speed: 1.0,
      },
      background: {
        primaryBlob: '#ffb7b7',
        secondaryBlob: '#b7e4e0',
        accentBlob: '#ffe2b7',
      },
      animation: {
        speed: 1.0,
      },
    })

  // Replace the tutorial state with playground mode state
  const [playgroundMode, setPlaygroundMode] = useState(false)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [activeControlPoint, setActiveControlPoint] = useState<string | null>(
    null
  )
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [showButtonCTA, setShowButtonCTA] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Auto-play animation for playground mode after page load
  useEffect(() => {
    if (!hasSeenAnimation) {
      // Remove auto-activation of playground mode on page load
      setHasSeenAnimation(true)
    }
  }, [hasSeenAnimation])

  // Show the CTA after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtonCTA(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // When control panel is closed, make sure the button can appear again
  useEffect(() => {
    if (!showControlPanel) {
      const timer = setTimeout(() => {
        // Only show CTA again if they haven't interacted yet
        if (!hasSeenAnimation) {
          setShowButtonCTA(true)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [showControlPanel, hasSeenAnimation])

  const handlePlaygroundSettingsChange = (newSettings: PlaygroundSettings) => {
    setPlaygroundSettings(newSettings)
  }

  // Open controls with default tab
  const openControls = (tab: string | null = null) => {
    if (tab) {
      setActiveControlPoint(tab)
    } else {
      // Set a default tab when opening without a specific selection
      setActiveControlPoint('sphere')
    }

    // Ensure playground mode is enabled
    setPlaygroundMode(true)

    // Show the control panel
    setShowControlPanel(true)

    // Mark that user has seen the animation/interacted with controls
    setHasSeenAnimation(true)

    // Reset button CTA to avoid multiple buttons appearing
    setShowButtonCTA(false)
  }

  const nameVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  return (
    <section
      id='hero'
      className='min-h-screen relative overflow-hidden flex items-center justify-center hero-section pt-16'
      ref={containerRef}
    >
      {/* Background Blobs - Enhanced sizes and positions */}
      <div
        className='blob bg-primary/30 w-[800px] h-[800px] -top-48 -left-24 blur-3xl opacity-70'
        style={{
          backgroundColor: playgroundSettings.background.primaryBlob,
          animationDuration: `${20 / playgroundSettings.animation.speed}s`,
        }}
      ></div>
      <div
        className='blob bg-accent/25 w-[900px] h-[900px] -right-48 top-1/3 blur-3xl animation-delay-2000 opacity-70'
        style={{
          backgroundColor: playgroundSettings.background.secondaryBlob,
          animationDuration: `${20 / playgroundSettings.animation.speed}s`,
        }}
      ></div>
      <div
        className='blob bg-secondary/20 w-[700px] h-[700px] bottom-0 left-1/3 blur-3xl animation-delay-4000 opacity-70'
        style={{
          backgroundColor: playgroundSettings.background.accentBlob,
          animationDuration: `${20 / playgroundSettings.animation.speed}s`,
        }}
      ></div>

      {/* Background grid with stronger presence */}
      <div className='absolute inset-0 bg-grid-pattern pointer-events-none'></div>

      {/* Add noise texture for more organic feel */}
      <div className='bg-noise absolute inset-0 pointer-events-none'></div>

      {/* Content Container */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12'>
        {/* Text content */}
        <motion.div
          className='flex flex-col justify-center lg:w-1/2 lg:pr-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Intro Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className='relative inline-flex items-center gap-3 mb-4'
          >
            <div className='w-12 h-[3px] bg-gradient-to-r from-primary to-accent rounded-full'></div>
            <span className='text-lg font-medium text-foreground/80'>
              Hello, I&apos;m
            </span>
          </motion.div>

          {/* Name */}
          <div className='relative'>
            <motion.h1
              className='text-6xl md:text-7xl lg:text-8xl font-bold mb-3 tracking-tight relative inline-flex flex-col'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className='text-gradient relative'
                custom={0}
                initial='initial'
                animate='animate'
                variants={nameVariants}
              >
                Josiah
                <div className='absolute right-0 top-0 w-8 h-8 rounded-full bg-secondary/40 blur-md animate-pulse -translate-y-4 translate-x-4'></div>
              </motion.span>

              <motion.span
                className='text-gradient-blue relative'
                custom={1}
                initial='initial'
                animate='animate'
                variants={nameVariants}
              >
                Hawkins
                <div className='absolute left-0 bottom-0 w-8 h-8 rounded-full bg-accent/40 blur-md animate-pulse animation-delay-2000 translate-y-4 -translate-x-4'></div>
              </motion.span>
            </motion.h1>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='relative mb-8'
          >
            <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary/80 to-accent/80 rounded-full'></div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground/90 pl-4'>
              Full Stack Developer
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            className='text-base md:text-lg text-foreground/80 max-w-lg mb-8 leading-relaxed'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            I build exceptional digital experiences with React, Next.js, and
            modern cloud infrastructure. Specializing in performance-optimized
            web applications that deliver real business value.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className='flex flex-wrap gap-5'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <a
              href='#contact'
              className='button-primary group relative overflow-hidden'
            >
              <span className='relative z-10'>Get in touch</span>
              <span className='absolute inset-0 w-0 bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 ease-out group-hover:w-full opacity-20'></span>
              <div className='absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine'></div>
            </a>
            <a
              href='#projects'
              className='button-secondary group relative overflow-hidden'
            >
              <span className='relative z-10'>View my work</span>
              <div className='absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine'></div>
            </a>
          </motion.div>

          {/* Tech stack icons */}
          <motion.div
            className='mt-10 relative'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-5 h-5 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center'>
                <div className='w-2.5 h-2.5 rounded-full bg-primary animate-pulse'></div>
              </div>
              <div className='text-sm font-semibold tracking-wider text-foreground/70 uppercase'>
                Tech Stack
              </div>
            </div>
            <div className='flex flex-wrap gap-3'>
              {[
                {
                  name: 'React',
                  color: 'bg-blue-500',
                  textColor: 'text-blue-500',
                  shadow: 'shadow-blue-500/20',
                  icon: SiReact,
                },
                {
                  name: 'Next.js',
                  color: 'bg-black',
                  textColor: 'text-gray-800',
                  shadow: 'shadow-gray-800/20',
                  icon: SiNextdotjs,
                },
                {
                  name: 'TypeScript',
                  color: 'bg-blue-600',
                  textColor: 'text-blue-600',
                  shadow: 'shadow-blue-600/20',
                  icon: SiTypescript,
                },
                {
                  name: 'Node.js',
                  color: 'bg-green-600',
                  textColor: 'text-green-600',
                  shadow: 'shadow-green-600/20',
                  icon: SiNodedotjs,
                },
                {
                  name: 'Tailwind',
                  color: 'bg-cyan-500',
                  textColor: 'text-cyan-500',
                  shadow: 'shadow-cyan-500/20',
                  icon: SiTailwindcss,
                },
              ].map((tech, i) => (
                <motion.span
                  key={tech.name}
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-background/70 backdrop-blur-sm border border-white/10 ${tech.shadow} shadow-lg flex items-center gap-2 hover:scale-105 transition-transform duration-200`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
                >
                  <tech.icon className={`${tech.textColor} text-lg`} />
                  <span className={tech.textColor}>{tech.name}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Element Container - Enhanced for visual impact */}
        <motion.div
          className='h-[450px] md:h-[550px] lg:h-[650px] w-full lg:w-1/2 relative mt-8 lg:mt-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          {/* Enhanced 3D Scene - Adjusted to properly display all elements */}
          <motion.div
            style={{
              transform: `perspective(2000px) rotateX(${
                cursorPos.y * 3 * playgroundSettings.animation.speed
              }deg) rotateY(${
                -cursorPos.x * 3 * playgroundSettings.animation.speed
              }deg)`,
            }}
            className='relative h-full w-full z-10'
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <spotLight
                position={[-10, -10, -5]}
                intensity={1}
                angle={0.4}
                penumbra={1}
              />
              <group
                position={[0, 0, 0]}
                rotation={[0, cursorPos.x * 0.2, cursorPos.y * 0.2]}
              >
                <AnimatedSphere
                  color={playgroundSettings.sphere.color}
                  emissive={playgroundSettings.sphere.emissive}
                  distort={playgroundSettings.sphere.distort}
                  speed={
                    playgroundSettings.sphere.speed *
                    playgroundSettings.animation.speed
                  }
                  roughness={playgroundSettings.sphere.roughness}
                  metalness={playgroundSettings.sphere.metalness}
                />
              </group>
              <FloatingObjects
                visible={playgroundSettings.floatingObjects.visible}
                speed={
                  playgroundSettings.floatingObjects.speed *
                  playgroundSettings.animation.speed
                }
              />
            </Canvas>

            {/* Enhanced decorative elements */}
            <div className='absolute -top-10 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow'></div>
            <div className='absolute -bottom-20 left-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000'></div>

            {/* Concentric circles with gradient borders */}
            {[400, 320, 240].map((size, i) => (
              <div
                key={size}
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-full animate-spin-slow'
                style={{
                  width: size,
                  height: size,
                  borderColor: `rgba(var(--primary-rgb), ${0.05 + i * 0.03})`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${
                    12 / playgroundSettings.animation.speed
                  }s`,
                }}
              ></div>
            ))}

            {/* Profile Image with better integration with the sphere */}
            <motion.div
              className='absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            >
              <div className='relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl'>
                <Image
                  src='/images/profile-pic.png'
                  alt='Josiah Hawkins'
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  className='rounded-full'
                />
                {/* Add gradient overlay to match sphere colors */}
                <div className='absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/20 mix-blend-overlay'></div>
              </div>
              {/* Enhanced glowing effect */}
              <div className='absolute -inset-3 rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 animate-spin-slow opacity-70 blur-md'></div>
            </motion.div>
          </motion.div>

          {/* Updated code snippets with better positioning and visibility */}
          <motion.div
            className='absolute top-24 md:top-16 right-4 md:right-8 lg:right-20 bg-background/95 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 shadow-2xl transform rotate-2 z-30 max-w-[200px] md:max-w-[250px]'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{
              boxShadow:
                '0 10px 30px -15px rgba(var(--primary-rgb), 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <pre className='text-xs md:text-sm text-foreground/90 font-mono whitespace-pre-wrap'>
              {`const skills = ['React', 'Next.js', 'AWS'];
const passion = 'Building amazing apps';`}
            </pre>
          </motion.div>

          <motion.div
            className='absolute bottom-24 md:bottom-32 left-4 md:left-12 lg:left-20 bg-background/95 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 shadow-2xl transform -rotate-3 z-30 max-w-[200px] md:max-w-[250px]'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              boxShadow:
                '0 10px 30px -15px rgba(var(--accent-rgb), 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <pre className='text-xs md:text-sm text-foreground/90 font-mono whitespace-pre-wrap'>
              {`// 3+ years of full stack experience
function createImpact() {
  return 'Exceptional digital solutions';
}`}
            </pre>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className='text-xs font-medium text-foreground/60 uppercase tracking-wider mb-2'>
          Scroll to explore
        </span>
        <div className='w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-1'>
          <motion.div
            className='w-1.5 h-1.5 bg-foreground/60 rounded-full'
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5 / playgroundSettings.animation.speed,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          ></motion.div>
        </div>
      </motion.div>

      {/* Animated Controls Button with CTA - Premium UX (Repositioned to corner) */}
      <AnimatePresence>
        {!showControlPanel && (
          <motion.div
            className='fixed bottom-8 right-8 z-50 flex items-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Call to action with animated arrow */}
            <AnimatePresence>
              {showButtonCTA && (
                <motion.div
                  className='absolute right-16 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center whitespace-nowrap'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className='text-gray-800 font-medium mr-2'>
                    Customize Experience
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'easeInOut',
                    }}
                  >
                    <FiChevronRight className='text-blue-500' />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main control button */}
            <motion.button
              onClick={() => {
                console.log('Button clicked')
                openControls()
              }}
              className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Inner glow effect */}
              <motion.div
                className='absolute inset-0 bg-white opacity-0 rounded-full'
                initial={{ scale: 0.8 }}
                whileHover={{
                  scale: 1.2,
                  opacity: 0.2,
                  transition: { duration: 0.4 },
                }}
              />

              {/* Animated ring */}
              <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-200'></div>

              {/* Icon */}
              <FiTool className='text-2xl relative z-10' />

              {/* Subtle particle effect */}
              <motion.div
                className='absolute inset-0'
                animate={{
                  background: [
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                    'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Panel - Ensure we're correctly handling the visibility state */}
      {playgroundMode && (
        <PlaygroundControls
          initialSettings={playgroundSettings}
          onSettingsChange={handlePlaygroundSettingsChange}
          activeControlPoint={activeControlPoint}
          isVisible={showControlPanel}
          onVisibilityChange={(visible) => {
            // When the control panel visibility changes internally
            setShowControlPanel(visible)
            // Only exit playground mode if explicitly closing
            if (!visible) {
              console.log('Controls closed')
              // Reset state to avoid issues when reopening
              setTimeout(() => {
                if (!visible) {
                  setActiveControlPoint(null)
                }
              }, 300)
            }
          }}
          lightTheme={true}
        />
      )}
    </section>
  )
}
