/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UploadCloud, Paperclip } from 'lucide-react'
import { calculateLeadTime, calcDueDate } from '../../Ui/utils'
import { createTask, uploadTaskAttachment } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'
import createTaskIcon from '../../assets/create-task.svg'
import { useProject } from '../../contexts/ProjectContext'
import IconButton from '../../Ui/IconButton'

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function CreateTask() {
  const {
    currentProjectMembers,
    usersDataQuery,
    currentProjectId,
    refreshTasks,
  } = useProject()
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskType, setTaskType] = useState('design')
  const [leadTime, setLeadTime] = useState('')
  const [newReq, setNewReq] = useState('')
  const [requirements, setRequirements] = useState([])
  const [members, setMembers] = useState([])
  const [newMemberId, setNewMemberId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('worker')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [attachments, setAttachments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const { accessToken } = useAuth()

  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)

  const addRequirement = (req) => {
    if (req.trim() && !requirements.includes(req.trim())) {
      setRequirements((prev) => [...prev, req.trim()])
    }
  }

  const removeRequirement = (indexToRemove) => {
    setRequirements((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleFileSelect = (files) => {
    const filesArray = Array.from(files)
    const newFiles = filesArray
      .filter(
        (file) => !selectedFiles.some((existingFile) => existingFile.name === file.name)
      )
      .map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }))
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleAddMember = () => {
    if (newMemberId && newMemberRole) {
      const userExists = currentProjectMembers.find((user) => user.id === newMemberId)
      if (userExists) {
        const newMemberData = {
          user: newMemberId,
          role: newMemberRole,
          username: userExists.username,
        }
        const memberExists = members.some((member) => member.user === newMemberId)
        if (!memberExists) {
          setMembers((prev) => [...prev, newMemberData])
          setNewMemberId('')
          setNewMemberRole('worker')
        }
      }
    }
  }

  const handleRemoveMember = (indexToRemove) => {
    setMembers((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const uploadAttachments = async () => {
    setIsUploading(true)
    const uploadPromises = selectedFiles.map(async (fileObj) => {
      const formData = new FormData()
      formData.append('file', fileObj.file)
      try {
        const response = await uploadTaskAttachment(accessToken, 'temp', formData)
        return {
          filename: response.filename,
          url: response.url,
          contentType: response.contentType,
        }
      } catch (error) {
        console.error(`Failed to upload ${fileObj.name}:`, error)
        return null
      }
    })
    try {
      const results = await Promise.all(uploadPromises)
      setAttachments(results.filter((result) => result !== null))
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    const calculatedLeadTime = calculateLeadTime(dueDate)
    setLeadTime(calculatedLeadTime)
  }, [dueDate])

  useEffect(() => {
    const calculatedDueDate = calcDueDate(leadTime)
    setDueDate(calculatedDueDate)
  }, [leadTime])

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      await uploadAttachments()
      return createTask(accessToken, currentProjectId, {
        title,
        description,
        taskType,
        requirements,
        leadTime,
        dueDate,
        members,
        attachments,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      resetForm()
      refreshTasks()
    },
  })

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTaskType('design')
    setLeadTime('')
    setNewReq('')
    setRequirements([])
    setMembers([])
    setDueDate('')
    setSelectedFiles([])
    setAttachments([])
    setNewMemberId('')
    setNewMemberRole('worker')
    setShow(false)
  }

  const handleClose = () => setShow(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createTaskMutation.mutate()
  }

  if (!accessToken) {
    return <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3">Please log in to create new tasks.</div>
  }

  return (
    <div className="mx-1">
      <IconButton
        src={createTaskIcon}
        alt="Create Task"
        onClick={() => setShow(true)}
        className=""
        iconWidthREM={6}
      />

      {/* Modal */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShow(false)
          }}
        >
          <div className="bg-white rounded-lg w-full max-w-4xl border-2 border-black shadow-xl">
            <div className="flex justify-between items-center border-b-2 border-black p-4">
              <h3 className="text-xl font-bold">Create New Task</h3>
              <button onClick={handleClose} className="text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 border-b-2 border-black">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        className="w-full border-2 border-black rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Description</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your new task"
                        className="w-full border-2 border-black rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Task Type</label>
                      <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="w-full border-2 border-black rounded-md px-3 py-2"
                      >
                        <option value="design">Design</option>
                        <option value="production">Production</option>
                        <option value="quality">Quality</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full border-2 border-black rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Lead Time (days)</label>
                      <input
                        type="number"
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder="Enter estimated lead time"
                        className="w-full border-2 border-black rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Requirements</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newReq}
                      onChange={(e) => setNewReq(e.target.value)}
                      placeholder="Add a requirement"
                      className="flex-1 border-2 border-black rounded-md px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addRequirement(newReq)
                        setNewReq('')
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {requirements.map((req, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span>{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(idx)}
                          className="text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Team Members */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Team Members</label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      className="flex-1 border-2 border-black rounded-md px-3 py-2"
                    >
                      <option value="">Select user</option>
                      {currentProjectMembers?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="border-2 border-black rounded-md px-3 py-2"
                    >
                      <option value="admin">Admin</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="worker">Worker</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {members.map((member, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span>{member.username} ({member.role})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Attachments */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Attachments</label>
                  <div
                    className="border-2 border-dashed border-black p-4 text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="mx-auto mb-2" size={32} />
                    <p>Click or drag files to upload</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                  {selectedFiles.length > 0 && (
                    <ul className="mt-2 divide-y">
                      {selectedFiles.map((file, idx) => (
                        <li key={idx} className="flex justify-between py-1">
                          <span>{file.name} ({formatFileSize(file.size)})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || createTaskMutation.isPending || isUploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {createTaskMutation.isPending || isUploading ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}