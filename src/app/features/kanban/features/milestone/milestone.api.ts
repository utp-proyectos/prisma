import { ApiResponse } from '@/core/models/api-response.model'
import { Websocket } from '@/core/servies/websocket'
import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Injectable, Signal } from '@angular/core'
import { MilestoneDetailResponse } from '../../models/milestone/milestone-detail-response.model'
import {
	CreateMilestoneRequest,
	DeleteMilestoneRequest,
	UpdateMilestoneRequest,
} from '../../models/milestone/milestone-request.model'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { WsResponse } from '@/core/models/ws-response'
import { map, Observable } from 'rxjs'

@Injectable()
export class MilestoneApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	milestoneDetailResource = (milestoneId: Signal<string | null>) =>
		httpResource<ApiResponse<MilestoneDetailResponse>>(() =>
			milestoneId() ? `/milestones/${milestoneId()}` : undefined,
		)

	createMilestone(milestone: CreateMilestoneRequest) {
		this.ws.publish(`/app/milestone.create`, milestone)
	}

	updateMilestone(milestone: UpdateMilestoneRequest) {
		this.ws.publish(`/app/milestone.update`, milestone)
	}

	deleteMilestone(milestone: DeleteMilestoneRequest) {
		this.ws.publish(`/app/milestone.delete`, milestone)
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

	getMilestoneDetail(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<MilestoneDetailResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/milestones/detail`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<MilestoneDetailResponse>))
	}
}
