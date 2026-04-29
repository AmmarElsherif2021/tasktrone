/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UploadCloud, X, UserPlus } from 'lucide-react'
import { calculateLeadTime, calcDueDate } from '../../Ui/utils'
import { createTask, uploadTaskAttachment } from '../../API/tasks'
import createTaskIcon from '../../assets/create-task.svg'
import { useProject } from '../../contexts/ProjectContext'
import IconButton from '../../Ui/IconButton'
import { coldBtn } from '../../Ui/componentStyles'
import { Input, Textarea, Select, Label } from '../../Ui/FormUi'
import { Modal } from '../../Ui/Modal'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Generates a simple task number like "TASK-00042" using the current timestamp.
 * Replace with a server-side sequence if you prefer guaranteed uniqueness.
 */
const generateTaskNumber = () =>
  `TASK-${String(Date.now()).slice(-5)}`

// ── Domain enums (matching task_category_enum in the DB) ─────────────────────
const TASK_CATEGORIES = [
  'cad_models',
  'design_specifications',
  'bom',
  'change_requests',
  'cnc_programming',
  'tool_instructions',
  'process_plans',
  'production_layouts',
  'improvement_reports',
  'machined_parts',
  'tool_logs',
  'production_output',
  'setup_documentation',
  'production_schedules',
  'performance_records',
  'inspections',
  'calibration_records',
  'spc_charts',
  'inventory_reports',
  'order_processing',
  'vendor_reports',
  'capacity_planning',
  'maintenance_logs',
  'equipment_schedules',
  'employee_records',
  'shipment_schedules',
  'logistics_reports',
]

// Matches task_assignment_role_enum
const TASK_ASSIGNMENT_ROLES = [
  'primary_assignee',
  'reviewer',
  'supporter',
  'approver',
]

// ── Custom hook ───────────────────────────────────────────────────────────────
function useCreateTask() {
  const {
    currentProjectMembers,   // populated by ProjectContext via getProjectById join
    currentProjectId,
    currentPhase,
    refreshTasks,
    boards,                  // resolved board_id
    user,                    // authenticated user (for created_by & uploaded_by)
  } = useProject()
  const queryClient = useQueryClient()

  // ── Task fields ────────────────────────────────────────────────────────
  const [title, setTitle]               = useState('')
  const [description, setDescription]   = useState('')
  const [taskCategory, setTaskCategory] = useState(TASK_CATEGORIES[0])
  const [leadTime, setLeadTime]         = useState('')
  const [dueDate, setDueDate]           = useState('')
  const [priority, setPriority]         = useState('medium')

  // ── Task members ───────────────────────────────────────────────────────
  const [members, setMembers]           = useState([])
  const [newMemberId, setNewMemberId]   = useState('')
  const [newMemberRole, setNewMemberRole] = useState(TASK_ASSIGNMENT_ROLES[0])

  // ── Files ──────────────────────────────────────────────────────────────
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isUploading, setIsUploading]   = useState(false)

  // ── Requirements ───────────────────────────────────────────────────────
  const [newReq, setNewReq]             = useState('')
  const [requirements, setRequirements] = useState([])
  //Boards
  // Default board: prefer phase‑matching, else first board
  const defaultBoard = boards.find(b => b.phase === currentPhase) ?? boards[0]
  const [boardId, setBoardId] = useState(defaultBoard?.id ?? '')

  // Update default when boards or phase change
  useEffect(() => {
    if (!boardId && defaultBoard) {
      setBoardId(defaultBoard.id)
    }
  }, [defaultBoard, boardId])
  // ── Lead-time / due-date sync ──────────────────────────────────────────
  useEffect(() => {
    if (dueDate) setLeadTime(calculateLeadTime(dueDate))
  }, [dueDate])

  useEffect(() => {
    if (leadTime) setDueDate(calcDueDate(leadTime))
  }, [leadTime])

  // ── Handlers ───────────────────────────────────────────────────────────
  const addRequirement = (req) => {
    const trimmed = req.trim()
    if (trimmed && !requirements.includes(trimmed))
      setRequirements(prev => [...prev, trimmed])
  }
  const removeRequirement = (idx) =>
    setRequirements(prev => prev.filter((_, i) => i !== idx))

  const handleFileSelect = (files) => {
    const next = Array.from(files)
      .filter(f => !selectedFiles.some(ex => ex.name === f.name))
      .map(f => ({ name: f.name, size: f.size, type: f.type, file: f }))
    setSelectedFiles(prev => [...prev, ...next])
  }
  const removeFile = (idx) =>
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx))

  const handleAddMember = () => {
    if (!newMemberId) return
    const projectMember = currentProjectMembers.find(m => m.user_id === newMemberId)
    if (!projectMember) return
    if (members.some(m => m.user_id === newMemberId)) {
      alert('This member is already added.')
      return
    }
    setMembers(prev => [
      ...prev,
      {
        user_id:  newMemberId,
        role:     newMemberRole,
        username: projectMember.username,
        full_name: projectMember.full_name,
      },
    ])
    setNewMemberId('')
    setNewMemberRole(TASK_ASSIGNMENT_ROLES[0])
  }
  const handleRemoveMember = (idx) =>
    setMembers(prev => prev.filter((_, i) => i !== idx))

  // ── Resolve board_id (use default board for current phase) ─────────────
  const resolveBoardId = () => {
    if (!boards?.length) return null
    // Prefer a board whose phase matches currentPhase, otherwise fall back to first
    const phaseBoard = boards.find(b => b.phase === currentPhase)
    return (phaseBoard ?? boards[0])?.id ?? null
  }

  // ── Upload attachments after task creation ─────────────────────────────
  const uploadAttachments = async (taskId) => {
    if (!selectedFiles.length) return
    setIsUploading(true)
    try {
      await Promise.all(
        selectedFiles.map(({ file }) =>
          uploadTaskAttachment(taskId, file, user?.id)
        )
      )
    } finally {
      setIsUploading(false)
    }
  }

  // ── Reset form ─────────────────────────────────────────────────────────
  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTaskCategory(TASK_CATEGORIES[0])
    setLeadTime('')
    setDueDate('')
    setPriority('medium')
    setMembers([])
    setNewMemberId('')
    setNewMemberRole(TASK_ASSIGNMENT_ROLES[0])
    setSelectedFiles([])
    setRequirements([])
    setNewReq('')
  }

  // ── Create-task mutation ───────────────────────────────────────────────
  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const boardId = resolveBoardId()
      if (!boardId) throw new Error('No board found for this project. Please create a board first.')
      if (!user?.id) throw new Error('You must be logged in to create a task.')

      const taskPayload = {
        title:         title.trim(),
        description:   description.trim() || null,
        task_number:   generateTaskNumber(),   // required NOT NULL
        task_category: taskCategory,           // task_category_enum
        phase:         currentPhase? currentPhase : 'concept_design',           // manufacturing_phase enum
        status:        'todo',
        priority,
        board_id:      boardId,                // required NOT NULL
        created_by:    user.id,                // required NOT NULL
        lead_time:     leadTime ? parseInt(leadTime, 10) : null,
        due_date:      dueDate || null,
      }

      // createTask now accepts members as a second arg and inserts task_members rows
      const createdTask = await createTask(currentProjectId, taskPayload, members)

      // Upload attachments linked to the real task id
      if (selectedFiles.length > 0) {
        await uploadAttachments(createdTask.id)
      }

      return createdTask
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', currentProjectId])
      refreshTasks()
      resetForm()
    },
  })

  return {
    form: {
      title, setTitle,
      description, setDescription,
      taskCategory, setTaskCategory,
      leadTime, setLeadTime,
      dueDate, setDueDate,
      priority, setPriority,
      newReq, setNewReq,
      requirements, addRequirement, removeRequirement,
      members, newMemberId, setNewMemberId, newMemberRole, setNewMemberRole,
      handleAddMember, handleRemoveMember,
      selectedFiles, handleFileSelect, removeFile,
      setSelectedFiles,
      isUploading,
      boardId,
      setBoardId,
      boards,  
    },
    mutation: createTaskMutation,
    currentProjectMembers,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export function CreateTask() {
  const [show, setShow] = useState(false)
  const { form, mutation: createTaskMutation, currentProjectMembers } = useCreateTask()

  const handleClose = () => setShow(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    createTaskMutation.mutate(undefined, { onSuccess: handleClose })
  }

  // Members that have NOT been added to this task yet (for the dropdown)
  const availableMembers = currentProjectMembers.filter(
    pm => !form.members.some(m => m.user_id === pm.user_id)
  )

  return (
    <div className="mx-1">
      <IconButton
        src={createTaskIcon}
        alt="Create Task"
        onClick={() => setShow(true)}
        iconWidthREM={6}
      />

      <Modal isOpen={show} onClose={handleClose} title="Create New Task">
        <form onSubmit={handleSubmit}>

          {/* ── Core fields ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="mb-3">
                <Label>Title *</Label>
                <Input
                  type="text"
                  value={form.title}
                  onChange={e => form.setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="mb-3">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={e => form.setDescription(e.target.value)}
                  placeholder="Describe the task"
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <Label>Category</Label>
                <Select
                  value={form.taskCategory}
                  onChange={e => form.setTaskCategory(e.target.value)}
                >
                  {TASK_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mb-3">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onChange={e => form.setPriority(e.target.value)}
                >
                  {['low', 'medium', 'high', 'critical'].map(p => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mb-3">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={e => form.setDueDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <Label>Lead Time (days)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.leadTime}
                  onChange={e => form.setLeadTime(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </div>
          {/* ── Board Selection ───────────────────────────────────────── */}
          <div className="mb-4">
            <Label>Board *</Label>
            {form.boards.length === 0 ? (
              <p className="text-sm opacity-60">
                No boards available. Please create a board for this project first.
              </p>
            ) : (
              <Select
                value={form.boardId}
                onChange={(e) => form.setBoardId(e.target.value)}
                required
              >
                <option value="">-- Select a Board --</option>
                {form.boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name} ({board.phase.replace(/_/g, ' ')})
                  </option>
                ))}
              </Select>
            )}
          </div>
          {/* ── Team Members ─────────────────────────────────────────── */}
          <div className="mb-4">
            <Label>Team Members</Label>

            {currentProjectMembers.length === 0 ? (
              <p className="text-sm opacity-60 mb-2">
                No project members found. Add members to the project first.
              </p>
            ) : (
              <div className="flex gap-2 mb-2 flex-wrap">
                <Select
                  value={form.newMemberId}
                  onChange={e => form.setNewMemberId(e.target.value)}
                  className="flex-1 min-w-0"
                >
                  <option value="">
                    {availableMembers.length === 0
                      ? 'All members added'
                      : 'Select a project member'}
                  </option>
                  {availableMembers.map(pm => (
                    <option key={pm.user_id} value={pm.user_id}>
                      {pm.full_name
                        ? `${pm.full_name} (@${pm.username})`
                        : `@${pm.username}`}
                    </option>
                  ))}
                </Select>

                <Select
                  value={form.newMemberRole}
                  onChange={e => form.setNewMemberRole(e.target.value)}
                >
                  {TASK_ASSIGNMENT_ROLES.map(role => (
                    <option key={role} value={role}>
                      {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </Select>

                <button
                  type="button"
                  style={coldBtn('primary')}
                  onClick={form.handleAddMember}
                  disabled={!form.newMemberId || availableMembers.length === 0}
                  title="Add member"
                >
                  <UserPlus size={15} />
                </button>
              </div>
            )}

            {form.members.length > 0 && (
              <ul className="space-y-1">
                {form.members.map((member, idx) => (
                  <li
                    key={member.user_id}
                    className="flex justify-between items-center text-sm px-2 py-1 rounded border border-card-border"
                  >
                    <span>
                      <span className="font-medium">
                        {member.full_name || `@${member.username}`}
                      </span>
                      <span className="opacity-60 ml-2">
                        {member.role.replace(/_/g, ' ')}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => form.handleRemoveMember(idx)}
                      className="text-role-admin hover:opacity-80"
                      title="Remove member"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Requirements ─────────────────────────────────────────── */}
          <div className="mb-4">
            <Label>Requirements</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={form.newReq}
                onChange={e => form.setNewReq(e.target.value)}
                placeholder="Add a requirement"
                className="flex-1"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    form.addRequirement(form.newReq)
                    form.setNewReq('')
                  }
                }}
              />
              <button
                type="button"
                style={coldBtn('primary')}
                onClick={() => {
                  form.addRequirement(form.newReq)
                  form.setNewReq('')
                }}
              >
                Add
              </button>
            </div>
            {form.requirements.length > 0 && (
              <ul className="space-y-1">
                {form.requirements.map((req, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => form.removeRequirement(idx)}
                      style={coldBtn('danger')}
                      className="text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Attachments ──────────────────────────────────────────── */}
          <div className="mb-4">
            <Label>Attachments</Label>
            <div className="flex items-center gap-2 mb-2">
              <label className="cursor-pointer flex items-center gap-1 px-3 py-1 border border-card-border hover:bg-card-bg transition-colors">
                <UploadCloud size={16} />
                <span className="text-sm font-mono">Choose Files</span>
                <input
                  type="file"
                  multiple
                  onChange={e => form.handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </label>
              {form.selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => form.setSelectedFiles([])}
                  style={coldBtn('secondary')}
                  className="text-sm"
                >
                  Clear ({form.selectedFiles.length})
                </button>
              )}
            </div>
            <ul className="space-y-1">
              {form.selectedFiles.map((file, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm font-mono">
                  <span>{file.name} ({formatFileSize(file.size)})</span>
                  <button
                    type="button"
                    onClick={() => form.removeFile(idx)}
                    className="text-role-admin hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Error feedback ───────────────────────────────────────── */}
          {createTaskMutation.isError && (
            <p className="text-sm text-red-500 mb-3">
              {createTaskMutation.error?.message ?? 'Failed to create task.'}
            </p>
          )}

          {/* ── Actions ──────────────────────────────────────────────── */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              style={coldBtn('secondary')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || createTaskMutation.isPending || form.isUploading}
              style={coldBtn('primary')}
              className="disabled:opacity-50"
            >
              {createTaskMutation.isPending || form.isUploading
                ? 'Creating…'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}