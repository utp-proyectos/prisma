import { inject, Injectable } from '@angular/core'
import { KanbanApi } from './kanban.api'
import { KanbanModalState } from './kanban-modal/kanban-modal-state'
import { KanbanState } from './kanban.state'
import { KanbanDetailResponse } from '../../models/kanban-detail-response.model'
import { KanbanResponse } from '../../models/kanban-response.model'
import { CreateKanbanRequest, UpdateKanbanRequest } from '../../models/kanban-request.model'
import { toast } from '@spartan-ng/brain/sonner'

@Injectable()
export class KanbanFacade {
	readonly api = inject(KanbanApi)
	readonly modalState = inject(KanbanModalState)
	readonly state = inject(KanbanState)

	readonly kanban = this.modalState.kanban

	readonly isEditMode = this.modalState.isEditMode
	readonly kanbanDialogState = this.modalState.dialogState

	create(values: Omit<CreateKanbanRequest, 'projectId'>, projectId: string) {
		this.api.createKanban({
			projectId,
			...values,
		})

		toast.success('Tablero creado')

		this.modalState.close()
	}

	update(values: Partial<Omit<UpdateKanbanRequest, 'kanbanId'>>) {
		const kanban = this.modalState.kanban()

		if (!kanban) return

		this.api.updateKanban({
			kanbanId: kanban.id,
			name: values.name ?? kanban.name,
			privateSwitch: values.privateSwitch ?? kanban.privateSwitch,
		})

		toast.success('Tablero modificado')

		this.modalState.close()
	}

	save(values: Omit<CreateKanbanRequest, 'projectId'>, projectId: string) {
		if (this.modalState.isEditMode()) {
			this.update(values)
		} else {
			this.create(values, projectId)
		}
	}

	delete(kanbanId: string) {
		this.api.deleteKanban(kanbanId)
		this.modalState.close()
	}

	openCreate() {
		this.modalState.openForCreate()
	}

	openEdit(kanban: KanbanDetailResponse) {
		this.modalState.openForEdit(kanban)
	}

	closeModal() {
		this.modalState.close()
	}

	setKanbans(kanbans: KanbanResponse[]) {
		this.state.setKanbans(kanbans)
	}

	initialize(kanbans: KanbanResponse[]) {
		this.state.setKanbans(kanbans)
	}
}
