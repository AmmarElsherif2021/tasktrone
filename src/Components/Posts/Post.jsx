import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'
import { User } from '../User/User'
import { useEffect, useState } from 'react'
import StaticRoundBtn from '../../Ui/StaticRoundBtn'
import { useProject } from '../../contexts/ProjectContext'
import { ProfileImage } from '../User/ProfileImage'

export function Post({ title, contents, author, taskId = '' }) {
  const [explicitUserInfo, setExplicitUserInfo] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentProjectMembers } = useProject()
  const [postUserData, setPostUserData] = useState(null)

  useEffect(() => {
    if (currentProjectMembers && currentProjectMembers.length) {
      const user = currentProjectMembers.find((x) => x.id === author)
      setPostUserData(user)
    }
  }, [currentProjectMembers, author])

  const truncatedContent = contents?.slice(0, 50)
  const shouldShowToggle = contents?.length > 50

  return (
    <Card
      className='mb-3 shadow-sm'
      style={{ borderColor: '#000', borderWidth: '2px' }}
    >
      <Card.Header className='d-flex align-items-center bg-transparent border-0'>
        <Button
          variant='none'
          onClick={() => setExplicitUserInfo(!explicitUserInfo)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: explicitUserInfo ? '0.6em' : '1em',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: '2px',
            borderBottomColor: '#000',
            paddingLeft: '0.5rem',
          }}
        >
          <ProfileImage
            user={postUserData}
            size={4}
            style={{
              marginRight: '1rem',
            }}
          />
          <User id={author} explicit={explicitUserInfo} />
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          <h2>{title}</h2>
        </Card.Title>
        <hr style={{ borderWidth: '2px', color: '#729B87' }} />
        <Card.Text
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '0.9em',
          }}
        >
          {isExpanded ? contents : truncatedContent}
          {!isExpanded && contents?.length > 50 && '...'}

          {shouldShowToggle && (
            <Button
              variant='link'
              onClick={() => setIsExpanded(!isExpanded)}
              className='ms-2'
              style={{
                fontSize: '0.8em',
                textDecoration: 'none',
                color: '#729B87',
                padding: 0,
              }}
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </Button>
          )}
        </Card.Text>
      </Card.Body>
      {taskId ? (
        <Card.Footer className='text-muted bg-transparent border-0'>
          <small>Related Task ID: </small>
          <StaticRoundBtn src={''} handleClick={() => {}} alt={taskId} />
        </Card.Footer>
      ) : (
        <StaticRoundBtn
          src={''}
          handleClick={() => {}}
          alt={'public'}
          backgroundColor={'#99FACA'}
          color='#729B87'
        />
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
