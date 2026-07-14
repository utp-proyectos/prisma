import { inject, Injectable } from '@angular/core'
import { ColumnApi } from './column.api'
import { Subscription } from 'rxjs'
import { ColumnTaskState } from '../column-task/column-task-state'

@Injectable()
export class ColumnRealtime {
	private readonly api = inject(ColumnApi)
	private readonly columnTaskState = inject(ColumnTaskState)

	private columnSub?: Subscription
	private columnReorderSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectColumns(teamId, projectId, kanbanId)
		this.connectColumnReorder(teamId, projectId, kanbanId)
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

	disconnect() {
		this.columnSub?.unsubscribe()
		this.columnReorderSub?.unsubscribe()
	}
}
