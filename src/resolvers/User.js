import { getUserEmail } from '../utils/auth'

const User = {
	// email: {
	// 	fragment: 'fragment email on User { email }',
	// 	async resolve(parent, args, { request }, info) {
	// 		const email = await getUserEmail(request, { requireAuth: false })

	// 		if (email && email === parent.email) {
	// 			return parent.email
	// 		} else {
	// 			return null
	// 		}
	// 	}
	// }
}

export { User as default }