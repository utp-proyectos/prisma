import { Component, inject, input, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePlus, lucideSearch } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { FolderModalState } from '../../service/create-folder-modal-state'

@Component({
	selector: 'app-boards-action',
	imports: [HlmInputGroupImports, NgIcon, HlmButtonImports, HlmIconImports, HlmSelectImports],
	providers: [
		provideIcons({
			lucideSearch,
			lucidePlus,
		}),
	],
	templateUrl: './boards-action.html',
	styles: ``,
})
export class BoardsAction {
	folderModalState = inject(FolderModalState)
	isPrivate = input<boolean>(false)

	searchChange = output<string>()
	sortChange = output<string>()
	public readonly items = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Nombre', value: 'Nombre' },
		{ label: 'Abierto recientemente', value: 'Abierto recientemente' },
	]
	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value
		this.searchChange.emit(value)
	}

	onSort(value: string) {
		this.sortChange.emit(value)
	}
}
