/* eslint-disable react/prop-types */
//import PropTypes from 'prop-types'

import { User } from '../User/User.jsx'

export function ProjectInfo({ projectId, title, subtitle, admin, members }) {
  // const [token] = useAuth()
  // const queryClient = useQueryClient()

  // const mutation = useMutation({
  //   mutationFn: ({ token, projectId }) => changeProjectPhase(token, projectId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['projects', projectId])
  //   },
  // })

  return (
    <div
      style={{
        margin: '1vw',
        height: 'auto',
        fontSize: '0.8em',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <h3>{title ? title : 'xxx'}</h3>
      <p>{projectId ? projectId : 'x x x x'}</p>
      {subtitle ? (
        <em>
          <br />
          created by <User id={admin} />
        </em>
      ) : (
        'here will be a project description, info and status'
      )}

      <div>{members && members}</div>
    </div>
  )
}
