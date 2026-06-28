import { ApiReponse } from '@/core/models/api-response.model'
import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Service, Signal } from '@angular/core'
import { RegisterRequest } from '../pages/model/register-request'
import { map } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'
import { LoginRequest } from '../pages/model/login-request'
import { User } from '@/core/models/user.model'
import { CurrentUser } from '../pages/model/current-user'

@Service()
export class AuthApiService {
	private readonly http = inject(HttpClient)

	login = (credentials: LoginRequest) =>
		firstValueFrom(
			this.http.post<ApiReponse<User>>('/auth/login', credentials).pipe(map((res) => res.data)),
		)

	registerUser = (user: RegisterRequest) =>
		firstValueFrom(
			this.http.post<ApiReponse<User>>('/auth/register', user).pipe(map((res) => res.data)),
		)

	getCurrentUser = (token: string) =>
		this.http.get<ApiReponse<CurrentUser>>(`/auth/me?token=${token}`).pipe(map((res) => res.data))

	getVerificationEmailResource(token: Signal<string | undefined>) {
		return httpResource<ApiReponse<null>>(() =>
			token() ? `/auth/verify-email?token=${token()}` : undefined,
		)
	}
}
