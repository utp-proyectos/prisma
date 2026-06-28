import { Injectable, signal } from '@angular/core'

@Injectable()
export class TeamIdState {
	teamId = signal<string | null>(null)
}
