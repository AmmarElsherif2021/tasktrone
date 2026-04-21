import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../../API/users'
export function User({ id, user: userProp, explicit = false }) {
  // If user object is provided directly, use it; otherwise fetch by id
  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserInfo(id),
    enabled: !!id && !userProp,
  })

  const user = userProp || fetchedUser

  if (isLoading) {
    return <span className="text-neutral-black/50 font-mono text-sm">Loading…</span>
  }


  if (!user) {
    return <span className="text-role-admin font-mono text-sm">Unknown user</span>
  }

  return (
    <div className="text-left font-mono">
      <strong className="text-neutral-black">{user.full_name || user.username || id}</strong>
      {explicit && (
        <>
          <br />
          <span className="text-neutral-black/60">Email:</span> {user.email}
          <br />
          <span className="text-neutral-black/60">Team:</span> {user.team?.replace(/_/g, ' ')}
          <br />
          <span className="text-neutral-black/60">Role:</span> {user.role?.replace(/_/g, ' ')}
        </>
      )}
    </div>
  )
}

User.propTypes = {
  id: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    full_name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    team: PropTypes.string,
    role: PropTypes.string,
  }),
  explicit: PropTypes.bool,
}