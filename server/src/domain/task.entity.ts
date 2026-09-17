export interface Position3D {
  x: number;
  y: number;
  z: number;
}
export const TASK_STATUSES = ["todo", "in_progress", "review", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  position3d?: Position3D;
  modelRef?: string;
  createdAt: Date;
  updatedAt: Date;
}
