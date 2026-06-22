import { Injectable, signal } from '@angular/core'

@Injectable()
export class SidebarService {
	canCollapse = signal<boolean>(false)
	isCollapsed = signal<boolean>(false)

	setCanCollpase(value: boolean) {
		this.canCollapse.set(value)
	}

	toggleCollapse() {
		this.isCollapsed.update((value) => !value)
	}

	expand() {
		this.isCollapsed.set(false)
	}

	collapse() {
		this.isCollapsed.set(true)
	}
}
