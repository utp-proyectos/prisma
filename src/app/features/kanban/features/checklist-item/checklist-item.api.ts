import { Websocket } from '@/core/servies/websocket'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { WsResponse } from '@/core/models/ws-response'
import { map, Observable } from 'rxjs'
import {
	CreateChecklistItemRequest,
	DeleteChecklistItemRequest,
	UpdateChecklistItemRequest,
} from '../../models/checklist-item/checklist-item-request.model'
import { ChecklistItemResponse } from '../../models/checklist-item/checklist-item-response.model'

@Injectable()
export class ChecklistItemApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	createChecklistItem(item: CreateChecklistItemRequest) {
		console.log('createChecklistItem', item)
		this.ws.publish(`/app/checklistItem.create`, item)
	}

	updateChecklistItem(item: UpdateChecklistItemRequest) {
		this.ws.publish(`/app/checklistItem.update`, item)
	}

	deleteChecklistItem(item: DeleteChecklistItemRequest) {
		this.ws.publish(`/app/checklistItem.delete`, item)
	}

	getChecklistItems(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<ChecklistItemResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/checklistItems`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ChecklistItemResponse>))
	}
}
