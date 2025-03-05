'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type Point = {
  x: number
  y: number
}

type ShapeGeneratorProps = {
  points: Point[]
  color?: string
  height?: number
  speed?: number
  position?: [number, number, number]
}

export default function ShapeGenerator({
  points,
  color = '#4a9eff',
  height = 0.5,
  speed = 1,
  position = [0, 0, 0],
}: ShapeGeneratorProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Generate the geometry from the points
  const geometry = useMemo(() => {
    if (points.length < 3) return null

    // Create the shape
    const shape = new THREE.Shape()
    shape.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y)
    }

    shape.closePath()

    // Create extruded geometry with more subtle features
    const extrudeSettings = {
      steps: 1,
      depth: height * 0.8, // Reduced depth
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.1,
      bevelSegments: 3,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [points, height])

  // Convert hex color to material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.8,
      roughness: 0.1,
      emissive: new THREE.Color(color).multiplyScalar(0.4), // Brighter emissive
      side: THREE.DoubleSide,
    })
  }, [color])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate more subtly
      meshRef.current.rotation.y += delta * 0.4 * speed
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.15

      // Add some subtle up/down motion
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.15 + 0.2 // Reduced motion
    }
  })

  if (!geometry) return null

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[position[0], position[1] + 0.2, position[2]]} // Adjusted position
      scale={[0.4, 0.4, 0.4]} // Adjusted scale for better visibility
      castShadow
      receiveShadow
    />
  )
}
