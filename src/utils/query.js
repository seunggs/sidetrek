/**
 * Usage:
 *   - ex. const user = await getQuery(prisma, 'user', { id })
 */

export const getQuery = async (prisma, type, where) => {
	const queryData = prisma.query[type]({
		where: {
			...where
		}
	})
	return queryData.data[type]
}