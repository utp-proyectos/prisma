import { MemberRole } from '@/shared/models/member-role'

export interface TeamMemberResponse {
	id: string
	name: string
	lastName: string
	email: string
	username: string
	avatar: string
	role: MemberRole
}
