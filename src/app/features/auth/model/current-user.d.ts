import { User } from '@/core/models/user.model'

export type CurrentUser = Omit<User, 'token'>
