// Correct hex to RGB conversion
function hexToRGB(hexString) {
  // Remove the potential hash (#) prefix
  if (hexString.startsWith('#')) {
    hexString = hexString.slice(1)
  }

  // Ensure the string is the correct length
  if (hexString.length !== 6) {
    throw new Error('Invalid hexadecimal input')
  }

  // Convert each pair of hex digits to decimal
  const r = parseInt(hexString.substring(0, 2), 16)
  const g = parseInt(hexString.substring(2, 4), 16)
  const b = parseInt(hexString.substring(4, 6), 16)

  return [r, g, b]
}

// Invert the RGB color and return as hex
export function invertHex(hex) {
  const rgbArray = hexToRGB(hex)

  const [r, g, b] = rgbArray
  const invertedR = 255 - r
  const invertedG = 255 - g
  const invertedB = 255 - b

  return `#${decimalToHex(invertedR)}${decimalToHex(invertedG)}${decimalToHex(
    invertedB,
  )}`
}

// Helper function to convert decimal to 2-digit hex
function decimalToHex(decimal) {
  const hex = decimal.toString(16) // Convert to hex
  return hex.padStart(2, '0') // Ensure 2 digits
}

// Helper function to generate a number from a string's ASCII values
// function stringToAscii(str) {
//   return [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0) // Sum ASCII values
// }

// Generate a hex color based on ID, type, and phase
export function getHexBackground(
  type = 'default',
  phase = 'story',
  hoverInt = 0,
) {
  // Intensity values for each phase, increasing with phase progression
  const intensity = {
    story: 10 + hoverInt, // Lowest intensity
    inProgress: 30 + hoverInt, // Medium intensity
    reviewing: 50 + hoverInt, // Higher intensity
    done: 70 + hoverInt, // Highest intensity
  }

  // Base colors for each type (red, orange, yellow, green, blue, grey)
  const typeColors = {
    design: [255, 170, 170], // Red variant
    production: [255, 185, 100], // Orange variant
    quality: [255, 230, 130], // Yellow variant
    maintenance: [160, 240, 160], // Green variant
    default: [140, 255, 200], // Grey (fallback)
  }

  // Get the base color based on the type
  const baseColor = typeColors[type] || typeColors.default

  // Adjust the base color based on phase and type
  const color = baseColor.map((channel) =>
    channel < 255 ? channel - intensity[phase] : 255,
  )

  // Convert RGB to hex color
  return `#${color.map(decimalToHex).join('')}`
}

// Utility function to calculate lead time
export const calculateLeadTime = (dueDate) => {
  if (!dueDate) return ''

  const today = new Date()
  const due = new Date(dueDate)

  // Calculate the difference in days
  const timeDiff = due.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return daysDiff > 0 ? daysDiff.toString() : '0'
}

// Utility function to calculate dueDate
export const calcDueDate = (lead) => {
  if (!lead) return ''

  const today = new Date()
  const dueTime = lead * 24 * 3600 * 1000

  // Calculate the due date by adding the lead time to today's date
  const dueDate = new Date(today.getTime() + dueTime)

  return dueDate.toISOString().split('T')[0] // Return the date in 'YYYY-MM-DD' format
}
