import { ProjectResponse } from './project-response'
import { TeamMemberResponse } from './team-member-response'
import { MemberRole } from '@/shared/models/member-role'

export interface TeamDetailResponse {
	id: string
	name: string
	members: TeamMemberResponse[]
	projects: ProjectResponse[]
	userRole: MemberRole
}
