import { Websocket } from '@/core/servies/websocket'
import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Injectable, Signal } from '@angular/core'
import { KanbanResponse } from '../models/kanban-response.model'
import { ApiResponse } from '@/core/models/api-response.model'
import { CreateKanbanRequest, UpdateKanbanRequest } from '../models/kanban-request.model'
import { map, Observable } from 'rxjs'
import { WsResponse } from '@/core/models/ws-response'
import { KanbanDetailResponse } from '../models/kanban-detail-response.model'
import {
	CreateMilestoneRequest,
	DeleteMilestoneRequest,
	UpdateMilestoneRequest,
} from '../models/milestone/milestone-request.model'
import { MilestoneSummaryResponse } from '../models/milestone/milestone-summary-response.model'
import {
	CreateColumnKanbanRequest,
	DeleteColumnKanbanRequest,
	UpdateColumnKanbanRequest,
} from '../models/column-kanban/column-kanban-request.model'
import { ColumnKanbanDetailResponse } from '../models/column-kanban/column-kanban-detail-response.model'
import {
	CreateTaskRequest,
	DeleteTaskRequest,
	UpdateTaskRequest,
} from '../models/task/task-request.model'
import { TaskDetailResponse } from '../models/task/task-detail-response.model'
import { ReorderColumnsRequest, ReorderTasksRequest } from '../models/reorder.model'
import { MilestoneDetailResponse } from '../models/milestone/milestone-detail-response.model'

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

	// MILESTONES
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

	// COLUMNS
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

	// TASKS
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

	// Metodos para reordenar columnas y tareas
	getColumnsReorder(
		teamId: string,
		projectId: string,
		kanbanId: string,
	): Observable<WsResponse<ColumnKanbanDetailResponse[]>> {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${kanbanId}/columns/reorder`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ColumnKanbanDetailResponse[]>))
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

	reorderColumns(payload: ReorderColumnsRequest) {
		this.ws.publish('/app/columnKanban.reorder', payload)
	}

	reorderTasks(payload: ReorderTasksRequest) {
		this.ws.publish('/app/task.reorder', payload)
	}
}
