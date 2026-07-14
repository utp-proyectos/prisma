import { computed, Injectable, signal } from '@angular/core'
import { KanbanResponse } from '../../models/kanban-response.model'

@Injectable()
export class KanbanState {
	readonly kanbans = signal<KanbanResponse[]>([])

	setKanbans(data: KanbanResponse[]) {
		this.kanbans.set(data)
	}

	readonly kanbanIds = computed(() => new Set(this.kanbans().map((k) => k.id)))

	addKanban(kanban: KanbanResponse) {
		this.kanbans.update((list) => [...list, kanban])
	}

	updateKanban(kanban: KanbanResponse) {
		this.kanbans.update((list) => list.map((k) => (k.id === kanban.id ? kanban : k)))
	}

	removeKanban(id: string) {
		this.kanbans.update((list) => list.filter((k) => k.id !== id))
	}
}
