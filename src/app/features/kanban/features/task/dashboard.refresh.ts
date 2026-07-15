import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class DashboardRefresh {
	private readonly _refreshSignal = signal<number>(0)
	readonly refresh = this._refreshSignal.asReadonly()

	notify() {
		this._refreshSignal.update((value) => value + 1)
	}
}
