'use client'

import { FiDroplet } from 'react-icons/fi'

type MaterialSelectorProps = {
  selectedMaterial: string
  onSelectMaterial: (material: string) => void
}

export default function MaterialSelector({
  selectedMaterial,
  onSelectMaterial,
}: MaterialSelectorProps) {
  return (
    <div className='w-full'>
      <h4 className='text-xs font-medium mb-4 text-gray-700'>Material Type</h4>
      <div className='grid grid-cols-2 gap-2'>
        {['standard', 'glass', 'metal', 'plastic'].map((type) => (
          <button
            key={type}
            onClick={() => onSelectMaterial(type)}
            className={`px-3 py-2 text-xs rounded-md flex items-center justify-center gap-1 ${
              selectedMaterial === type
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiDroplet
              className={`
              ${type === 'standard' ? 'text-blue-600' : ''}
              ${type === 'glass' ? 'text-cyan-600' : ''}
              ${type === 'metal' ? 'text-gray-600' : ''}
              ${type === 'plastic' ? 'text-purple-600' : ''}
            `}
            />
            <span className='capitalize'>{type}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
