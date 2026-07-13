import { effect, inject, Injectable } from '@angular/core'
import { ChecklistApi } from './checklist.api'
import { ChecklistState } from './checklist.state'
import { ChecklistModalState } from './checklist-modal/checklist-modal.state'
import {
	CreateChecklistRequest,
	UpdateChecklistRequest,
} from '../../models/checklist/checklist-request.model'
import { toast } from '@spartan-ng/brain/sonner'
import { ChecklistDetailResponse } from '../../models/checklist/checklist-detail-response.model'

@Injectable()
export class ChecklistFacade {
	readonly api = inject(ChecklistApi)
	readonly modalState = inject(ChecklistModalState)
	readonly state = inject(ChecklistState)

	readonly checklist = this.modalState.checklist

	readonly isEditMode = this.modalState.isEditMode
	readonly checklistDialogState = this.modalState.dialogState

	getByTask = (taskId: string) => this.state.getByTask(taskId)

	create(values: Omit<CreateChecklistRequest, 'taskId'>) {
		this.api.createChecklist({
			taskId: this.modalState.taskId()!,
			...values,
		})

		toast.success('Checklist creado')

		this.modalState.close()
	}

	update(values: Partial<Omit<UpdateChecklistRequest, 'checklistId'>>) {
		const checklist = this.modalState.checklist()

		if (!checklist) return

		this.api.updateChecklist({
			checklistId: checklist.id,
			title: values.title ?? checklist.title,
			priority: values.priority ?? checklist.priority,
		})

		toast.success('Checklist modificado')
		this.modalState.close()
	}

	save(values: Omit<CreateChecklistRequest, 'taskId'>) {
		if (this.modalState.isEditMode()) {
			this.update(values)
		} else {
			this.create(values)
		}
	}

	delete(checklistId: string) {
		this.api.deleteChecklist({ checklistId })
		toast.success('Checklist eliminado')
	}

	openCreate(taskId: string) {
		this.modalState.openForCreate(taskId)
	}

	openEdit(checklist: ChecklistDetailResponse) {
		this.modalState.openForEdit(checklist)
	}

	closeModal() {
		this.modalState.close()
	}

	setChecklists(checklists: ChecklistDetailResponse[]) {
		this.state.setChecklists(checklists)
	}

	initialize(checklists: ChecklistDetailResponse[]) {
		this.state.setChecklists(checklists)
	}
}
