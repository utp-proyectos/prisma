import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTrash2 } from '@ng-icons/lucide'
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'

@Component({
	selector: 'app-delete-modal',
	imports: [BrnAlertDialogImports, HlmAlertDialogImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideTrash2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog [state]="state()" (closed)="stateChanged.emit('closed')">
			<hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
				<hlm-alert-dialog-header>
					<hlm-alert-dialog-media
						class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
					>
						<ng-icon name="lucideTrash2" />
					</hlm-alert-dialog-media>

					<h2
						hlmAlertDialogTitle
						class="max-w-xs sm:max-w-md wrap-break-word whitespace-normal w-70"
					>
						{{ title() }}
					</h2>

					<p hlmAlertDialogDescription>{{ description() }}</p>
				</hlm-alert-dialog-header>
				<hlm-alert-dialog-footer>
					<button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
					<button hlmAlertDialogAction (click)="confirm.emit(); ctx.close()">Eliminar</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class DeleteModalComponent {
	state = input<'open' | 'closed'>('closed')
	title = input('¿Eliminar?')
	description = input('Esta acción no se puede deshacer.')
	stateChanged = output<'open' | 'closed'>()
	confirm = output<void>()
}
