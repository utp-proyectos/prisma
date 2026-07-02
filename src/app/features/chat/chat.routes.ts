import { Routes } from '@angular/router'
import { Chat } from './pages/chat/chat'
import { ChannelSidebar } from './layout/channel-sidebar/channel-sidebar'
import { Channel } from './pages/channel/channel'

export const chatRoutes: Routes = [
	{
		path: '',
		component: ChannelSidebar,
		children: [
			{
				path: '',
				component: Channel,
			},
			{
				path: ':channelId',
				component: Chat,
			},
		],
	},
]
