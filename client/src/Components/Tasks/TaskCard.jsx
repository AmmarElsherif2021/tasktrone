import { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask, updateTask } from '../../API/tasks.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { User } from '../User/User.jsx'
import { useUserHome } from '../../contexts/UserHomeContext.jsx'
import forwardArrow from '../../assets/forward-negative.svg'
import backwardArrow from '../../assets/backward-negative.svg'
import deleteIcon from '../../assets/delete.svg'
import { getHexBackground } from '../../Ui/utils.jsx'
import TaskModal from './TaskModal.jsx'
import { DeleteWarningModal } from './DeleteTaskModal.jsx'
import { useProject } from '../../contexts/ProjectContext.jsx'
import IconButton from '../../Ui/IconButton.jsx'

export function TaskCard({
  taskId,
  projectId,
  title,
  author,
  leadTime,
  cycleTime,
  taskType,
  phase,
}) {
  const { accessToken } = useAuth()
  const { currentUser } = useUserHome()
  const { refreshTasks } = useProject()
  const queryClient = useQueryClient()
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hover, setHover] = useState(false)

  const phaseMutation = useMutation({
    mutationFn: ({ accessToken, projectId, taskId, phase }) =>
      updateTask(accessToken, projectId, taskId, { phase }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
      refreshTasks()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ accessToken, projectId, taskId }) =>
      deleteTask(accessToken, projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
      refreshTasks()
    },
  })

  const handlePhaseChange = (newPhase) => {
    phaseMutation.mutate({ accessToken, projectId, taskId, phase: newPhase })
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate({ accessToken, projectId, taskId })
    setShowDeleteModal(false)
  }

  const getNextPhase = (currentPhase) =>
    ({
      story: 'inProgress',
      inProgress: 'reviewing',
      reviewing: 'done',
    })[currentPhase]

  const getPreviousPhase = (currentPhase) =>
    ({
      done: 'reviewing',
      reviewing: 'inProgress',
      inProgress: 'story',
    })[currentPhase]

  const getPhaseLabel = (phase) =>
    ({
      story: 'Story',
      inProgress: 'In Progress',
      reviewing: 'Review',
      done: 'Done',
    })[phase] || phase

  const cardBg = getHexBackground(taskType, phase, hover ? 20 : 0)

  return (
    <>
      <div
        className="task-card shadow-sm border-2.5 border-black cursor-pointer p-3 rounded"
        style={{ backgroundColor: cardBg }}
        onClick={() => setShowTaskModal(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex justify-between items-start mb-2">
          <h6 className="font-mono font-bold max-w-[75%] mb-0">{title}</h6>
          {currentUser.id === author && (
            <IconButton
              src={deleteIcon}
              alt="delete"
              onClick={handleDeleteClick}
              className="danger"
              iconWidthREM="1rem"
              color="#ad0000"
            />
          )}
        </div>
        {(cycleTime > leadTime || (cycleTime / leadTime > 0.8 && leadTime < 3)) && (
          <div className="text-red-700 text-sm">
            {cycleTime > leadTime ? 'Exceeded deadline!' : 'Expires soon!'}
          </div>
        )}
        <div className="flex gap-2 mb-2">
          <span className="border-2 border-[#186545] text-[#186545] rounded-full px-2 py-1 text-xs">
            Lead: {leadTime}d
          </span>
          <span className="border-2 border-[#ad0000] text-[#ad0000] rounded-full px-2 py-1 text-xs">
            Cycle: {cycleTime}d
          </span>
        </div>
        {author && (
          <div className="text-sm text-gray-500 mb-2">
            By <User id={author} />
          </div>
        )}
        <div className="flex justify-between gap-2">
          {phase !== 'story' && (
            <button
              type="button"
              className="flex items-center gap-1 border-2 border-[#ad0000] rounded-full px-2 py-1 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                const prevPhase = getPreviousPhase(phase)
                if (prevPhase) handlePhaseChange(prevPhase)
              }}
            >
              <img src={backwardArrow} width={15} alt={`Move to ${getPhaseLabel(getPreviousPhase(phase))}`} />
              <span className="text-[#ad0000] font-bold">
                Move to {getPhaseLabel(getPreviousPhase(phase))}
              </span>
            </button>
          )}
          {phase !== 'done' && (
            <button
              type="button"
              className="flex items-center gap-1 border-2 border-black rounded-full px-2 py-1 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                const nextPhase = getNextPhase(phase)
                if (nextPhase) handlePhaseChange(nextPhase)
              }}
            >
              <span className="text-black font-bold">Move to {getPhaseLabel(getNextPhase(phase))}</span>
              <img src={forwardArrow} width={15} alt={`Move to ${getPhaseLabel(getNextPhase(phase))}`} />
            </button>
          )}
        </div>
      </div>

      <DeleteWarningModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={title}
      />

      {taskId && (
        <TaskModal
          show={showTaskModal}
          onHide={() => setShowTaskModal(false)}
          taskId={taskId}
          projectId={projectId}
          cardColor={getHexBackground(taskType, phase)}
        />
      )}
    </>
  )
}

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  leadTime: PropTypes.number,
  cycleTime: PropTypes.number,
  phase: PropTypes.string,
  requirements: PropTypes.arrayOf(PropTypes.string),
  members: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string,
      role: PropTypes.oneOf(['admin', 'reviewer', 'worker']),
    })
  ),
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      contentType: PropTypes.string.isRequired,
    })
  ),
  taskType: PropTypes.string,
  startDate: PropTypes.string,
  dueDate: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  onAttachmentUpload: PropTypes.func,
}

export default TaskCard