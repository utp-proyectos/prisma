import { Component, inject, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { CreateTeamModalState } from '../../service/create-team-modal-state'
import { lucideSearch } from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'

interface ProjectProps {
	id: number
	title: string
}

@Component({
	selector: 'app-team',
	imports: [
		NgIcon,
		HlmCardImports,
		HlmButtonImports,
		HlmSeparatorImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmFieldImports,
		HlmSelectImports,
		HlmDialogImports,
	],
	providers: [provideIcons({ lucideSearch })],
	templateUrl: './team.html',
	styles: ``,
})
export class Team {
	public readonly sortByOptions = [
		{ label: 'Ultimo modificado', value: 'last-modified' },
		{ label: 'Alfabeticamente', value: 'name' },
	]

	createProjectModal = signal<BrnDialogState>('closed')

	public readonly optionToString = (value: string) =>
		this.sortByOptions.find((option) => option.value === value)?.label || ''

	projects = signal<ProjectProps[]>([
		{
			id: 1,
			title: 'Project 1',
		},
		{
			id: 2,
			title: 'Project 2',
		},
		{
			id: 3,
			title: 'Project 3',
		},
	])
}
