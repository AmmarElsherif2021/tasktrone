import { Card } from 'react-bootstrap'
import dashboardIcon from '../assets/dashboard-icon.svg' // Replace with your dashboard icon
import { useNavigate } from 'react-router-dom'
export default function DashboardPortion() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/dashboard')
  }

  return (
    <>
      {/* Dashboard portion */}
      <Card
        style={{
          borderWidth: '2.5px',
          borderColor: '#000',
          backgroundColor: '#fff',
        }}
      >
        <Card.Body className='text-center p-5'>
          <div className='d-flex flex-column align-items-center'>
            <h3>Go to Dashboard</h3>
            {/* Clickable dashboard icon */}
            <button
              onClick={handleClick}
              style={{
                borderWidth: '2.5px',
                backgroundColor: '#1aaa8F', // Change color to match your theme
                borderRadius: '50%',
                height: '5rem',
                width: '5rem',
                display: 'flex',
                flex: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
              }}
              className='mb-1'
            >
              <img
                src={dashboardIcon}
                alt='dashboard'
                style={{
                  width: '4rem',
                  margin: 0,
                  cursor: 'pointer',
                }}
              />
            </button>
            <p className='mt-0 mb-4' style={{ color: '#666' }}>
              Access your project dashboard to manage tasks and progress.
            </p>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
