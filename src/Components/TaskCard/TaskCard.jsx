import PropTypes from 'prop-types'
import { User } from '../User/User'
export function TaskCard({ title, content, author }) {
  return (
    <article style={{ margin: '1vw', width: '15vw', border: 'solid' }}>
      <h3>{title}</h3>
      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}
      <div>{content}</div>
    </article>
  )
}
TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.string,
}
