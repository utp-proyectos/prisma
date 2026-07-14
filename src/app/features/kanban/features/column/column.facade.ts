import { inject, Injectable } from '@angular/core'
import { ColumnApi } from './column.api'
import { ColumnModalState } from './column-modal/column-modal.state'
import {
	CreateColumnKanbanRequest,
	UpdateColumnKanbanRequest,
} from '../../models/column-kanban/column-kanban-request.model'
import { toast } from '@spartan-ng/brain/sonner'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { ColumnTaskState } from '../column-task/column-task-state'

@Injectable()
export class ColumnFacade {
	readonly api = inject(ColumnApi)
	readonly modalState = inject(ColumnModalState)
	readonly state = inject(ColumnTaskState)

	readonly column = this.modalState.column

	readonly columns = this.state.columns
	readonly connectedLists = this.state.connectedLists

	readonly isEditMode = this.modalState.isEditMode
	readonly columnDialogState = this.modalState.dialogState
	readonly mode = this.modalState.mode

	create(values: Omit<CreateColumnKanbanRequest, 'kanbanId'>, kanbanId: string) {
		this.api.createColumn({
			kanbanId,
			...values,
		})

		toast.success('Columna creada')

		this.modalState.close()
	}

	setColumns(columns: ColumnKanbanDetailResponse[]) {
		this.state.setColumns(columns)
	}

	update(values: Partial<Omit<UpdateColumnKanbanRequest, 'columnId'>>) {
		const column = this.modalState.column()

		if (!column) return

		this.api.updateColumn({
			columnId: column.id,
			title: values.title ?? column.title,
		})

		toast.success('Columna modificada')
		this.modalState.close()
	}

	save(values: Omit<CreateColumnKanbanRequest, 'kanbanId'>, kanbanId: string) {
		if (this.modalState.isEditMode()) {
			this.update(values)
		} else {
			this.create(values, kanbanId)
		}
	}

	delete(columnId: string) {
		this.api.deleteColumn({ columnId })
		toast.success('Columna eliminado')
	}

	openCreate() {
		this.modalState.openForCreate()
	}

	openEdit(column: ColumnKanbanDetailResponse) {
		this.modalState.openForEdit(column)
	}

	closeModal() {
		this.modalState.close()
	}
}
