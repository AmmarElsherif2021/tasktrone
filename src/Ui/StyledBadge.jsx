import PropTypes from 'prop-types'
import { getRoleColor, badgeStyle } from './componentStyles'

/**
 * StyledBadge
 * ──────────────────────────────────────────────────────────────
 * Role-aware badge that tints its border + text to the team role
 * color, falling back to the neutral-black pill for unknown roles.
 *
 * Color lookup lives in componentStyles → getRoleColor (which
 * reads from colors.js → teamRoleColor).  No duplicate map here.
 *
 * @prop {string} role   – DB enum value e.g. 'design_engineer'
 */
export const StyledBadge = ({ children, role, className = '', ...props }) => {
  const color = getRoleColor(role)

  return (
    <span
      className={`inline-block text-nowrap ${className}`}
      style={{
        ...badgeStyle.base,
        ...badgeStyle.forRole(color),
      }}
      {...props}
    >
      {children}
    </span>
  )
}

StyledBadge.propTypes = {
  children:  PropTypes.node,
  role:      PropTypes.string,
  className: PropTypes.string,
}

export default StyledBadge