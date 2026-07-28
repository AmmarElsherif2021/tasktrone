import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FileText, Users, Upload, Clock, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { User } from '../User/User'
import FormCounter from '../../Ui/FormUi'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getTaskById, updateTask } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'
import refreshIcon from '../../assets/refresh-icon.svg'
import userIcon from '../../assets/profile.svg'

function TaskModal({ show, onHide, taskId, projectId, cardColor }) {
  const { accessToken } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const queryClient = useQueryClient()

  const taskQuery = useQuery({
    queryKey: ['task', taskId, projectId],
    queryFn: async () => {
      const data = await getTaskById(taskId, projectId, accessToken)
      return {
        ...data,
        startDate: data?.startDate ? new Date(data.startDate).toLocaleDateString() : null,
        dueDate: data?.dueDate ? new Date(data.dueDate).toLocaleDateString() : null,
      }
    },
    retry: 2,
    staleTime: 2 * 60 * 1000,
    enabled: !!taskId && !!projectId && show,
    onError: (err) => console.error('Error fetching task:', err),
  })

  const phaseMutation = useMutation({
    mutationFn: ({ accessToken, projectId, taskId, phase }) =>
      updateTask(accessToken, projectId, taskId, { phase }),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId, projectId])
      queryClient.invalidateQueries(['tasks'])
    },
  })

  const getNextPhase = (currentPhase) => {
    const phaseFlow = { story: 'inProgress', inProgress: 'reviewing', reviewing: 'done' }
    return phaseFlow[currentPhase]
  }

  const getPreviousPhase = (currentPhase) => {
    const reversePhaseFlow = { done: 'reviewing', reviewing: 'inProgress', inProgress: 'story' }
    return reversePhaseFlow[currentPhase]
  }

  const handlePhaseChange = (newPhase) => {
    phaseMutation.mutate({ accessToken, projectId, taskId, phase: newPhase })
  }

  const cycleTimePercentage = (taskQuery?.data?.cycleTime / taskQuery?.data?.leadTime) * 100

  const [priority, setPriority] = useState(0)
  useEffect(() => {
    setPriority(taskQuery?.data?.priority)
  }, [taskQuery?.data])

  const priorityMutation = useMutation({
    mutationFn: ({ accessToken, projectId, taskId, priority }) =>
      updateTask(accessToken, projectId, taskId, { priority }),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId, projectId])
    },
  })

  const handlePriorityChange = (e) => {
    setPriority(e.target.value)
  }

  const handlePrioritySubmit = () => {
    if (taskQuery.data && accessToken) {
      priorityMutation.mutate({ accessToken, projectId, taskId, priority })
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onHide()
      }}
    >
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {taskQuery.isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : taskQuery.isError ? (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            Failed to load task details. {taskQuery.error?.message && `Error: ${taskQuery.error.message}`}
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4" style={{ backgroundColor: cardColor }}>
              <h3 className="text-xl font-bold">{taskQuery?.data?.title}</h3>
              <button onClick={onHide} className="text-2xl leading-none">&times;</button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <div className="flex flex-wrap justify-between gap-2 mb-4 text-sm">
                <div>
                  Task ID: <small>{taskQuery?.data?._id}</small><br />
                  Created at: <small>{new Date(taskQuery?.data?.createdAt).toLocaleString()}</small><br />
                  Due date: <small>{new Date(taskQuery?.data?.dueDate).toLocaleDateString()}</small>
                </div>
                <div>
                  Phase: <span className="font-bold">{taskQuery?.data?.phase}</span>
                  <FormCounter
                    src={refreshIcon}
                    handlePriorityChange={handlePriorityChange}
                    handlePrioritySubmit={handlePrioritySubmit}
                    priority={taskQuery?.data?.priority}
                    projectId={projectId}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <div className="flex gap-2">
                  {[
                    { key: 'overview', label: 'Overview', icon: FileText },
                    { key: 'team', label: 'Team', icon: Users },
                    { key: 'attachments', label: 'Attachments', icon: Upload },
                    { key: 'metrics', label: 'Metrics', icon: Clock },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-t-md transition ${
                        activeTab === tab.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Panels */}
              {activeTab === 'overview' && (
                <div>
                  <h5 className="font-bold">Task Description</h5>
                  <p>{taskQuery?.data?.description || 'No description provided'}</p>
                  <h5 className="font-bold mt-3">Requirements</h5>
                  {taskQuery?.data?.requirements?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {taskQuery.data.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No specific requirements defined</p>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  <h5 className="font-bold mb-2">Team Members</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {taskQuery?.data?.members?.map((member) => (
                      <div key={member.user} className="flex items-center gap-3 p-3 border rounded">
                        <img src={userIcon} alt={member.user} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium"><User id={member.user} /></div>
                          <small>{member.role}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'attachments' && (
                <div>
                  <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded">
                    <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p>Drag and drop files or click to upload</p>
                    <input type="file" className="hidden" multiple />
                  </div>
                  {taskQuery?.data?.attachments?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-bold mb-2">Existing Attachments</h5>
                      {taskQuery.data.attachments.map((att) => (
                        <div key={att.id} className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            <div>
                              <div>{att.filename}</div>
                              <div className="text-xs text-gray-500">{att.contentType}</div>
                            </div>
                          </div>
                          <button className="text-green-600"><Check size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-bold">Lead Time</h5>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(cycleTimePercentage, 100)}%` }}></div>
                    </div>
                    <small>{taskQuery?.data?.leadTime} days</small>
                  </div>
                  <div>
                    <h5 className="font-bold">Cycle Time</h5>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(cycleTimePercentage, 100)}%` }}></div>
                    </div>
                    <small>{taskQuery?.data?.cycleTime} days</small>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={onHide} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                Close
              </button>
              <div className="flex gap-2">
                {taskQuery?.data?.phase !== 'story' && (
                  <button
                    onClick={() => handlePhaseChange(getPreviousPhase(taskQuery.data.phase))}
                    className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md"
                  >
                    <ArrowLeft size={16} /> Previous Phase
                  </button>
                )}
                {taskQuery?.data?.phase !== 'done' && (
                  <button
                    onClick={() => handlePhaseChange(getNextPhase(taskQuery.data.phase))}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md"
                  >
                    Next Phase <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

TaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  cardColor: PropTypes.string.isRequired,
}

export default TaskModal