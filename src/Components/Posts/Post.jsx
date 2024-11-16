import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import { User } from '../User/User'

export function Post({ title, contents, author }) {
  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{contents}</Card.Text>
        {author && (
          <Card.Footer className='text-muted bg-transparent'>
            Written by <User id={author} />
          </Card.Footer>
        )}
      </Card.Body>
    </Card>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
}
