import { User } from '../../Components/User/User'
import { ProfileImage } from '../../Components/User/ProfileImage'
import { useUserHome } from '../../contexts/UserHomeContext'
import propTypes from 'prop-types'
export const UserWelcome = ({ userId, welcomeMessage, children }) => {
  const { currentUser } = useUserHome()

  return (
    <div className="mb-4">
      <div className="flex items-center mb-3">
        <ProfileImage
          user={currentUser}
          style={{ marginRight: '10px', width: '60px', height: '60px' }}
          size={5}
        />
        <div>
          <h1 className="text-2xl font-bold flex flex-row items-baseline">
            <span className="mx-2">{welcomeMessage}</span>
            <User id={userId} />!
          </h1>
        </div>
      </div>
      <p className="px-3 text-[#666] mt-2">{children}</p>
    </div>
  )
}
UserWelcome.propTypes = {
  userId: propTypes.string.isRequired,
  welcomeMessage: propTypes.string.isRequired,
  children: propTypes.node,
}