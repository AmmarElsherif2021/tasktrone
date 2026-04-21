// Post.jsx
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { User } from '../User/User'
import StaticRoundBtn from '../../Ui/StaticRoundBtn'
import { useProject } from '../../contexts/ProjectContext'
import { ProfileImage } from '../User/ProfileImage'

export function Post({ title, contents, author, taskId = '' }) {
  const [explicitUserInfo, setExplicitUserInfo] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentProjectMembers } = useProject()
  const [postUserData, setPostUserData] = useState(null)

  useEffect(() => {
    if (currentProjectMembers?.length) {
      const user = currentProjectMembers.find((x) => x.id === author)
      setPostUserData(user)
    }
  }, [currentProjectMembers, author])

  const truncatedContent = contents?.slice(0, 50)
  const shouldShowToggle = contents?.length > 50

  return (
    <div className="bg-card-bg border-2 border-card-border rounded-md shadow-sm p-3 mb-3 transition-colors hover:bg-card-hover">
      {/* Header */}
      <div className="flex items-center border-0 pb-2">
        <button
          type="button"
          onClick={() => setExplicitUserInfo(!explicitUserInfo)}
          className={`flex flex-row items-center pl-2 border-b-2 border-primary rounded-t-md ${
            explicitUserInfo ? 'text-xs' : 'text-base'
          }`}
        >
          <ProfileImage user={postUserData} size={4} className="mr-4" />
          <User id={author} explicit={explicitUserInfo} />
        </button>
      </div>

      {/* Body */}
      <div className="pt-2">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <hr className="border-2 border-primary my-2" />
        <div className="font-mono font-bold text-sm">
          {isExpanded ? contents : truncatedContent}
          {!isExpanded && contents?.length > 50 && '...'}

          {shouldShowToggle && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-sm text-primary hover:underline"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      {taskId ? (
        <div className="text-muted text-sm mt-3 pt-2 border-t border-transparent">
          <small>Related Task ID: </small>
          <StaticRoundBtn src={''} handleClick={() => {}} alt={taskId} />
        </div>
      ) : (
        <div className="mt-3 pt-2 border-t border-transparent">
          <StaticRoundBtn
            src={''}
            handleClick={() => {}}
            alt={'public'}
            backgroundColor="var(--color-frost)"
            color="var(--color-primary)"
          />
        </div>
      )}
    </div>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string.isRequired,
  taskId: PropTypes.string,
}