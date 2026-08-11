import { IsEmail, IsIn, IsString, IsUUID, MaxLength } from 'class-validator'
import { UserRole } from '../user.entity'

const USER_ROLES: UserRole[] = ['admin', 'member', 'viewer']

export class CreateUserDto {
  @IsUUID()
  organizationId!: string

  @IsEmail()
  email!: string

  @IsString()
  @MaxLength(255)
  displayName!: string

  @IsIn(USER_ROLES)
  role!: UserRole
}
