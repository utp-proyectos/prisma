export function getAssignmentInitials(assignment: any): string {
	if (!assignment) return '??'

	const firstNameChar = assignment.name?.charAt(0) || ''
	const lastNameChar = assignment.lastName?.charAt(0) || ''

	const initials = `${firstNameChar}${lastNameChar}`.trim().toUpperCase()

	if (!initials) {
		if (assignment.username?.charAt(0)) return assignment.username.charAt(0).toUpperCase()
		if (assignment.email?.charAt(0)) return assignment.email.charAt(0).toUpperCase()
		return '??'
	}
	return initials
}
