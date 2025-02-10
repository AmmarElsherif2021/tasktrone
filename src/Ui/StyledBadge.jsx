/* eslint-disable react/prop-types */
import { Badge } from 'react-bootstrap'
function getRoleColor(role) {
  return {
    admin: '#ad0000',
    reviewer: '#186545',
    worker: '#000',
  }[role]
}
//Badge style
const BASE_BADGE_STYLE = {
  borderWidth: '2px',
  borderRadius: '1rem',
  borderStyle: 'solid',
  padding: '0.5rem',
}
// Reusable components
export const StyledBadge = ({ children, role, ...props }) => (
  <Badge
    bg='none'
    className='text-nowrap'
    style={{
      ...BASE_BADGE_STYLE,
      borderColor: role ? getRoleColor(role) : '#000',
      color: role ? getRoleColor(role) : '#fff',
      backgroundColor: role ? 'transparent' : '#000',
      ...props.style,
    }}
    {...props}
  >
    {children}
  </Badge>
)
