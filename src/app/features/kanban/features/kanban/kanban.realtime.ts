import { inject, Injectable } from '@angular/core'
import { KanbanApi } from './kanban.api'
import { KanbanState } from './kanban.state'
import { Subscription } from 'rxjs'

@Injectable()
export class KanbanBoardRealtime {
	private readonly api = inject(KanbanApi)
	private readonly kanbanState = inject(KanbanState)

	private kanbanSub?: Subscription

	connect(teamId: string, projectId: string) {
		this.kanbanSub?.unsubscribe()

		this.kanbanSub = this.api.getKanbans(projectId, teamId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					console.log('CREATE', event.payload)
					this.kanbanState.addKanban(event.payload)
					break

				case 'UPDATE':
					this.kanbanState.updateKanban(event.payload)
					break

				case 'DELETE':
					this.kanbanState.removeKanban(event.payload.id)
					break
			}
		})
	}

	disconnect() {
		this.kanbanSub?.unsubscribe()
	}
}
