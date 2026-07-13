import { inject, Injectable } from '@angular/core'
import { ChecklistApi } from './checklist.api'
import { ChecklistState } from './checklist.state'
import { Subscription } from 'rxjs'

@Injectable()
export class ChecklistRealtime {
	private readonly api = inject(ChecklistApi)
	private readonly checklistState = inject(ChecklistState)

	private checklistSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectChecklists(teamId, projectId, kanbanId)
	}

	connectChecklists(teamId: string, projectId: string, kanbanId: string) {
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

	disconnect() {
		this.checklistSub?.unsubscribe()
	}
}
