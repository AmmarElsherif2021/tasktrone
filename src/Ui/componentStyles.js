// =============================================================
// Ui/componentStyles.js
// ─────────────────────────────────────────────────────────────
// Composed inline-style objects for React components.
//
// Rules:
//   ‣ Import colors from ./colors — never hardcode hex here
//   ‣ Import spacing from CSS variables — no spacing.js dependency
//   ‣ Use Tailwind utility classes wherever possible; fall back
//     to inline style objects ONLY for dynamic prop-driven values
//   ‣ Do NOT duplicate anything already expressed in index.css
// =============================================================

import {
  card,
  cold,
  modal,
  neutral,
  role as roleColors,
  teamRoleColor,
} from './colors'

// ── Spacing constants (mirrors index.css @theme --spacing-*) ──
const spacing = {
  xs:  '0.4rem',
  sm:  '0.5rem',
  md:  '1rem',
  lg:  '1.7rem',
}

const borderWidth = {
  thin:  '1px',
  base:  '2.5px',   // matches cold button style
  thick: '3px',
}

const borderRadius = {
  sm:   '0px',
  md:   '0px',
  pill: '0px',
  card: '0px',
}

// Icon button dimensions (mirrors --spacing-icon-*)
const iconSize = {
  base: 7,
  minBase: 4,
  img: '1.7rem',
}

// ── Card ──────────────────────────────────────────────────────
export const cardStyle = {
  base: {
    borderWidth:     borderWidth.thick,
    borderColor:     card.border,
    borderStyle:     'solid',
    transition:      'background-color 0.2s ease',
    backgroundColor: card.background,
    padding:         spacing.sm,
    boxShadow:       `4px 4px 0 ${cold.shadowCard}`,
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
    boxShadow:    `4px 4px 0 ${cold.shadowCard}`,
  },
  headerFooter: {
    borderColor: modal.divider,
    borderStyle: 'solid',
  },
}

// ── Round button (StaticRoundBtn) ─────────────────────────────
export const roundBtnStyle = {
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

// ── Cold button (factory‑grade, for primary/secondary/danger) ─
export const coldBtn = (variant = 'primary') => {
  const base = {
    borderWidth: borderWidth.base,
    borderStyle: 'solid',
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: `${spacing.xs} ${spacing.sm}`,
    cursor: 'pointer',
    display: 'inline-block',
    boxShadow: `4px 4px 0 ${cold.shadowBtn}`,
  }
  switch (variant) {
    case 'primary':
      return { ...base, backgroundColor: cold.steel, borderColor: cold.navy, color: cold.frost }
    case 'secondary':
      return { ...base, backgroundColor: cold.ice, borderColor: cold.navy, color: cold.navy }
    case 'danger':
      return { ...base, backgroundColor: roleColors.admin, borderColor: cold.navy, color: cold.frost }
    default:
      return base
  }
}

// ── Icon button ───────────────────────────────────────────────
export const iconBtnStyle = {
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
export function getRoleColor(roleName) {
  return roleColors[roleName] ?? null
}

// ── Team / job-role color lookup ──────────────────────────────
export { teamRoleColor }