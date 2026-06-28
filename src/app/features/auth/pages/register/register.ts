import { Component, inject, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucideTriangle } from '@ng-icons/lucide'
import { remixGithubFill, remixGoogleFill } from '@ng-icons/remixicon'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { RouterLink } from '@angular/router'
import { AuthHeader } from '@/features/auth/components/auth-header/auth-header'
import { RegisterRequest } from '../../model/register-request'
import {
	disabled,
	email,
	form,
	FormField,
	FormRoot,
	minLength,
	required,
} from '@angular/forms/signals'
import { AuthApiService } from '../../services/auth-api.service'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { firstValueFrom } from 'rxjs'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'
import { HttpErrorResponse } from '@angular/common/http'
import { toast } from '@spartan-ng/brain/sonner'

@Component({
	selector: 'app-register',
	imports: [
		AuthHeader,
		NgIcon,
		HlmFieldImports,
		HlmButtonImports,
		HlmInputImports,
		HlmDialogImports,
		HlmSpinnerImports,
		RouterLink,
		FormRoot,
		FormField,
	],
	providers: [provideIcons({ lucideTriangle, remixGithubFill, remixGoogleFill, lucideCheck })],
	templateUrl: './register.html',
})
export class Register {
	authService = inject(AuthApiService)

	registerSuccessModalState = signal<BrnDialogState>('closed')

	registerModel = signal<RegisterRequest>({
		name: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
	})

	registerForm = form(
		this.registerModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre es requerido' })
			required(schemaPath.lastName, { message: 'El apellido es requerido' })
			required(schemaPath.username, { message: 'El username es requerido' })
			required(schemaPath.email, { message: 'El email es requerido' })
			email(schemaPath.email, { message: 'El email no es valido' })
			required(schemaPath.password, { message: 'La contraseña es requerida' })
			minLength(schemaPath.password, 8, {
				message: 'La contraseña debe tener al menos 8 caracteres',
			})
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					try {
						await this.authService.registerUser(data().value())

						this.registerSuccessModalState.set('open')
					} catch (error) {
						const err = error as HttpErrorResponse

						const backendMessage =
							err.error?.message || 'Ocurrió un error inesperado al iniciar sesión'

						toast.error(backendMessage)
					}
				},
			},
		},
	)
}
