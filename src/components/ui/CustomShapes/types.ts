export type Point = {
  x: number
  y: number
}

export type ShapeWithHoles = {
  outerShape: Point[]
  holes: Point[][]
  materialType?: string
}

export type CustomShape = {
  id: string
  points: Point[]
  holes?: Point[][]
  color: string
  height: number
  speed: number
  position: [number, number, number]
  materialType?: string
  entranceProgress?: number
  entranceDelay?: number
  entranceDuration?: number
  entranceEffect?: string
}

export type CustomShapesProps = {
  enabled?: boolean
  speed?: number
}
