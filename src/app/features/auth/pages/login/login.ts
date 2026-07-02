import { Component, computed, inject, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangle } from '@ng-icons/lucide'
import { remixGithubFill, remixGoogleFill } from '@ng-icons/remixicon'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { Router, RouterLink } from '@angular/router'
import { AuthHeader } from '../../components/auth-header/auth-header'
import { LoginRequest } from '../../model/login-request'
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
import { AuthService } from '@/core/servies/auth.serive'
import { toast } from '@spartan-ng/brain/sonner'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
	selector: 'app-login',
	imports: [
		AuthHeader,
		NgIcon,
		HlmFieldImports,
		HlmButtonImports,
		HlmInputImports,
		RouterLink,
		FormRoot,
		FormField,
	],
	providers: [provideIcons({ lucideTriangle, remixGithubFill, remixGoogleFill })],
	templateUrl: './login.html',
})
export class Login {
	private router = inject(Router)
	private authApiService = inject(AuthApiService)
	private authService = inject(AuthService)

	loginModel = signal<LoginRequest>({
		email: '',
		password: '',
	})

	loginForm = form(
		this.loginModel,
		(schemaPath) => {
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
						const user = await this.authApiService.login(data().value())
						this.authService.saveSession(user)
						this.router.navigate(['/'])
					} catch (error) {
						const err = error as HttpErrorResponse

						const backendMessage =
							err.error?.message || 'Ocurrió un error inesperado al iniciar sesión'

						toast.error(backendMessage)

						this.loginForm.password().reset('')
					}
				},
			},
		},
	)
}
