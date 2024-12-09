export function getHexBackground(id) {
  // Id to integer
  const integer = parseInt(id, 16)

  // Random pick R, G, or B
  let ptr = 1 //Math.floor(Math.random() * 3)
  let subPtr = Math.floor(Math.random() * 2) // Randomly pick 0 or 1
  let randIndex = (integer % 156) + 100
  let color = []

  function decimalToHex(decimal) {
    let hex = decimal.toString(16)
    return hex.length === 1 ? '0' + hex : hex // Ensure two characters
  }

  // Switch to set the color array based on the random pointers
  switch (ptr) {
    case 0:
      color = subPtr === 0 ? [255, 152, randIndex] : [255, randIndex, 152]
      break
    case 1:
      color = subPtr === 0 ? [99, 255, randIndex] : [randIndex, 255, 152]
      break
    case 2:
      color = subPtr === 0 ? [99, randIndex, 255] : [randIndex, 152, 255]
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
  return dueDate.toISOString().split('T')[0]
  // Return the date in 'YYYY-MM-DD' format
}
