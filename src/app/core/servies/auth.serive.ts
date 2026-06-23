import { signal, computed, Service } from '@angular/core'
import { User } from '../models/user.model'

@Service()
export class AuthService {
	private readonly STORAGE_KEY = 'app_user_session'

	readonly currentUser = signal<User | null>(this.getUserFromStorage())

	readonly isAuthenticated = computed(() => this.currentUser() !== null)

	saveSession(user: User) {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
		this.currentUser.set(user)
	}

	clearSession() {
		localStorage.removeItem(this.STORAGE_KEY)
		this.currentUser.set(null)
	}

	private getUserFromStorage(): User | null {
		const storedUser = localStorage.getItem(this.STORAGE_KEY)
		if (!storedUser) return null

		try {
			return JSON.parse(storedUser) as User
		} catch {
			localStorage.removeItem(this.STORAGE_KEY)
			return null
		}
	}
}
