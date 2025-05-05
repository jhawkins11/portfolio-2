'use client'

import { useShapes } from './ShapesContext'
import ShapesRenderer from './ShapesRenderer'
import { CustomShapesProps } from './types'

export default function CustomShapes({
  enabled = true,
  speed = 1,
}: CustomShapesProps) {
  const { shapes } = useShapes()

  if (!enabled) {
    return null
  }

  return <ShapesRenderer shapes={shapes} speed={speed} />
}
