export interface Position3D {
  x: number
  y: number
  z: number
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export interface Task {
  id: string
  boardId: string
  title: string
  description?: string
  status: TaskStatus
  position3d?: Position3D
  modelRef?: string
  createdAt: Date
  updatedAt: Date
}
