import { effect, inject, Service } from '@angular/core'
import { IMessage, RxStomp } from '@stomp/rx-stomp'
import SockJS from 'sockjs-client'
import { AuthService } from './auth.serive'
import { Observable, tap } from 'rxjs'
import { config } from '../config'

@Service()
export class Websocket {
	private stomp = new RxStomp()
	private authService = inject(AuthService)

	constructor() {
		effect(() => {
			const user = this.authService.currentUser()

			if (user && user.token) {
				this.connect(user.token)
			} else {
				this.disconnect()
			}
		})
	}

	private connect(token: string) {
		this.disconnect()

		this.stomp.configure({
			webSocketFactory: () => new SockJS(`${config.apiUrl}/ws`),
			connectHeaders: {
				Authorization: `Bearer ${token}`,
			},
			reconnectDelay: 3000,
		})

		this.stomp.activate()
	}

	private disconnect() {
		if (this.stomp.active) {
			this.stomp.deactivate()
		}
	}

	watch(topic: string): Observable<IMessage> {
		return this.stomp.watch(topic)
	}

	publish(destination: string, body: object): void {
		this.stomp.publish({
			destination,
			body: JSON.stringify(body),
		})
	}
}
