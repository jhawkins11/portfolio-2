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
  holes?: Point[][]
  color?: string
  height?: number
  speed?: number
  position?: [number, number, number]
}

export default function ShapeGenerator({
  points,
  holes = [],
  color = '#4a9eff',
  height = 0.5,
  speed = 1,
  position = [0, 0, 0],
}: ShapeGeneratorProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Generate the geometry from the points
  const geometry = useMemo(() => {
    console.log(
      'Generating geometry from',
      points.length,
      'points',
      'with',
      holes.length,
      'holes'
    )

    if (!points || points.length < 3) {
      console.error('Cannot create shape: not enough points', points)
      return null
    }

    try {
      // Create the main shape
      const shape = new THREE.Shape()
      shape.moveTo(points[0].x, -points[0].y)

      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, -points[i].y)
      }

      shape.closePath()

      // Add holes to the shape if any
      if (holes && holes.length > 0) {
        for (const holePoints of holes) {
          if (holePoints.length >= 3) {
            const holePath = new THREE.Path()
            holePath.moveTo(holePoints[0].x, -holePoints[0].y)

            for (let i = 1; i < holePoints.length; i++) {
              holePath.lineTo(holePoints[i].x, -holePoints[i].y)
            }

            holePath.closePath()
            shape.holes.push(holePath)
          }
        }
      }

      // Create extruded geometry with more refined settings
      const extrudeSettings = {
        steps: 2,
        depth: height * 0.8,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.07,
        bevelSegments: 3,
        bevelOffset: 0,
        curveSegments: 12, // More segments for smoother curves
      }

      // Create the extruded geometry
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

      // Center the geometry
      geometry.center()

      return geometry
    } catch (error) {
      console.error('Error creating geometry:', error)
      return null
    }
  }, [points, holes, height])

  // Convert hex color to material with improved properties
  const material = useMemo(() => {
    // Create a more interesting material with subtle variations
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.3,
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.3,
      reflectivity: 0.5,
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      side: THREE.DoubleSide,
    })

    return mat
  }, [color])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate more subtly
      meshRef.current.rotation.y += delta * 0.4 * speed
      meshRef.current.rotation.x =
        -Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.1

      // Add gentle up/down motion without drifting too far from base position
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.08
    }
  })

  if (!geometry) {
    console.warn('No geometry created - not rendering shape')
    return null
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[position[0], position[1], position[2]]}
      scale={[0.35, 0.35, 0.35]}
      castShadow
      receiveShadow
    />
  )
}
