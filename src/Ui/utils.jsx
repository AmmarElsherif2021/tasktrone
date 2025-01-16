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

// Helper function for decimal to hex conversion
function decimalToHex(decimal) {
  let hex = decimal.toString(16)
  return hex.length === 1 ? '0' + hex : hex // Ensure two characters
}

// Generate hex color based on ID and phase
export function getHexBackground(id, phase = 'story', hoverDecrease = 0) {
  const intesityInt = {
    story: 160 - hoverDecrease,
    inProgress: 140 - hoverDecrease,
    reviewing: 100 - hoverDecrease,
    done: 95 - hoverDecrease,
  }

  // Id to integer
  const integer = parseInt(id, 16) % 217

  // Random pick R, G, or B
  let ptr = integer % 3
  let subPtr = integer % 2
  let significantInex =
    ((integer + 140) % intesityInt[phase]) + intesityInt[phase]
  let color = []

  // Switch to set the color array based on the random pointers
  switch (ptr) {
    case 0:
      color =
        subPtr === 0
          ? [255, intesityInt[phase], significantInex]
          : [255, significantInex, intesityInt[phase]]
      break
    case 1:
      color =
        subPtr === 0
          ? [intesityInt[phase], 255, significantInex]
          : [significantInex, 255, intesityInt[phase]]
      break
    case 2:
      color =
        subPtr === 0
          ? [intesityInt[phase], significantInex, 255]
          : [significantInex, intesityInt[phase], 255]
      break
  }

  const hexColor = `#${decimalToHex(color[0])}${decimalToHex(
    color[1],
  )}${decimalToHex(color[2])}`
  return hexColor
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
