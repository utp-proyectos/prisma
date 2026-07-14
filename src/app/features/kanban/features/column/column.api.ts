import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import {
	CreateColumnKanbanRequest,
	DeleteColumnKanbanRequest,
	UpdateColumnKanbanRequest,
} from '../../models/column-kanban/column-kanban-request.model'
import { Websocket } from '@/core/servies/websocket'
import { map, Observable } from 'rxjs'
import { WsResponse } from '@/core/models/ws-response'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { ReorderColumnsRequest } from '../../models/reorder.model'

@Injectable()
export class ColumnApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	createColumn(columnKanban: CreateColumnKanbanRequest) {
		this.ws.publish(`/app/columnKanban.create`, columnKanban)
	}

	updateColumn(columnKanban: UpdateColumnKanbanRequest) {
		this.ws.publish(`/app/columnKanban.update`, columnKanban)
	}

	deleteColumn(columnKanban: DeleteColumnKanbanRequest) {
		this.ws.publish(`/app/columnKanban.delete`, columnKanban)
	}

	getColumnsKanban(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<ColumnKanbanDetailResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/columns`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ColumnKanbanDetailResponse>))
	}

	getColumnsReorder(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<ColumnKanbanDetailResponse[]>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/columns/reorder`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ColumnKanbanDetailResponse[]>))
	}

	reorderColumns(payload: ReorderColumnsRequest) {
		this.ws.publish('/app/columnKanban.reorder', payload)
	}
}
