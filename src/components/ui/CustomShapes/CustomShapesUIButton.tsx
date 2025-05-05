'use client'

import { motion } from 'framer-motion'
import { FiTool } from 'react-icons/fi'

type CustomShapesUIButtonProps = {
  onClick: () => void
}

export default function CustomShapesUIButton({
  onClick,
}: CustomShapesUIButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className='bg-gradient-to-r from-purple-500/80 to-pink-600/80 hover:from-purple-500/90 hover:to-pink-600/90 text-white p-3 w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden group'
      aria-label='Settings'
    >
      <FiTool className='w-5 h-5 relative z-10' />
      <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200'></div>
    </motion.button>
  )
}
