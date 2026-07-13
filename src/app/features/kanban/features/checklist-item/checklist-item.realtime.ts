import { inject, Injectable } from '@angular/core'
import { ChecklistItemApi } from './checklist-item.api'
import { ChecklistItemState } from './checklist-item.state'
import { Subscription } from 'rxjs'

@Injectable()
export class ChecklistItemRealtime {
	private readonly api = inject(ChecklistItemApi)
	private readonly checklistItemState = inject(ChecklistItemState)

	private checklistItemSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectChecklistItems(teamId, projectId, kanbanId)
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

	disconnect() {
		this.checklistItemSub?.unsubscribe()
	}
}
