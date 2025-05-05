// Track which positions have been used to avoid duplicates for each view mode
let usedDesktopIndices: number[] = []
let usedMobileIndices: number[] = []

export const entranceEffects = ['pop', 'slide', 'spiral', 'bounce', 'fade']

export const getRandomColor = () => {
  const palettes = [
    // Blue to purple range
    {
      hue: Math.floor(Math.random() * 60) + 210,
      saturation: Math.floor(Math.random() * 30) + 65,
      lightness: Math.floor(Math.random() * 25) + 50,
    },
    // Pink to red range
    {
      hue: Math.floor(Math.random() * 40) + 320,
      saturation: Math.floor(Math.random() * 20) + 70,
      lightness: Math.floor(Math.random() * 20) + 55,
    },
    // Teal to cyan range
    {
      hue: Math.floor(Math.random() * 40) + 170,
      saturation: Math.floor(Math.random() * 25) + 70,
      lightness: Math.floor(Math.random() * 20) + 50,
    },
    // Occasional gold/yellow (rarer)
    {
      hue: Math.floor(Math.random() * 30) + 40,
      saturation: Math.floor(Math.random() * 20) + 75,
      lightness: Math.floor(Math.random() * 15) + 60,
    },
  ]

  const rand = Math.random()
  const palette =
    rand < 0.4
      ? palettes[0]
      : rand < 0.7
      ? palettes[1]
      : rand < 0.9
      ? palettes[2]
      : palettes[3]

  return `hsl(${palette.hue}, ${palette.saturation}%, ${palette.lightness}%)`
}

export const getShapePosition = (): [number, number, number] => {
  const desktopPositions: [number, number, number][] = [
    // Original wide positions for desktop
    [-6.0, 3.5, -1.0],
    [-5.8, 1.8, -0.5],
    [-5.5, -1.5, 0],
    [-5.2, -3.0, -1.0],
    [-4.2, 4.0, 0.5],
    [-3.8, 2.5, 0],
    [-3.5, 0.8, 0.8],
    [-3.7, -2.2, -0.2],
    [-4.0, -3.5, -0.8],
    [-2.6, 3.3, 0.2],
    [-2.3, 1.4, -0.7],
    [-2.5, -0.8, 0.4],
    [-2.0, -2.8, -0.1],
    [-1.5, 3.0, 1.0],
    [-1.3, 1.0, -0.3],
    [-1.2, -1.0, 0.6],
    [-1.4, -3.0, -0.6],
    [1.5, 3.0, 1.0],
    [1.3, 1.0, -0.3],
    [1.2, -1.0, 0.6],
    [1.4, -3.0, -0.6],
    [2.6, 3.3, 0.2],
    [2.3, 1.4, -0.7],
    [2.5, -0.8, 0.4],
    [2.0, -2.8, -0.1],
    [4.2, 4.0, 0.5],
    [3.8, 2.5, 0],
    [3.5, 0.8, 0.8],
    [3.7, -2.2, -0.2],
    [4.0, -3.5, -0.8],
    [6.0, 3.5, -1.0],
    [5.8, 1.8, -0.5],
    [5.5, -1.5, 0],
    [5.2, -3.0, -1.0],
    [7.0, 2.0, -0.5],
    [6.5, -2.0, 0],
    [-7.0, 2.0, -0.5],
    [-6.5, -2.0, 0],
    [0, 6.0, -1.0],
    [0, -6.0, -1.0],
    [2.0, 1.0, 0.5],
    [-2.0, -1.0, 0.5],
    [1.2, -1.2, 0.7],
    [-1.2, 1.2, 0.7],
    [3.0, 0.0, 0.2],
    [-3.0, 0.0, 0.2],
    [0, 2.5, 0.4],
    [0, -2.5, 0.4],
  ]

  const mobilePositions: [number, number, number][] = [
    [-3.0, 4.5, -1.0],
    [-2.8, 2.5, -0.5],
    [-2.5, -2.0, 0],
    [-2.2, -4.0, -1.0],
    [-2.2, 5.0, 0.5],
    [-1.8, 3.5, 0],
    [-1.5, 1.2, 0.8],
    [-1.7, -3.0, -0.2],
    [-2.0, -4.5, -0.8],
    [-1.6, 4.0, 0.2],
    [-1.3, 2.0, -0.7],
    [-1.5, -1.2, 0.4],
    [-1.0, -3.8, -0.1],
    [-0.8, 3.8, 1.0],
    [-0.6, 1.5, -0.3],
    [-0.5, -1.5, 0.6],
    [-0.7, -4.0, -0.6],
    [0.8, 3.8, 1.0],
    [0.6, 1.5, -0.3],
    [0.5, -1.5, 0.6],
    [0.7, -4.0, -0.6],
    [1.6, 4.0, 0.2],
    [1.3, 2.0, -0.7],
    [1.5, -1.2, 0.4],
    [1.0, -3.8, -0.1],
    [2.2, 5.0, 0.5],
    [1.8, 3.5, 0],
    [1.5, 1.2, 0.8],
    [1.7, -3.0, -0.2],
    [2.0, -4.5, -0.8],
    [3.0, 4.5, -1.0],
    [2.8, 2.5, -0.5],
    [2.5, -2.0, 0],
    [2.2, -4.0, -1.0],
    [3.5, 3.0, -0.5],
    [3.0, -3.0, 0],
    [-3.5, 3.0, -0.5],
    [-3.0, -3.0, 0],
    [0, 7.0, -1.0],
    [0, -7.0, -1.0],
    [1.0, 1.5, 0.5],
    [-1.0, -1.5, 0.5],
    [0.7, -1.8, 0.7],
    [-0.7, 1.8, 0.7],
    [1.5, 0.0, 0.2],
    [-1.5, 0.0, 0.2],
    [0, 3.5, 0.4],
    [0, -3.5, 0.4],
  ]

  let positionsToUse: [number, number, number][]
  let usedIndices: number[]

  // Check if running in a browser environment and screen width
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (isMobile) {
    positionsToUse = mobilePositions
    usedIndices = usedMobileIndices
  } else {
    positionsToUse = desktopPositions
    usedIndices = usedDesktopIndices
  }

  const availableIndices = Array.from(
    { length: positionsToUse.length },
    (_, i) => i
  ).filter((index) => !usedIndices.includes(index))

  // If all positions are used for the current mode, reset the tracking for that mode
  if (availableIndices.length === 0) {
    if (isMobile) {
      usedMobileIndices = []
    } else {
      usedDesktopIndices = []
    }
    // Refill availableIndices after reset
    availableIndices.push(
      ...Array.from({ length: positionsToUse.length }, (_, i) => i)
    )
  }

  // Select a random available position
  const randomIndex = Math.floor(Math.random() * availableIndices.length)
  const selectedIndex = availableIndices[randomIndex]

  // Mark this position as used for the current mode
  if (isMobile) {
    usedMobileIndices.push(selectedIndex)
  } else {
    usedDesktopIndices.push(selectedIndex)
  }

  return positionsToUse[selectedIndex]
}

// Helper function to randomly select a material type
export function randomizeMaterial(): string {
  const materials = ['standard', 'glass', 'metal', 'plastic']
  const weights = [0.5, 0.2, 0.2, 0.1] // Standard is most common, plastic least common

  const rand = Math.random()
  let cumulativeWeight = 0

  for (let i = 0; i < materials.length; i++) {
    cumulativeWeight += weights[i]
    if (rand < cumulativeWeight) {
      return materials[i]
    }
  }

  return 'standard'
}
