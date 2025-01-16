import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../../API/users'
export function User({ id, explicit = false }) {
  const userInfoQuery = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserInfo(id),
  })
  const userInfo = userInfoQuery.data ?? {}
  return (
    <div
      style={{
        textAlign: 'left',
      }}
    >
      <strong>{userInfo?.username ?? id}</strong>
      {explicit && (
        <>
          <br />
          <strong>Email</strong>:{` `}
          {userInfo.email}
          <br />
          <strong>Team</strong>:{` `} {userInfo.team}
          <br />
          <strong>role</strong>: {` `}
          {userInfo.role}
        </>
      )}
    </div>
  )
}

User.propTypes = {
  id: PropTypes.string.isRequired,
  explicit: PropTypes.boolean,
}
