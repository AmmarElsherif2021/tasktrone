import { useState } from 'react'
import '../../index.css'
import StaticRoundBtn from '../../Ui/StaticRoundBtn'
import userInfo from '../../assets/userInfo.svg'
import propTypes from 'prop-types'
const QUICK_ACCESS_BUTTONS = [
  { title: 'Design Tasks', color: '#E4080A' },
  { title: 'Manufacturing', color: '#0F5A38' },
  { title: 'Quality Control', color: '#FF6201' },
  { title: 'Inventory', color: '#1f3f4f' },
]

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
    <div
      className={`fixed bottom-2 left-2 border-2 border-neutral-black bg-white rounded-md transition-all duration-300 ${
        isExpanded ? 'w-[35vw]' : 'w-[30vw]'
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b-2 border-[#557263] cursor-pointer"
        role="button"
        tabIndex={0}
        style={{
          backgroundColor: isExpanded ? `${QUICK_ACCESS_BUTTONS[3].color}30` : 'transparent',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        <div className="flex items-center gap-2">
          <img src={userInfo} alt="Messenger" className="w-6 h-6" />
          <h5 className="text-sm font-bold m-0">Team Messenger</h5>
        </div>
        <StaticRoundBtn
          handleClick={onClose}
          color="#ad0000"
          backgroundColor="transparent"
          text="×"
          style={{ fontSize: '1.5rem', padding: '0 0.5rem' }}
        />
      </div>

      {isExpanded && (
        <div className="max-h-[400px] overflow-y-auto p-3">
          {/* User list */}
          <div className="mb-3">
            <h6 className="text-xs font-bold mb-2">Online Users</h6>
            <div className="flex flex-wrap gap-2">
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

          {/* Message history */}
          <div className="border-2 border-neutral-black rounded-card p-2 mb-3 h-[200px] overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <small className="text-xs">
                  <strong>{msg.to}:</strong> {msg.text}
                  <span className="float-right text-[#666]">{msg.timestamp}</span>
                </small>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="border-2 border-[#ad0000] bg-transparent text-[#ad0000] p-2 rounded mb-2">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border-2 border-neutral-black rounded-pill px-3 py-1"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <StaticRoundBtn
              handleClick={handleSendMessage}
              color="#126a41"
              backgroundColor="transparent"
              text="Send"
            />
          </div>
        </div>
      )}
    </div>
  )
}
MessengerRegister.propTypes = {
  onClose: propTypes.func.isRequired,
  users: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string.isRequired,
      name: propTypes.string.isRequired,
    })
  ).isRequired,
}