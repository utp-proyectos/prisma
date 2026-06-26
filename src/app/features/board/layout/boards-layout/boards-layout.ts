import {
	NavHeader,
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarItemProps,
} from '@/shared/components/sidebar'
import { Component, computed, inject, signal } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePlus, lucideTrash2, lucideUser, lucideUsers } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { BoardCreateDialog } from '../../components/board-create-dialog/board-create-dialog'
import { filter, map } from 'rxjs/operators'
import { toSignal } from '@angular/core/rxjs-interop'
@Component({
	selector: 'app-boards-layout',
	imports: [
		RouterOutlet,
		NgIcon,
		Sidebar,
		SidebarContent,
		SidebarHeader,
		NavHeader,

		HlmButtonImports,
		HlmSeparatorImports,
		BoardCreateDialog,
	],
	providers: [provideIcons({ lucidePlus, lucideUser, lucideUsers, lucideTrash2 })],
	templateUrl: './boards-layout.html',
	styles: ``,
})
export class BoardsLayout {
	//inyeccion de dependecias
	createBoardModalState = inject(CreateBoardModalState)
	private router = inject(Router)

	//estados derivados de la ruta
	isTrash = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.router.url.includes('/trash')),
		),
		{ initialValue: false },
	)

	// para que el modal tenga contexto si es my o group donde se quiere crear
	isPrivate = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.router.url.includes('/my')),
		),
		{ initialValue: this.router.url.includes('/my') },
	)

	//estaods de la vista y modales
	createBoardModal = computed(() => this.createBoardModalState.createBoardModal())

	protected readonly SidebarBoardOptions = signal<SidebarItemProps[]>([
		{
			icon: 'lucideUser',
			title: 'Mis pizarras',
			to: '/team/project/board/my',
		},
		{
			icon: 'lucideUsers',
			title: 'Pizarras grupales',
			to: '/team/project/board/group',
		},
		{
			icon: 'lucideTrash2',
			title: 'Papelera',
			to: '/team/project/board/trash',
		},
	])

	//acciones
	openCreateBoard() {
		this.createBoardModalState.open(this.isPrivate())
	}
}
