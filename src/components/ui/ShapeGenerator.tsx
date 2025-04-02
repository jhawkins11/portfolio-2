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
  materialType?: string
  entranceProgress?: number
  entranceEffect?: string
}

// Enhanced helper function to check if a shape is approximately circular
function isCircular(points: Point[]): { isCircle: boolean; radius: number } {
  if (points.length < 8) {
    return { isCircle: false, radius: 0 }
  }

  // Calculate center point (average of all points)
  const center = points.reduce(
    (acc, p) => ({
      x: acc.x + p.x / points.length,
      y: acc.y + p.y / points.length,
    }),
    { x: 0, y: 0 }
  )

  // Calculate the distance of each point from the center
  const radii = points.map((p) =>
    Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
  )

  // Calculate average radius
  const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length

  // Check if all points are roughly the same distance from center (within 12% tolerance - tighter than before)
  const tolerance = 0.12
  const isCircle = radii.every(
    (r) => Math.abs(r - avgRadius) / avgRadius < tolerance
  )

  return { isCircle, radius: avgRadius }
}

// Function to check if a shape should be rendered as a 3D sphere or a rounded box
function detectShapeType(points: Point[]): { type: string; radius: number } {
  const { isCircle, radius } = isCircular(points)

  if (isCircle) {
    return { type: 'sphere', radius }
  }

  // For other shapes, check if they're close to a regular polygon
  // Calculate bounding box
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))

  const width = maxX - minX
  const height = maxY - minY

  // Check if it's roughly square-shaped (width and height similar)
  if (Math.abs(width - height) / Math.max(width, height) < 0.2) {
    // It's square-like, but we'll only return 'box' for specific cases
    // This ensures most shapes use extrusion instead of becoming boxes
    if (points.length < 12) {
      return { type: 'extrude', radius }
    }
    return { type: 'box', radius }
  }

  return { type: 'extrude', radius }
}

export default function ShapeGenerator({
  points,
  holes = [],
  color = '#4a9eff',
  height = 0.3,
  speed = 1,
  position = [0, 0, 0],
  materialType = 'standard',
  entranceProgress = 1,
  entranceEffect = 'fade',
}: ShapeGeneratorProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Log shape generation
  console.log('ShapeGenerator: Generating shape with', {
    points: points.length,
    holes: holes.length,
    materialType,
    position,
    entranceProgress,
    entranceEffect,
  })

  // Calculate base scale from position
  const baseScale = position[2] < -3 ? 0.85 : position[2] < -1 ? 0.75 : 0.65

  // Apply entranceProgress to get current scale
  const scaleValue = entranceProgress * baseScale

  // Detect shape type
  const { type: shapeType, radius } = useMemo(
    () => detectShapeType(points),
    [points]
  )

  // Generate the geometry based on shape analysis
  const geometry = useMemo(() => {
    if (!points || points.length < 3) {
      console.error('Cannot create shape: not enough points', points)
      return null
    }

    try {
      // Only use sphere geometry for glass material with circular shapes
      // For all other materials (standard, metal, plastic), use extrusion to preserve the drawn shape
      if (
        materialType === 'glass' &&
        shapeType === 'sphere' &&
        holes.length === 0
      ) {
        // Create a proper 3D sphere for glass material
        const sphereGeometry = new THREE.SphereGeometry(
          radius * 0.35,
          48,
          48,
          0,
          Math.PI * 2,
          0,
          Math.PI
        )

        return sphereGeometry
      }

      // For all other cases, use enhanced extrusion to preserve the drawn shape
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

      // Use different extrude settings based on shape type and material
      let extrudeSettings

      if (shapeType === 'sphere' && materialType !== 'glass') {
        // For circular shapes that aren't using glass material,
        // create a more "spherical" extrusion with higher depth
        extrudeSettings = {
          steps: 2,
          depth: height * 2.5,
          bevelEnabled: true,
          bevelThickness: 0.35,
          bevelSize: 0.4,
          bevelSegments: 10,
          bevelOffset: 0,
          curveSegments: 32,
        }
      } else if (holes.length > 0) {
        // Special settings for shapes with holes to ensure they cut all the way through
        extrudeSettings = {
          steps: 4,
          depth: height * 1.8,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.15,
          bevelSegments: 10,
          bevelOffset: 0,
          curveSegments: 32,
        }
      } else {
        // Default extrude settings for other shapes
        extrudeSettings = {
          steps: 3,
          depth: height * 1.8,
          bevelEnabled: true,
          bevelThickness: 0.15,
          bevelSize: 0.2,
          bevelSegments: 8,
          bevelOffset: 0,
          curveSegments: 24,
        }
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
  }, [points, holes, height, shapeType, radius, materialType])

  // Create a more interesting material based on material type
  const material = useMemo(() => {
    if (materialType === 'glass') {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1,
        ior: 1.5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      })
    } else if (materialType === 'metal') {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1,
        side: THREE.DoubleSide,
      })
    } else if (materialType === 'plastic') {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
      })
    } else {
      // Standard material with good defaults
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: shapeType === 'sphere' ? 0.4 : 0.3,
        roughness: shapeType === 'sphere' ? 0.3 : 0.4,
        clearcoat: shapeType === 'sphere' ? 0.5 : 0.3,
        clearcoatRoughness: 0.2,
        reflectivity: 0.7,
        emissive: new THREE.Color(color).multiplyScalar(0.2),
        side: THREE.DoubleSide,
        flatShading: shapeType !== 'sphere',
      })
    }
  }, [color, shapeType, materialType])

  // Enhanced animation with entrance effects
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base scale animation
      meshRef.current.scale.set(scaleValue, scaleValue, scaleValue)

      // Calculate position modifications based on entrance effect and progress
      let posX = position[0]
      let posY = position[1]
      let posZ = position[2]

      // Define rotation variables - use let since they might be reassigned
      let rotX = 0
      let rotY = 0
      let rotZ = 0

      // Apply different entrance animations based on effect type
      if (entranceProgress < 1) {
        const progressRemaining = 1 - entranceProgress

        switch (entranceEffect) {
          case 'pop':
            // Pop in from distance with dramatic zoom
            posZ = position[2] - progressRemaining * 20 // More dramatic distance
            rotY = progressRemaining * Math.PI * 2 // Full rotation
            break
          case 'slide':
            // Slide in from side with rotation
            posX = position[0] + Math.sign(position[0]) * progressRemaining * 15 // More distance
            rotZ = progressRemaining * Math.PI // Half rotation
            break
          case 'spiral':
            // Spiral in with multiple rotations
            rotZ = progressRemaining * Math.PI * 8 // More rotations
            posX =
              position[0] +
              Math.cos(progressRemaining * Math.PI * 4) * progressRemaining * 8 // Wider spiral
            posY =
              position[1] +
              Math.sin(progressRemaining * Math.PI * 4) * progressRemaining * 8
            break
          case 'bounce':
            // Bounce in from bottom with higher bounce
            posY =
              position[1] - progressRemaining * 10 * Math.abs(position[1] + 2)
            // Add slight wobble
            rotX =
              Math.sin(progressRemaining * Math.PI * 6) *
              progressRemaining *
              1.5
            break
          case 'fade':
          default:
            // Fade in with slight rotation
            rotY = progressRemaining * Math.PI * 3
            break
        }
      }

      // Apply entrance position
      meshRef.current.position.set(posX, posY, posZ)

      // Apply normal animations after entrance
      if (entranceProgress >= 0.95) {
        if (shapeType === 'sphere') {
          // More dynamic rotation for spherical shapes
          meshRef.current.rotation.x += delta * 0.35 * speed
          meshRef.current.rotation.y += delta * 0.45 * speed
          meshRef.current.rotation.z += delta * 0.15 * speed

          // More interesting bobbing motion
          meshRef.current.position.y =
            position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.2
          // slight horizontal movement
          meshRef.current.position.x =
            position[0] + Math.cos(state.clock.elapsedTime * 0.3 * speed) * 0.15
        } else {
          // Rotate more expressively for non-circular shapes
          meshRef.current.rotation.y += delta * 0.5 * speed
          meshRef.current.rotation.x =
            -Math.sin(state.clock.elapsedTime * 0.35 * speed) * 0.25

          // Add more pronounced up/down motion
          meshRef.current.position.y =
            position[1] + Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.15
          // Add slight horizontal movement
          meshRef.current.position.x =
            position[0] + Math.cos(state.clock.elapsedTime * 0.25 * speed) * 0.1
        }
      } else {
        // Apply entrance rotation
        meshRef.current.rotation.x = rotX
        meshRef.current.rotation.y = rotY
        meshRef.current.rotation.z = rotZ
      }
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
      scale={[scaleValue, scaleValue, scaleValue]}
      castShadow
      receiveShadow
    />
  )
}
