// =============================================================
// theme/colors.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for every color used in JS/JSX.
//
// ⚠️  Keep these values in sync with index.css @theme.
//     The CSS file drives Tailwind utility classes.
//     This file drives inline `style={…}` props and helper fns.
//
// Palette direction: Industrial Utilitarian
//   Muted sage-green brand, warm-grey surfaces, desaturated
//   role/category colors — a precision tool, not a consumer app.
// =============================================================

// ── Brand / neutral palette ──────────────────────────────────
export const neutral = {
  black: '#141412',   // warm black (was #000000)
  white: '#F8F6F2',   // warm white (was #ffffff)
}

// ── Card surface ─────────────────────────────────────────────
export const card = {
  background:      '#E0EAE4',  // was #D8F9E6 — muted sage tint
  backgroundHover: '#D0DDD6',  // was #C8ECD8 — slightly deeper
  border:          '#141412',
}

// ── Modal ────────────────────────────────────────────────────
export const modal = {
  text:    '#141412',
  border:  '#141412',
  divider: '#141412',
}

// ── System role colors ────────────────────────────────────────
export const role = {
  admin:    '#962828',  // was #ad0000 — less fire-engine red
  reviewer: '#1A5C3C',  // matches primary brand
  worker:   '#141412',
}

// ── Metric widget colors ──────────────────────────────────────
// Desaturated ~20% from original values
export const metrics = {
  wip:            '#C07060',  // was #ee6352
  leadTime:       '#B89020',  // was #f7b801
  inProgress:     '#2AA882',  // was #12EAA3 — less neon
  cycleTime:      '#3A7E9E',  // was #3fa7d6
  throughput:     '#2AA882',
  flowEfficiency: '#B84E04',  // was #f35b04
}

// ── Task-category background tints (RGB tuples) ───────────────
// Used by getHexBackground() in utils.jsx for opacity calculations.
// Hex equivalents are in index.css → --color-task-category-*
export const taskCategoryBase = {
  design:      [222, 200, 200],  // was [255,170,170] — dusty rose
  production:  [222, 196, 160],  // was [255,185,100] — muted sand
  quality:     [222, 216, 168],  // was [255,230,130] — muted straw
  maintenance: [184, 208, 184],  // was [160,240,160] — muted sage
  default:     [168, 204, 190],  // was [140,255,200] — muted teal
}

// ── Team / job-role colors ────────────────────────────────────
// Original: vivid Tailwind-500s. Now: same hue, ~30% desaturated.
// Keys match DB enum values (underscores).
export const teamRoleColor = {
  design_engineer:        '#5880B8',  // was #3B82F6
  cad_technician:         '#2E9468',  // was #10B981
  cnc_programmer:         '#B87820',  // was #F59E0B
  manufacturing_engineer: '#5558C0',  // was #6366F1
  machinist:              '#B84040',  // was #EF4444
  machine_operator:       '#7050C8',  // was #8B5CF6
  production_supervisor:  '#2090A8',  // was #06B6D4
  qc_inspector:           '#5A9018',  // was #84CC16
  metrology_engineer:     '#A030B0',  // was #D946EF
  inventory_manager:      '#C05818',  // was #F97316
  production_planner:     '#189080',  // was #14B8A6
  maintenance_technician: '#525860',  // was #6B7280 (barely changed)
  hr_personnel:           '#B03878',  // was #EC4899
  logistics_coordinator:  '#6030B8',  // was #7C3AED
}