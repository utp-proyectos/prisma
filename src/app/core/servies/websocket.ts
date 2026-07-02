import { inject, Service } from '@angular/core'
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
		this.stomp.configure({
			webSocketFactory: () => new SockJS(`${config.apiUrl}/ws`),
			connectHeaders: {
				Authorization: `Bearer ${this.authService.currentUser()?.token}`,
			},
			reconnectDelay: 3000,
		})

		this.stomp.activate()
	}

	// watch(topic: string): Observable<IMessage> {
	// 	console.log('suscribiendo a:', topic)

	// 	return this.stomp.watch(topic)
	// }
	watch(topic: string): Observable<IMessage> {
		return this.stomp
			.watch(topic)
			.pipe(tap((msg) => console.log('mensaje llegó al topic:', topic, msg)))
	}
	publish(destination: string, body: object): void {
		this.stomp.publish({
			destination,
			body: JSON.stringify(body),
		})
	}
}
