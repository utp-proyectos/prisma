import { inject, Injectable } from '@angular/core'
import { MilestoneRealtime } from '../features/milestone/milestone.realtime'
import { ChecklistItemRealtime } from '../features/checklist-item/checklist-item.realtime'
import { ChecklistRealtime } from '../features/checklist/checklist.realtime'
import { ColumnRealtime } from '../features/column/column.realtime'
import { TaskRealtime } from '../features/task/task.realtime'
import { KanbanBoardRealtime } from '../features/kanban/kanban.realtime'

@Injectable()
export class KanbanRealtime {
	readonly kanbanRealtime = inject(KanbanBoardRealtime)
	readonly milestoneRealtime = inject(MilestoneRealtime)
	readonly columnRealtime = inject(ColumnRealtime)
	readonly taskRealtime = inject(TaskRealtime)
	readonly checklistItemRealtime = inject(ChecklistItemRealtime)
	readonly checklistRealtime = inject(ChecklistRealtime)

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.kanbanRealtime.connect(teamId, projectId)
		this.milestoneRealtime.connect(teamId, projectId, kanbanId)
		this.columnRealtime.connect(teamId, projectId, kanbanId)
		this.taskRealtime.connect(teamId, projectId, kanbanId)
		this.checklistRealtime.connect(teamId, projectId, kanbanId)
		this.checklistItemRealtime.connect(teamId, projectId, kanbanId)
	}

	disconnect() {
		this.milestoneRealtime.disconnect()
		this.columnRealtime.disconnect()
		this.taskRealtime.disconnect()
		this.checklistRealtime.disconnect()
		this.checklistItemRealtime.disconnect()
	}
}
