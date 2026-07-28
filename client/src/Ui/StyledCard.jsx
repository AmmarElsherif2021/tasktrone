import PropTypes from 'prop-types'

/**
 * StyledCard
 * ──────────────────────────────────────────────────────────────
 * A bordered card surface with a hover-tint transition.
 *
 * Colors are read from CSS variables defined in index.css @theme
 * so they stay in sync with the rest of the design system.
 *
 * Prefer using Tailwind classes (bg-card-bg, bg-card-hover, etc.)
 * directly wherever possible. The inline style here is only needed
 * because the hover value is toggled dynamically via JS state —
 * a CSS :hover rule won't work when the parent manages hover state.
 */
export const StyledCard = ({
  children,
  hoverKey,
  hoverStates,
  handleHover,
  className = '',
  style,
}) => (
  <div
    className={`
      border-[length:var(--border-width-thick)]
      border-card-border
      border-solid
      transition-colors
      duration-200
      p-2 mb-1
      ${className}
    `}
    style={{
      backgroundColor: hoverStates[hoverKey]
        ? 'var(--color-card-hover)'
        : 'var(--color-card-bg)',
      ...style,
    }}
    onMouseEnter={() => handleHover(hoverKey, true)}
    onMouseLeave={() => handleHover(hoverKey, false)}
  >
    {children}
  </div>
)

StyledCard.propTypes = {
  children:    PropTypes.node,
  hoverKey:    PropTypes.string.isRequired,
  hoverStates: PropTypes.object,
  handleHover: PropTypes.func,
  className:   PropTypes.string,
  style:       PropTypes.object,
}
 
export default StyledCard