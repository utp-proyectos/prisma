import { Websocket } from '@/core/servies/websocket'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import {
	CreateTaskRequest,
	DeleteTaskRequest,
	UpdateTaskRequest,
} from '../../models/task/task-request.model'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { WsResponse } from '@/core/models/ws-response'
import { map, Observable } from 'rxjs'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { ReorderTasksRequest } from '../../models/reorder.model'

@Injectable()
export class TaskApi {
	http = inject(HttpClient)
	ws = inject(Websocket)

	createTask(task: CreateTaskRequest) {
		this.ws.publish(`/app/task.create`, task)
	}

	updateTask(task: UpdateTaskRequest) {
		this.ws.publish(`/app/task.update`, task)
	}

	deleteTask(task: DeleteTaskRequest) {
		this.ws.publish(`/app/task.delete`, task)
	}

	getTasks(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<TaskDetailResponse>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/tasks`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<TaskDetailResponse>))
	}

	getTasksReorder(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<ColumnKanbanDetailResponse[]>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/tasks/reorder`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ColumnKanbanDetailResponse[]>))
	}

	reorderTasks(payload: ReorderTasksRequest) {
		this.ws.publish('/app/task.reorder', payload)
	}
}
