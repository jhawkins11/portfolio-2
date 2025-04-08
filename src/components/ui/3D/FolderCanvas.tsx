'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import FolderIcon from './FolderIcon'

type FolderCanvasProps = {
  className?: string
  isHovered?: boolean
}

export default function FolderCanvas({
  className,
  isHovered = false,
}: FolderCanvasProps) {
  return (
    <div className={`w-12 h-12 ${className || ''}`}>
      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize={1024}
        />
        <Suspense fallback={null}>
          <FolderIcon isHovered={isHovered} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
}
