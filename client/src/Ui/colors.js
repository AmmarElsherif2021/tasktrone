// =============================================================
//  Ui/colors.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for every color used in JS/JSX.
//
// ⚠️  Keep these values in sync with index.css @theme.
//     The CSS file drives Tailwind utility classes.
//     This file drives inline `style={…}` props and helper fns.
//
// Palette direction: Cold Industrial (Tasktrone)
//   Navy / steel / frost – sharp, factory‑floor feel.
//   See index.html for the design token reference.
// =============================================================

// ── Brand / neutral palette ──────────────────────────────────
export const neutral = {
  black: '#0B1E33',   // navy   (was #141412)
  white: '#EAF0F5',   // frost  (was #F8F6F2)
}

// ── Extended cold palette (non‑theme, for shadows & accents) ─
export const cold = {
  navy:        '#0B1E33',
  steel:       '#2C3E50',
  slate:       '#4A5C6C',
  ice:         '#9DBFCF',
  glacier:     '#6C8B9B',
  fog:         '#C5D5E0',
  frost:       '#EAF0F5',
  accentBlue:  '#1A7F8C',
  accentCyan:  '#00A5B5',
  warningAmber:'#B68B40',
  shadowCard:  '#2C3E50',   // steel
  shadowBtn:   '#0B1E33',   // navy
}

// ── Card surface ─────────────────────────────────────────────
export const card = {
  background:      '#EAF0F5',  // frost
  backgroundHover: '#D6E4EE',  // slightly deeper (ice tint)
  border:          '#0B1E33',  // navy
}

// ── Modal ────────────────────────────────────────────────────
export const modal = {
  text:    '#0B1E33',
  border:  '#0B1E33',
  divider: '#0B1E33',
}

// ── System role colors ────────────────────────────────────────
export const role = {
  admin:    '#C44040',  // cold red
  reviewer: '#1A7F8C',  // accent-blue
  worker:   '#0B1E33',  // navy
}

// ── Metric widget colors ──────────────────────────────────────
export const metrics = {
  wip:            '#C07060',
  leadTime:       '#B68B40',  // warning amber
  inProgress:     '#00A5B5',  // accent cyan
  cycleTime:      '#3A7E9E',
  throughput:     '#00A5B5',
  flowEfficiency: '#C06020',
}

// ── Task-category background tints (RGB tuples) ───────────────
export const taskCategoryBase = {
  design:      [200, 170, 170],
  production:  [200, 185, 160],
  quality:     [200, 195, 150],
  maintenance: [170, 190, 170],
  default:     [160, 190, 180],
}

// ── Team / job-role colors ────────────────────────────────────
export const teamRoleColor = {
  design_engineer:        '#5880B8',
  cad_technician:         '#2E9468',
  cnc_programmer:         '#B87820',
  manufacturing_engineer: '#5558C0',
  machinist:              '#B84040',
  machine_operator:       '#7050C8',
  production_supervisor:  '#2090A8',
  qc_inspector:           '#5A9018',
  metrology_engineer:     '#A030B0',
  inventory_manager:      '#C05818',
  production_planner:     '#189080',
  maintenance_technician: '#525860',
  hr_personnel:           '#B03878',
  logistics_coordinator:  '#6030B8',
}