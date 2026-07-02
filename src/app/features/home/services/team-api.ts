import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Injectable, Service, Signal } from '@angular/core'
import { TeamResponse } from '../models/team-response.model'

import { ApiResponse } from '@/core/models/api-response.model'
import { TeamRequest } from '../models/team-request.model'
import { firstValueFrom, map, Observable, tap } from 'rxjs'
import { TeamDetailResponse } from '../models/team-detail-response'
import { Websocket } from '@/core/servies/websocket'
import { ProjectResponse } from '../models/project-response'
import { ProjectRequest } from '../models/project-request'
import { InviteMemberRequest } from '../models/invite-member-request'

@Injectable()
export class TeamApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	teamResource = httpResource<ApiResponse<TeamResponse[]>>(() => '/teams')

	teamDetailResource = (teamId: Signal<string | undefined>) =>
		httpResource<ApiResponse<TeamDetailResponse>>(() =>
			teamId() ? `/teams/${teamId()}` : undefined,
		)

	createTeam = (team: TeamRequest) =>
		firstValueFrom(
			this.http.post<ApiResponse<TeamResponse>>('/teams', team).pipe(
				tap(() => this.teamResource.reload()),
				map((res) => res.data),
			),
		)

	inviteMember = (teamId: string, invitation: InviteMemberRequest) =>
		firstValueFrom(this.http.post(`/teams/${teamId}/invite`, invitation))

	getProjects(teamId: string): Observable<ProjectResponse> {
		return this.ws
			.watch(`/topic/${teamId}/projects`)
			.pipe(map((res) => JSON.parse(res.body) as ProjectResponse))
	}

	sendProject(project: ProjectRequest) {
		this.ws.publish(`/app/project.create`, project)
	}
}
