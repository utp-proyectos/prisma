import { inject, Injectable } from '@angular/core'
import { KanbanApi } from './kanban-api'
import { MilestoneState } from './milestone/milestone-state'
import { Subscription } from 'rxjs'
import { ColumnTaskState } from './column-task/column-task-state'
import { ChecklistState } from './checklist/checklist-state'
import { ChecklistItemState } from './checklist-item/checklist-item-state'

@Injectable()
export class KanbanRealtime {
	private readonly api = inject(KanbanApi)
	private readonly milestoneState = inject(MilestoneState)
	private readonly columnTaskState = inject(ColumnTaskState)
	private readonly checklistState = inject(ChecklistState)
	private readonly checklistItemState = inject(ChecklistItemState)

	private milestoneSub?: Subscription
	private milestoneDetailSub?: Subscription
	private columnSub?: Subscription
	private taskSub?: Subscription
	private columnReorderSub?: Subscription
	private taskReorderSub?: Subscription
	private checklistSub?: Subscription
	private checklistItemSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectMilestones(teamId, projectId, kanbanId)
		this.connectMilestoneDetail(teamId, projectId, kanbanId)
		this.connectColumns(teamId, projectId, kanbanId)
		this.connectTasks(teamId, projectId, kanbanId)
		this.connectColumnReorder(teamId, projectId, kanbanId)
		this.connectTaskReorder(teamId, projectId, kanbanId)
		this.connectChecklists(teamId, projectId, kanbanId)
		this.connectChecklistItems(teamId, projectId, kanbanId)
	}

	connectMilestones(teamId: string, projectId: string, kanbanId: string) {
		this.milestoneSub?.unsubscribe()

		this.milestoneSub = this.api.getMilestones(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.milestoneState.addMilestone(event.payload)
					break

				case 'UPDATE':
					this.milestoneState.updateMilestone(event.payload)
					break

				case 'DELETE':
					this.milestoneState.removeMilestone(event.payload)
					this.columnTaskState.disassociateMilestoneFromTasks(event.payload.id)
					break
			}
		})
	}

	private connectMilestoneDetail(teamId: string, projectId: string, kanbanId: string) {
		this.milestoneDetailSub?.unsubscribe()

		this.milestoneDetailSub = this.api
			.getMilestoneDetail(teamId, projectId, kanbanId)
			.subscribe((event) => {
				if (event.action !== 'UPDATE') return

				const selected = this.milestoneState.selectedMilestoneId()

				if (!selected) return

				if (selected !== event.payload.id) return

				this.milestoneState.setDetail(event.payload)
			})
	}

	connectColumns(teamId: string, projectId: string, kanbanId: string) {
		this.columnSub?.unsubscribe()

		this.columnSub = this.api.getColumnsKanban(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.columnTaskState.addColumn(event.payload)
					break

				case 'UPDATE':
					this.columnTaskState.replaceColumn(event.payload)
					break

				case 'DELETE':
					this.columnTaskState.removeColumn(event.payload)
					break
			}
		})
	}

	connectTasks(teamId: string, projectId: string, kanbanId: string) {
		this.taskSub?.unsubscribe()

		this.taskSub = this.api.getTasks(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.columnTaskState.addTask(event.payload)
					break

				case 'UPDATE':
					const oldTask = this.columnTaskState.findTask(event.payload.id)
					if (!oldTask) return

					this.columnTaskState.replaceTask(oldTask, event.payload)
					break

				case 'DELETE':
					this.columnTaskState.removeTask(event.payload)
					break
			}
		})
	}

	private connectChecklists(teamId: string, projectId: string, kanbanId: string) {
		this.checklistSub?.unsubscribe()

		this.checklistSub = this.api.getChecklists(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.checklistState.addChecklist(event.payload)
					break

				case 'UPDATE':
					this.checklistState.updateChecklist(event.payload)
					break

				case 'DELETE':
					this.checklistState.removeChecklist(event.payload.id, event.payload.taskId)
					break
			}
		})
	}

	private connectChecklistItems(teamId: string, projectId: string, kanbanId: string) {
		this.checklistItemSub?.unsubscribe()

		this.checklistItemSub = this.api
			.getChecklistItems(teamId, projectId, kanbanId)
			.subscribe((event) => {
				switch (event.action) {
					case 'CREATE':
						this.checklistItemState.addItem(event.payload)
						break

					case 'UPDATE':
						this.checklistItemState.updateItem(event.payload)
						break

					case 'DELETE':
						this.checklistItemState.removeItem(event.payload.id, event.payload.checklistId)
						break
				}
			})
	}

	connectColumnReorder(teamId: string, projectId: string, kanbanId: string) {
		this.columnReorderSub?.unsubscribe()

		this.columnReorderSub = this.api
			.getColumnsReorder(teamId, projectId, kanbanId)
			.subscribe((event) => {
				if (event.action === 'REORDER') {
					this.columnTaskState.replaceColumns(event.payload)
				}
			})
	}

	connectTaskReorder(teamId: string, projectId: string, kanbanId: string) {
		this.taskReorderSub?.unsubscribe()

		this.taskReorderSub = this.api
			.getTasksReorder(teamId, projectId, kanbanId)
			.subscribe((event) => {
				if (event.action === 'REORDER') {
					this.columnTaskState.replaceColumns(event.payload)
				}
			})
	}

	disconnect() {
		this.milestoneSub?.unsubscribe()
		this.milestoneDetailSub?.unsubscribe()
		this.columnSub?.unsubscribe()
		this.taskSub?.unsubscribe()
		this.columnReorderSub?.unsubscribe()
		this.taskReorderSub?.unsubscribe()
		this.checklistSub?.unsubscribe()
	}
}
