import { Component, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideClock, lucidePlus, lucideSearch } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'

interface ProjectProps {
	id: number
	title: string
}

@Component({
	selector: 'app-recent-projects',
	imports: [
		NgIcon,
		HlmButtonImports,
		HlmSelectImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmSeparatorImports,
		HlmCardImports,
	],
	providers: [provideIcons({ lucidePlus, lucideSearch, lucideClock })],
	templateUrl: './recent-projects.html',
	styles: ``,
})
export class RecentProjects {
	public readonly sortByOptions = [
		{ label: 'Ultimo modificado', value: 'last-modified' },
		{ label: 'Alfabeticamente', value: 'name' },
	]

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
		{
			id: 4,
			title: 'Project 4',
		},
		{
			id: 5,
			title: 'Project 5',
		},
		{
			id: 6,
			title: 'Project 6',
		},
		{
			id: 7,
			title: 'Project 7',
		},
		{
			id: 8,
			title: 'Project 8',
		},
		{
			id: 9,
			title: 'Project 9',
		},
		{
			id: 10,
			title: 'Project 10',
		},
	])
}
