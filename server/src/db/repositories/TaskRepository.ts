import { DBAdapter } from "../adapter";
import { Position3D, Task, TaskStatus } from "../../domain/task.entity";

export interface CreateTaskInput {
  boardId: string;
  title: string;
  description?: string;
  position3d?: Position3D;
  modelRef?: string;
}

export type UpdateTaskInput = Partial<{
  title: string;
  description: string | null;
  status: TaskStatus;
  position3d: Position3D | null;
  modelRef: string | null;
}>;

export class TaskRepository {
  constructor(private readonly db: DBAdapter) {}

  async create(input: CreateTaskInput): Promise<Task> {
    const row = await this.db.queryOne<Task>(
      `INSERT INTO tasks (board_id, title, description, status, position3d, model_ref)
       VALUES ($1, $2, $3, 'todo', $4, $5)
       RETURNING *`,
      [
        input.boardId,
        input.title,
        input.description ?? null,
        input.position3d ? JSON.stringify(input.position3d) : null,
        input.modelRef ?? null,
      ],
    );
    if (!row) throw new Error("Failed to create task");
    return row;
  }

  async findById(id: string): Promise<Task | null> {
    return this.db.queryOne<Task>("SELECT * FROM tasks WHERE id = $1", [id]);
  }

  async findByBoard(boardId: string): Promise<Task[]> {
    return this.db.query<Task>(
      "SELECT * FROM tasks WHERE board_id = $1 ORDER BY created_at DESC",
      [boardId],
    );
  }

  async update(id: string, changes: UpdateTaskInput): Promise<Task | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (changes.title !== undefined) {
      fields.push(`title = $${i++}`);
      values.push(changes.title);
    }
    if (changes.description !== undefined) {
      fields.push(`description = $${i++}`);
      values.push(changes.description);
    }
    if (changes.status !== undefined) {
      fields.push(`status = $${i++}`);
      values.push(changes.status);
    }
    if (changes.position3d !== undefined) {
      fields.push(`position3d = $${i++}`);
      values.push(
        changes.position3d ? JSON.stringify(changes.position3d) : null,
      );
    }
    if (changes.modelRef !== undefined) {
      fields.push(`model_ref = $${i++}`);
      values.push(changes.modelRef);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = NOW()");
    values.push(id);

    return this.db.queryOne<Task>(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values,
    );
  }
}
