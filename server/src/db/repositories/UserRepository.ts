import { DBAdapter } from '../adapter'
import { User, UserRole } from '../../domain/user.entity'

export interface CreateUserInput {
  organizationId: string
  email: string
  displayName: string
  role: UserRole
}

export class UserRepository {
  constructor(private readonly db: DBAdapter) {}

  async create(input: CreateUserInput): Promise<User> {
    const row = await this.db.queryOne<User>(
      'INSERT INTO users (organization_id, email, display_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [input.organizationId, input.email, input.displayName, input.role],
    )
    if (!row) throw new Error('Failed to create user')
    return row
  }

  async findById(id: string): Promise<User | null> {
    return this.db.queryOne<User>('SELECT * FROM users WHERE id = $1', [id])
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    return this.db.query<User>('SELECT * FROM users WHERE organization_id = $1 ORDER BY created_at DESC', [
      organizationId,
    ])
  }

  async update(id: string, changes: Partial<Pick<User, 'displayName' | 'role'>>): Promise<User | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let i = 1

    if (changes.displayName !== undefined) {
      fields.push(`display_name = $${i++}`)
      values.push(changes.displayName)
    }
    if (changes.role !== undefined) {
      fields.push(`role = $${i++}`)
      values.push(changes.role)
    }

    if (fields.length === 0) {
      return this.findById(id)
    }

    values.push(id)
    return this.db.queryOne<User>(`UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values)
  }
}
