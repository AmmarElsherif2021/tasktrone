import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import { User } from '../User/User'
import userIcon from '../../assets/profile.svg'
export function Post({ title, contents, author }) {
  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{contents}</Card.Text>
      </Card.Body>
      <Card.Footer className='text-muted bg-transparent'>
        <img
          //src={member?.avatar ? member.avatar : userIcon}
          src={userIcon}
          alt={'user'}
          className='w-2 h-2 rounded-circle'
          style={{ width: '2rem' }}
        />

        <div className='font-medium'>
          <small>
            <User id={author} />
          </small>
        </div>
        {/* <small>{member.role}</small>*/}
      </Card.Footer>
    </Card>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
}
