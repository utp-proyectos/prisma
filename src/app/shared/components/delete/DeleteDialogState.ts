import { signal, computed } from '@angular/core'

export class DeleteDialogState<T> {
	readonly item = signal<T | null>(null)

	readonly state = computed(() => (this.item() ? 'open' : 'closed'))

	open(item: T) {
		this.item.set(item)
	}

	close() {
		this.item.set(null)
	}
}
