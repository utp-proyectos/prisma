import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class TeamIdState {
	teamId = signal<string | null>(null)
}
