import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../API/users'
import { Form, Alert, Row, Col, Container, Button } from 'react-bootstrap'
import ImageUpload from '../Components/User/ImageUpload'

const teams = [
  'Design Team',
  'Manufacturing Team',
  'Quality Control Team',
  'Support Teams',
]

const roles = {
  'Design Team': ['Design Engineers', 'CAD Technicians'],
  'Manufacturing Team': [
    'CNC Programmers',
    'Manufacturing Engineers',
    'Machinists',
    'Machine Operators',
    'Production Supervisors',
  ],
  'Quality Control Team': ['Quality Control Inspectors', 'Metrology Engineers'],
  'Support Teams': [
    'Inventory Managers',
    'Production Planners',
    'Maintenance Technicians',
    'HR Personnel',
    'Logistics Coordinators',
  ],
}

export function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [team, setTeam] = useState('')
  const [role, setRole] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const navigate = useNavigate()

  const signupMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('email', email)
      formData.append('team', team)
      formData.append('role', role)
      if (profileImage) {
        formData.append('profileImage', profileImage)
      } else {
        formData.append('profileImage', {})
      }
      return signup(formData)
    },
    onSuccess: () => navigate('/login'),
    onError: () => alert('Failed to sign up! Please check your information.'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    signupMutation.mutate()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container className='p-2' style={{ width: '60vw', textAlign: 'center' }}>
        <Row className='justify-content-center'>
          <Col xs={12}>
            <h2 className='mb-4 text-center'>Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              <ImageUpload onImageSelect={setProfileImage} previewUrl={null} />

              <Form.Group
                controlId='create-username'
                className='mb-3'
                style={{ maxWidth: '300px', margin: 'auto' }}
              >
                <Form.Control
                  type='text'
                  placeholder='Enter your username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group
                controlId='create-email'
                className='mb-3'
                style={{ maxWidth: '300px', margin: 'auto' }}
              >
                <Form.Control
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group
                controlId='create-password'
                className='mb-3'
                style={{ maxWidth: '300px', margin: 'auto' }}
              >
                <Form.Control
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group
                controlId='create-team'
                className='mb-3'
                style={{ maxWidth: '300px', margin: 'auto' }}
              >
                <Form.Select
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value)
                    setRole('')
                  }}
                  required
                >
                  <option value=''>Select your team</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group
                controlId='create-role'
                className='mb-3'
                style={{ maxWidth: '300px', margin: 'auto' }}
              >
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!team}
                  required
                >
                  <option value=''>Select your role</option>
                  {team &&
                    roles[team].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Button
                variant='light'
                type='submit'
                disabled={
                  !username ||
                  !password ||
                  !email ||
                  !team ||
                  !role ||
                  signupMutation.isLoading
                }
                className='w-40'
                style={{ backgroundColor: '#1aaa8F', color: 'black' }}
              >
                {signupMutation.isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>

              {signupMutation.isError && (
                <Alert variant='danger' className='mt-3'>
                  Failed to sign up! Please check your information.
                </Alert>
              )}
            </Form>
          </Col>
        </Row>
        <Row xs={12}>
          <Link to='/' className='btn btn-link mb-3'>
            Back to main page
          </Link>
        </Row>
      </Container>
    </div>
  )
}
