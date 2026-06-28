import { ProjectResponse } from './project-response'
import { TeamMemberResponse } from './team-member-response'

export interface TeamDetailResponse {
	id: string
	name: string
	members: TeamMemberResponse[]
	projects: ProjectResponse[]
}
