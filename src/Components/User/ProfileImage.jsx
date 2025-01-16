//import { useUserHome } from '../../contexts/UserHomeContext'
import avatarIcon from '../../assets/profile.svg'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

export const ProfileImage = ({
  user,
  size = 5,
  showStatus = true,
  style = {},
}) => {
  const [avatarUrl, setAvatarUrl] = useState(avatarIcon)
  useEffect(() => {
    if (user && user.profileImage) {
      try {
        const byteArray = new Uint8Array(user.profileImage.data.data)
        const blob = new Blob([byteArray], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        setAvatarUrl(url)
        console.log(`AVATAR URL ${url}`)
        // Cleanup function to revoke the object URL ????
        return () => URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to create object URL:', error)
        setAvatarUrl(avatarIcon)
      }
    } else {
      setAvatarUrl(avatarIcon)
    }
  }, [user])

  return (
    <div
      className='user-profile-avatar position-relative'
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        ...style,
      }}
    >
      <img
        src={avatarUrl}
        alt='User avatar'
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderColor: '#729B87',
          borderWidth: '2px',
          borderRadius: '50%',
          margin: 0,
        }}
        className='avatar-img'
      />
      {showStatus && (
        <span
          className='position-absolute'
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#28a745',
            borderRadius: '50%',
            bottom: '0',
            right: '0',
            border: '2px solid white',
          }}
        />
      )}
    </div>
  )
}

ProfileImage.propTypes = {
  user: PropTypes.object,
  size: PropTypes.number,
  showStatus: PropTypes.bool,
  style: PropTypes.object,
}
