/* eslint-disable react/prop-types */
import { Row, Col } from 'react-bootstrap'
import { User } from '../../Components/User/User'
import { ProfileImage } from '../../Components/User/ProfileImage'
import { useUserHome } from '../../contexts/UserHomeContext'

export const UserWelcome = ({ userId, welcomeMessage, children }) => {
  const { currentUser } = useUserHome()

  return (
    <Row className='mb-4'>
      <Col>
        <div className='d-flex align-items-center mb-3'>
          <ProfileImage
            user={currentUser}
            style={{ marginRight: '10px', width: '60px', height: '60px' }}
            size={5}
          />
          <div>
            <h1 className='mb-0 d-flex flex-row'>
              <strong className='mx-2'>{welcomeMessage}</strong>
              <User id={userId} />!
            </h1>
          </div>
        </div>
        <p className='px-3' style={{ color: '#666', marginTop: '10px' }}>
          {children}
        </p>
      </Col>
    </Row>
  )
}
