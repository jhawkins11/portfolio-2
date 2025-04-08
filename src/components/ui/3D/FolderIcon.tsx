'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, ThreeElements } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

type FolderIconProps = ThreeElements['group'] & {
  isHovered?: boolean
}

export default function FolderIcon({
  isHovered: externalHovered,
  ...props
}: FolderIconProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [internalHovered, setInternalHovered] = useState(false)

  // Use external hover state if provided, otherwise use internal state
  const hovered =
    externalHovered !== undefined ? externalHovered : internalHovered

  // Animation springs
  const { rotation, scale } = useSpring({
    rotation: [0, hovered ? 0.5 : 0, 0],
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  })

  // Watch for external hover state changes
  useEffect(() => {
    if (externalHovered !== undefined) {
      setInternalHovered(false) // Reset internal state when controlled externally
    }
  }, [externalHovered])

  // Continuous gentle floating animation
  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating effect
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05

    // Very subtle rotation
    if (!hovered) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  // Simplified folder geometry
  return (
    <animated.group
      ref={meshRef}
      scale={scale}
      rotation={rotation}
      onPointerOver={() =>
        externalHovered === undefined && setInternalHovered(true)
      }
      onPointerOut={() =>
        externalHovered === undefined && setInternalHovered(false)
      }
      {...props}
    >
      {/* Base of folder */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <animated.meshStandardMaterial
          color={hovered ? '#8b5cf6' : '#a78bfa'}
          roughness={0.5}
        />
      </mesh>

      {/* Top flap of folder */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1, 0.3, 0.8]} />
        <animated.meshStandardMaterial
          color={hovered ? '#8b5cf6' : '#a78bfa'}
          roughness={0.5}
        />
      </mesh>

      {/* Tab */}
      <mesh position={[0, 0.15, 0.45]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <animated.meshStandardMaterial
          color={hovered ? '#7c3aed' : '#8b5cf6'}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </animated.group>
  )
}
