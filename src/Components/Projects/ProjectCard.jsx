import PropTypes from 'prop-types'
import { User } from '../User/User.jsx'

export function ProjectCard({ projectId, title, subtitle, admin, members }) {
  // const [token] = useAuth()
  // const queryClient = useQueryClient()

  // const mutation = useMutation({
  //   mutationFn: ({ token, projectId }) => changeProjectPhase(token, projectId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['projects', projectId])
  //   },
  // })

  return (
    <article style={{ margin: '1vw', width: '15vw', border: 'solid' }}>
      <h3>{title}</h3>
      <p>{projectId}</p>
      {subtitle && (
        <em>
          <br />
          Written by <User id={admin} />
        </em>
      )}

      <div>{members}</div>
    </article>
  )
}

ProjectCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.string),
  members: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      role: PropTypes.oneOf(['admin', 'reviwer', 'worker']).isRequired,
    }),
  ),
}
