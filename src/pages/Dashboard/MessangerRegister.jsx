/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Card, Alert } from 'react-bootstrap'
import '../../index.css'
import StaticRoundBtn from '../../Ui/StaticRoundBtn'
import userInfo from '../../assets/userInfo.svg'

// const HOVER_CARD_STYLES = {
//   backgroundColor: colors.hoverCardBackgroundColor,
// }

const CARD_HEADER_STYLES = {
  backgroundColor: 'transparent',
  borderBottom: '2.5px solid #557263',
  fontFamily: 'var(--font-family-mono)',
  fontWeight: 'var(--font-weight-bold)',
  fontSize: '0.9rem',
  color: '#000',
}

const ALERT_STYLES = {
  borderWidth: '2px',
  borderColor: '#ad0000',
  backgroundColor: 'transparent',
  color: '#ad0000',
}

const BUTTON_STYLES = {
  borderWidth: '2px',
  borderColor: '#186545',
  borderRadius: '2rem',
  color: '#186545',
}

const ICON_STYLES = {
  width: '3rem',
}

const SMALL_TEXT_STYLES = {
  fontSize: '0.7em',
}

const MEDIUM_TEXT_STYLES = {
  fontSize: '0.8em',
}
const QUICK_ACCESS_BUTTONS = [
  { title: 'Design Tasks', color: '#E4080A' },
  { title: 'Manufacturing', color: '#0F5A38' },
  { title: 'Quality Control', color: '#FF6201' },
  { title: 'Inventory', color: '#1f3f4f' },
]
//===================== MESSANGER =========================
export const MessengerRegister = ({ onClose, users = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  const handleSendMessage = () => {
    if (!selectedUser) {
      setError('Please select a user first')
      return
    }
    if (!message.trim()) {
      setError('Message cannot be empty')
      return
    }

    setMessages((prev) => [
      ...prev,
      {
        to: selectedUser,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
    setMessage('')
    setError('')
  }

  return (
    <Card
      style={{
        position: 'fixed',
        bottom: '0.5rem',
        left: '0.5rem',
        width: isExpanded ? '35vw' : '30vw',
        transition: 'all 0.3s ease',
        borderWidth: '2px',
        borderColor: '#000',
      }}
    >
      <Card.Header
        className='d-flex align-items-center justify-content-between p-3'
        style={{
          ...CARD_HEADER_STYLES,
          cursor: 'pointer',
          backgroundColor: isExpanded
            ? `${QUICK_ACCESS_BUTTONS[3].color}30`
            : 'transparent',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='d-flex align-items-center gap-2'>
          <img
            src={userInfo}
            alt='Messenger'
            style={{ ...ICON_STYLES, width: '1.5rem' }}
          />
          <h5 className='mb-0' style={MEDIUM_TEXT_STYLES}>
            Team Messenger
          </h5>
        </div>
        <StaticRoundBtn
          handleClick={onClose}
          color='#ad0000'
          backgroundColor='transparent'
          text='×'
          style={{ fontSize: '1.5rem', padding: '0 0.5rem' }}
        />
      </Card.Header>

      {isExpanded && (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Card.Body>
            {/* User List */}
            <div className='mb-3'>
              <h6 style={{ ...SMALL_TEXT_STYLES, fontWeight: 'bold' }}>
                Online Users
              </h6>
              <div className='d-flex flex-wrap gap-2'>
                {users.map((user) => (
                  <StaticRoundBtn
                    key={user.id}
                    text={user.name}
                    handleClick={() => setSelectedUser(user.id)}
                    color={selectedUser === user.id ? '#126a41' : '#557263'}
                    backgroundColor={
                      selectedUser === user.id
                        ? `${QUICK_ACCESS_BUTTONS[1].color}30`
                        : 'transparent'
                    }
                  />
                ))}
              </div>
            </div>

            {/* Message History */}
            <div
              style={{
                border: '2px solid #000',
                borderRadius: '10px',
                padding: '0.5rem',
                marginBottom: '1rem',
                height: '200px',
                overflowY: 'auto',
              }}
            >
              {messages.map((msg, index) => (
                <div key={index} className='mb-2'>
                  <small style={SMALL_TEXT_STYLES}>
                    <strong>{msg.to}:</strong> {msg.text}
                    <span style={{ float: 'right', color: '#666' }}>
                      {msg.timestamp}
                    </span>
                  </small>
                </div>
              ))}
            </div>

            {/* Message Input */}
            {error && (
              <Alert variant='danger' style={ALERT_STYLES}>
                {error}
              </Alert>
            )}
            <div className='d-flex gap-2'>
              <input
                type='text'
                className='form-control'
                placeholder='Type message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  ...BUTTON_STYLES,
                  borderColor: '#000',
                  borderRadius: '1rem',
                  padding: '0.5rem 1rem',
                }}
              />
              <StaticRoundBtn
                handleClick={handleSendMessage}
                color='#126a41'
                backgroundColor='transparent'
                text='Send'
              />
            </div>
          </Card.Body>
        </div>
      )}
    </Card>
  )
}
