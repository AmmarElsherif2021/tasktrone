import PropTypes from 'prop-types'
import { Button, Card, Image } from 'react-bootstrap'
import { User } from '../User/User'
import { useState } from 'react'
import userIcon from '../../assets/person-icon.svg'

export function Post({ title, contents, author, taskId = '' }) {
  const [explicitUserInfo, setExplicitUserInfo] = useState(false)
  return (
    <Card
      className='mb-3 shadow-sm'
      style={{ borderColor: 'black', borderWidth: '2px' }}
    >
      <Card.Header className='d-flex align-items-center bg-transparent border-0'>
        <Button
          variant='none'
          onClick={() => setExplicitUserInfo(!explicitUserInfo)}
          style={{
            //width: '99%',
            display: 'flex',
            flexDirection: 'row',
            fontSize: explicitUserInfo ? '0.6em' : '1em',

            //borderColor: 'none',
            //borderWidth: '1px',
          }}
        >
          <Image
            src={userIcon}
            alt='user'
            roundedCircle
            className='me-2'
            style={{ width: '3rem' }}
          />
          <User id={author} explicit={explicitUserInfo} />
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          <h2>{title}</h2>
        </Card.Title>
        <hr />
        <Card.Text>{contents}</Card.Text>
      </Card.Body>
      {taskId ? (
        <Card.Footer className='text-muted bg-transparent border-0'>
          <small>Related Task ID: {taskId}</small>
        </Card.Footer>
      ) : (
        'public'
      )}
    </Card>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string.isRequired,
  taskId: PropTypes.string,
}
