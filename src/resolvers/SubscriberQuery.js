import { DRIP_ACCOUNT_ID } from '../utils/constants'

const drip = require('drip-nodejs')({ token: process.env.DRIP_API_KEY, accountId: DRIP_ACCOUNT_ID })

const SubscriberQuery = {
	subscribers(parent, args, { prisma }, info) {
		return prisma.query.subscribers(args, info)
	},

	subscriber(parent, args, { prisma }, info) {
		return prisma.query.subscriber(args, info)
	},
}

export { SubscriberQuery as default }