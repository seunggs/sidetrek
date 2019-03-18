import moment from 'moment'
import { getUserEmail } from '../utils/auth'
import { checkMemberIsAdmin } from '../utils/member'
import { DRIP_ACCOUNT_ID } from '../utils/constants'
import { keysToSnakeCase } from '../utils/common'

const drip = require('drip-nodejs')({ token: process.env.DRIP_API_KEY, accountId: DRIP_ACCOUNT_ID })

const SubscriberMutation = {
  async createSubscriber(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

    const subscriber = {
      ...keysToSnakeCase(args.data),
      created_at: moment().toISOString(),
      email
    }
    console.log('subscriber', subscriber)
    const payload = { subscribers: [subscriber] }
    return drip.createUpdateSubscriber(payload)
	},

	async updateSubscriber(parent, args, { prisma, request }, info) {
		const subscriberExists = prisma.exists.Subscriber(args.where)

		if (!subscriberExists) { throw new Error('Unable to update subscriber.') }

		return prisma.mutation.updateSubscriber(args, info)
	},

  async deleteSubscriber(parent, args, { prisma, request }, info) {
		const subscriberId = getSubscriberId(prisma, args.where)
		checkMemberIsAdmin(prisma, request, subscriberId)

		const subscriberExists = prisma.exists.Subscriber(args.where)

		if (!subscriberExists) { throw new Error('Unable to delete subscriber.') }

		return prisma.mutation.deleteSubscriber(args, info)
  },
}

export { SubscriberMutation as default }