// =============================================================
// theme/componentStyles.js
// ─────────────────────────────────────────────────────────────
// Composed inline-style objects for React components.
//
// Rules:
//   ‣ Import colors from ./colors — never hardcode hex here
//   ‣ Import spacing from CSS variables — no spacing.js dependency
//   ‣ Use Tailwind utility classes wherever possible; fall back
//     to inline style objects ONLY for dynamic prop-driven values
//     (e.g. color chosen at runtime, width set via a number prop)
//   ‣ Do NOT duplicate anything already expressed in index.css
// =============================================================

import { card, modal, neutral, role as roleColors, teamRoleColor } from './colors'

// ── Spacing constants (mirrors index.css @theme --spacing-*) ──
// Kept here as JS so iconBtnStyle can compute widths dynamically.
const spacing = {
  xs:  '0.4rem',
  sm:  '0.5rem',
  md:  '1rem',
  lg:  '1.7rem',
}

const borderWidth = {
  thin:  '1px',
  base:  '2px',
  thick: '2.5px',
}

const borderRadius = {
  sm:   '0.5rem',
  md:   '0.75rem',
  pill: '1rem',
  card: '10px',
}

// Icon button dimensions (mirrors --spacing-icon-*)
const iconSize = {
  base: 7,     // rem — default iconWidthREM
  minBase: 4,  // rem — base - 3
  img: '1.7rem',
}

// ── Card ──────────────────────────────────────────────────────
// Prefer Tailwind classes (bg-card-bg, border-card-border, etc.)
// These inline objects are for Bootstrap Card components that
// don't accept className.
export const cardStyle = {
  base: {
    borderWidth:     borderWidth.thick,
    borderColor:     card.border,
    borderStyle:     'solid',
    transition:      'background-color 0.2s ease',
    backgroundColor: card.background,
    padding:         spacing.sm,
  },
  hover: {
    backgroundColor: card.backgroundHover,
  },
}

// ── Badge ─────────────────────────────────────────────────────
export const badgeStyle = {
  base: {
    borderWidth:  borderWidth.base,
    borderRadius: borderRadius.pill,
    borderStyle:  'solid',
    padding:      `${spacing.xs} ${spacing.sm}`,
    fontFamily:   'var(--font-family-mono)',
    fontSize:     '0.75em',
    whiteSpace:   'nowrap',
  },
  /**
   * Returns role-aware color overrides.
   * Pass null for the default (near-black) style.
   * @param {string|null} color
   */
  forRole: (color) => ({
    borderColor:     color ?? neutral.black,
    color:           color ?? neutral.white,
    backgroundColor: color ? 'transparent' : neutral.black,
  }),
}

// ── Modal ─────────────────────────────────────────────────────
export const modalStyle = {
  container: {
    color:        modal.text,
    borderWidth:  borderWidth.base,
    borderStyle:  'solid',
    borderColor:  modal.border,
    borderRadius: borderRadius.sm,
  },
  headerFooter: {
    borderColor: modal.divider,
    borderStyle: 'solid',
  },
}

// ── Round button (StaticRoundBtn) ─────────────────────────────
export const roundBtnStyle = {
  /**
   * @param {string} color            – border + text color
   * @param {string} backgroundColor  – defaults to transparent
   */
  base: (color = neutral.black, backgroundColor = 'transparent') => ({
    borderWidth:     borderWidth.base,
    borderStyle:     'solid',
    borderColor:     color,
    color:           color,
    borderRadius:    borderRadius.card,
    maxWidth:        '7rem',
    margin:          spacing.xs,
    padding:         `${spacing.xs} ${spacing.sm}`,
    backgroundColor,
    fontFamily:      'var(--font-family-mono)',
    fontSize:        '0.8em',
  }),
}

// ── Icon button ───────────────────────────────────────────────
export const iconBtnStyle = {
  /**
   * @param {number} widthREM – defaults to iconSize.base (7)
   */
  base: (widthREM = iconSize.base) => ({
    display:    'flex',
    alignItems: 'center',
    width:      `${widthREM}rem`,
    minWidth:   `${widthREM - 3}rem`,
    height:     `${widthREM / 3}rem`,
  }),
  icon: (widthREM = iconSize.base) => ({
    minWidth: `${widthREM - 3}rem`,
  }),
}

// ── Form counter (FormUi) ─────────────────────────────────────
export const formCounterStyle = {
  input: {
    width:       '4.2rem',
    marginRight: spacing.sm,
  },
  imgWidth: iconSize.img,
}

// ── System-role color lookup ──────────────────────────────────
// For dynamic role badges.  Source: colors.js → role
export function getRoleColor(roleName) {
  return roleColors[roleName] ?? null
}

// ── Team / job-role color lookup ──────────────────────────────
// Re-exported from colors.js so consumers import from one place.
export { teamRoleColor }