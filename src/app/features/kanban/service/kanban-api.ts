import { Websocket } from '@/core/servies/websocket'
import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Injectable, Signal } from '@angular/core'
import { KanbanResponse } from '../models/kanban-response.model'
import { ApiResponse } from '@/core/models/api-response.model'
import { CreateKanbanRequest, UpdateKanbanRequest } from '../models/kanban-request.model'
import { map, Observable } from 'rxjs'
import { WsResponse } from '@/core/models/ws-response'
import { KanbanDetailResponse } from '../models/kanban-detail-response.model'
import { CreateMilestoneRequest } from '../models/milestone/milestone-request.model'
import { MilestoneSummaryResponse } from '../models/milestone/milestone-summary-response.model'

@Injectable()
export class KanbanApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	kanbansResource = (projectId: Signal<string | undefined>) =>
		httpResource<ApiResponse<KanbanResponse[]>>(() =>
			projectId() ? `/projects/${projectId()}/kanbans` : undefined,
		)

	kanbanDetailResource = (kanbanId: Signal<string | undefined>) =>
		httpResource<ApiResponse<KanbanDetailResponse>>(() =>
			kanbanId() ? `/kanbans/${kanbanId()}` : undefined,
		)

	createKanban(kanban: CreateKanbanRequest) {
		this.ws.publish('/app/kanban.create', kanban)
	}

	updateKanban(kanban: UpdateKanbanRequest) {
		this.ws.publish('/app/kanban.update', kanban)
	}

	deleteKanban(kanbanId: string) {
		this.ws.publish('/app/kanban.delete', {
			kanbanId,
		})
	}

	getKanbans(projectId: string, teamId: string): Observable<WsResponse<KanbanResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/kanbans`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<KanbanResponse>))
	}

	//Para milestones
	createMilestone(milestone: CreateMilestoneRequest) {
		console.log(milestone)
		this.ws.publish(`/app/milestone.create`, milestone)
	}

	getMilestones(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<MilestoneSummaryResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/milestones`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<MilestoneSummaryResponse>))
	}
}
