import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../../contexts/AuthContext'

import { Link } from 'react-router-dom'
import { User } from '../User/User'

export function Header() {
  const [token, setToken] = useAuth()
  if (token) {
    const { sub } = jwtDecode(token)
    return (
      <div>
        Logged in as <User id={sub} />
        <br />
        <Link to='/dashboard'> Dashboard </Link>
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }
  return (
    <div style={{ height: '7vh', backgroundColor: 'black' }}>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
