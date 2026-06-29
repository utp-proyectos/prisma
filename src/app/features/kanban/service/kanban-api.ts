import { Websocket } from '@/core/servies/websocket'
import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Injectable, Signal } from '@angular/core'
import { KanbanResponse } from '../models/kanban-response.model'
import { ApiResponse } from '@/core/models/api-response.model'
import { CreateKanbanRequest, UpdateKanbanRequest } from '../models/kanban-request.model'
import { map, Observable } from 'rxjs'

@Injectable()
export class KanbanApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	kanbansResource = (projectId: Signal<string | undefined>) =>
		httpResource<ApiResponse<KanbanResponse[]>>(() =>
			projectId() ? `/projects/${projectId()}/kanbans` : undefined,
		)

	kanbanDetailResource = (kanbanId: Signal<string | undefined>) =>
		httpResource<ApiResponse<KanbanResponse>>(() =>
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

	watchKanbans(projectId: string): Observable<KanbanResponse> {
		return this.ws
			.watch(`/topic/project/${projectId}/kanbans`)
			.pipe(map((res) => JSON.parse(res.body) as KanbanResponse))
	}
}
