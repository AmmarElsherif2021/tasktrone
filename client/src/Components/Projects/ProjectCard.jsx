/* eslint-disable react/prop-types */
// ProjectCard.jsx
import { useState } from 'react'
import { User } from '../User/User'
import { StaticRoundBtn } from '../../Ui/StaticRoundBtn'
import { StyledBadge } from '../../Ui/StyledBadge'
import { StyledCard } from '../../Ui/StyledCard'
import { Modal } from '../../Ui/Modal'

export function ProjectCard({ projectId, title, description, createdBy, members, onClick }) {
  const [showModal, setShowModal] = useState(false)
  const [hoverStates, setHoverStates] = useState({ card: false })

  const handleHover = (key, value) => setHoverStates(prev => ({ ...prev, [key]: value }))

  const handleCardClick = () => setShowModal(true)
  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  const handleCloseModal = () => setShowModal(false);
  const handleOpenProject = () => {
    handleCloseModal();
    onClick?.(projectId);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      key={projectId}
    >
      <StyledCard
        hoverKey="card"
        hoverStates={hoverStates}
        handleHover={handleHover}
        className="h-full rounded-xl cursor-pointer flex flex-col p-2 "
        onClick={handleCardClick}
        style={{
          backgroundColor: 'var(--color-accent-cyan)'
        }}
      >
        <div className="flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <StyledBadge>{projectId.slice(-6)}</StyledBadge>
          </div>
          {createdBy && (
            <div className="text-sm text-neutral-black/70 my-3">
              Created by <User id={createdBy} />
            </div>
          )}
          <p className="text-sm text-neutral-black/70 my-2 text-center">
            {description?.slice(0, 50) || 'No description'}
            {description?.length > 50 && <strong>…</strong>}
          </p>
        </div>
      </StyledCard>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={title}>
        <div className="space-y-4">
          <p>{description || 'No description available'}</p>
          <div className="max-h-60 overflow-y-auto">
            <ul className="divide-y divide-card-border">
              {members?.map((member) => (
                <li key={member.user} className="py-2 flex justify-between items-center">
                  <User id={member.user} />
                  <StyledBadge role={member.role}>{member.role}</StyledBadge>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <StaticRoundBtn
              alt="open"
              handleClick={handleOpenProject}
              color="var(--color-primary)"
              backgroundColor="transparent"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}