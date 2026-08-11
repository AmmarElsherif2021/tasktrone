import { DBAdapter } from '../adapter'
import { Board } from '../../domain/board.entity'

export interface CreateBoardInput {
  organizationId: string
  name: string
}

export class BoardRepository {
  constructor(private readonly db: DBAdapter) {}

  async create(input: CreateBoardInput): Promise<Board> {
    const row = await this.db.queryOne<Board>(
      'INSERT INTO boards (organization_id, name) VALUES ($1, $2) RETURNING *',
      [input.organizationId, input.name],
    )
    if (!row) throw new Error('Failed to create board')
    return row
  }

  async findById(id: string): Promise<Board | null> {
    return this.db.queryOne<Board>('SELECT * FROM boards WHERE id = $1', [id])
  }

  async findByOrganization(organizationId: string): Promise<Board[]> {
    return this.db.query<Board>('SELECT * FROM boards WHERE organization_id = $1 ORDER BY created_at DESC', [
      organizationId,
    ])
  }

  async update(id: string, changes: Partial<Pick<Board, 'name'>>): Promise<Board | null> {
    if (changes.name === undefined) {
      return this.findById(id)
    }
    return this.db.queryOne<Board>('UPDATE boards SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [
      changes.name,
      id,
    ])
  }
}
