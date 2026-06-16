import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BoardCreateDialog } from './board-create-dialog'

describe('BoardCreateDialog', () => {
	let component: BoardCreateDialog
	let fixture: ComponentFixture<BoardCreateDialog>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BoardCreateDialog],
		}).compileComponents()

		fixture = TestBed.createComponent(BoardCreateDialog)
		component = fixture.componentInstance
		await fixture.whenStable()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
