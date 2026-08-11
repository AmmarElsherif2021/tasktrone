export type UserRole = 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  organizationId: string
  email: string
  displayName: string
  role: UserRole
  createdAt: Date
}
