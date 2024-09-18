import PropTypes from 'prop-types'
import { User } from '../User/User'
export function TaskCard({
  title,
  author,
  // project,
  //requirements,
  //phase,
  leadTime,
  cycleTime,
  //users,
  //attachments
}) {
  return (
    <article style={{ margin: '1vw', width: '15vw', border: 'solid' }}>
      <h3>{title}</h3>
      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}
      <div>{leadTime}</div>
      <div>{cycleTime}</div>
    </article>
  )
}
TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  // project: projectId,
  // requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
  // phase: PropTypes.string,
  leadTime: PropTypes.number,
  cycleTime: PropTypes.number,
  // users: PropTypes.arrayOf(PropTypes.string),
  // attachments: PropTypes.string,
}
