import { Websocket } from '@/core/servies/websocket'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import {
	CreateChecklistRequest,
	DeleteChecklistRequest,
	UpdateChecklistRequest,
} from '../../models/checklist/checklist-request.model'
import { ChecklistDetailResponse } from '../../models/checklist/checklist-detail-response.model'
import { WsResponse } from '@/core/models/ws-response'
import { map, Observable } from 'rxjs'

@Injectable()
export class ChecklistApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	createChecklist(checklist: CreateChecklistRequest) {
		this.ws.publish(`/app/checklist.create`, checklist)
	}

	updateChecklist(checklist: UpdateChecklistRequest) {
		this.ws.publish(`/app/checklist.update`, checklist)
	}

	deleteChecklist(checklist: DeleteChecklistRequest) {
		this.ws.publish(`/app/checklist.delete`, checklist)
	}

	getChecklists(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<ChecklistDetailResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/checklists`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ChecklistDetailResponse>))
	}
}
