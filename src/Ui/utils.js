import { taskCategoryBase } from "./colors"

// ── Hex / RGB helpers ─────────────────────────────────────────
function hexToRGB(hexString) {
  if (hexString.startsWith('#')) hexString = hexString.slice(1)
  if (hexString.length !== 6) throw new Error('Invalid hexadecimal input')
  return [
    parseInt(hexString.substring(0, 2), 16),
    parseInt(hexString.substring(2, 4), 16),
    parseInt(hexString.substring(4, 6), 16),
  ]
}

function decimalToHex(decimal) {
  return decimal.toString(16).padStart(2, '0')
}

export function invertHex(hex) {
  const [r, g, b] = hexToRGB(hex)
  return `#${decimalToHex(255 - r)}${decimalToHex(255 - g)}${decimalToHex(255 - b)}`
}

// ── Task-card background color ────────────────────────────────
const phaseIntensity = {
  story:      10,
  inProgress: 30,
  reviewing:  50,
  done:       70,
}

export function getHexBackground(type = 'default', phase = 'story', hoverInt = 0) {
  const base      = taskCategoryBase[type] ?? taskCategoryBase.default
  const intensity = (phaseIntensity[phase] ?? 10) + hoverInt
  const color     = base.map((ch) => (ch < 255 ? ch - intensity : 255))
  return `#${color.map(decimalToHex).join('')}`
}

// ── Lead time helpers ─────────────────────────────────────────
export const calculateLeadTime = (dueDate) => {
  if (!dueDate) return ''
  const daysDiff = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / (1000 * 3600 * 24),
  )
  return daysDiff > 0 ? daysDiff.toString() : '0'
}

export const calcDueDate = (lead) => {
  if (!lead) return ''
  return new Date(Date.now() + lead * 24 * 3600 * 1000)
    .toISOString()
    .split('T')[0]
}
