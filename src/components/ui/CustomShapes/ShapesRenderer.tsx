'use client'

import { useFrame } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { useShapes } from './ShapesContext'
import { CustomShape } from './types'

const ShapeGenerator = dynamic(() => import('../ShapeGenerator'), {
  ssr: false,
})

export default function ShapesRenderer({
  shapes,
  speed,
}: {
  shapes: CustomShape[]
  speed: number
}) {
  const { setShapes } = useShapes()

  useFrame((state) => {
    const updatedShapes = [...shapes]
    let hasUpdates = false

    updatedShapes.forEach((shape) => {
      if (shape.entranceProgress !== undefined && shape.entranceProgress < 1) {
        if (state.clock.elapsedTime > (shape.entranceDelay || 0)) {
          // @ts-expect-error - delta exists on state but is missing in types
          const progressStep = state.delta / (shape.entranceDuration || 0.5)
          shape.entranceProgress = Math.min(
            1,
            (shape.entranceProgress || 0) + progressStep
          )
          hasUpdates = true
        }
      }
    })

    // Only update state if changes were made
    if (hasUpdates) {
      setShapes(updatedShapes)
    }
  })

  return (
    <>
      {shapes.map((shape) => (
        <ShapeGenerator
          key={shape.id}
          points={shape.points}
          holes={shape.holes}
          color={shape.color}
          height={shape.height}
          speed={shape.speed * speed}
          position={shape.position}
          materialType={shape.materialType}
          entranceProgress={shape.entranceProgress || 1}
          entranceEffect={shape.entranceEffect}
        />
      ))}
    </>
  )
}
