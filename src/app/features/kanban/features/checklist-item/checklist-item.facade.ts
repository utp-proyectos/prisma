import { effect, inject, Injectable } from '@angular/core'
import { ChecklistItemModalState } from './checklist-item-modal/checklist-item-modal.state'
import { ChecklistItemApi } from './checklist-item.api'
import { ChecklistItemState } from './checklist-item.state'
import {
	CreateChecklistItemRequest,
	UpdateChecklistItemRequest,
} from '../../models/checklist-item/checklist-item-request.model'
import { toast } from '@spartan-ng/brain/sonner'
import { ChecklistItemResponse } from '../../models/checklist-item/checklist-item-response.model'

@Injectable()
export class ChecklistItemFacade {
	private readonly api = inject(ChecklistItemApi)
	private readonly modalState = inject(ChecklistItemModalState)
	private readonly state = inject(ChecklistItemState)

	readonly checklistItem = this.modalState.checklistItem

	readonly isEditMode = this.modalState.isEditMode
	readonly checklistItemDialogState = this.modalState.dialogState
	readonly checklistId = this.modalState.checklistId

	getChecklistItems = (checklistId: string) => this.state.getByChecklist(checklistId)

	create(values: Omit<CreateChecklistItemRequest, 'checklistId'>) {
		this.api.createChecklistItem({
			checklistId: this.modalState.checklistId()!,
			content: values.content,
		})

		toast.success('Checklist item creado')

		this.modalState.close()
	}

	update(values: Partial<Omit<UpdateChecklistItemRequest, 'checklistItemId'>>) {
		const checklistItem = this.modalState.checklistItem()

		if (!checklistItem) return

		this.api.updateChecklistItem({
			checklistItemId: checklistItem.id,
			content: values.content ?? checklistItem.content,
			completedItem: checklistItem.completedItem ?? false,
		})

		toast.success('Checklist item modificado')
		this.modalState.close()
	}

	save(values: Omit<CreateChecklistItemRequest, 'checklistId'>) {
		if (this.modalState.isEditMode()) {
			this.update(values)
		} else {
			this.create(values)
		}
	}

	toggleChecklistItem(item: ChecklistItemResponse) {
		this.api.updateChecklistItem({
			checklistItemId: item.id,
			content: item.content,
			completedItem: !item.completedItem,
		})
	}

	delete(checklistItemId: string) {
		this.api.deleteChecklistItem({ checklistItemId })
		toast.success('Checklist item eliminado')
	}

	openCreate(checklistId: string) {
		this.modalState.openForCreate(checklistId)
	}

	openEdit(checklistItem: ChecklistItemResponse) {
		this.modalState.openForEdit(checklistItem)
	}

	closeModal() {
		this.modalState.close()
	}

	setItems(items: ChecklistItemResponse[]) {
		this.state.setItems(items)
	}

	progress = (checklistId: string) => this.state.progress(checklistId)

	initialize(items: ChecklistItemResponse[]) {
		this.state.setItems(items)
	}

	constructor() {}
}
