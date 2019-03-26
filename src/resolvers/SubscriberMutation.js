import moment from 'moment'
import { getUserEmail } from '../utils/auth'
import { DRIP_ACCOUNT_ID } from '../utils/constants'
import { keysToSnakeCase } from '../utils/common'
import { fromPrisma } from '../utils/prisma'

const drip = require('drip-nodejs')({ token: process.env.DRIP_API_KEY, accountId: DRIP_ACCOUNT_ID })

const createUpdateSubscriberInDrip = async (email, data) => {
  const subscriber = {
    ...keysToSnakeCase(data),
    created_at: moment().toISOString(),
    email,
  }
  const payload = { subscribers: [fromPrisma(subscriber)] }
  
  return drip.createUpdateSubscriber(payload)
}

const SubscriberMutation = {
  async createSubscriber(parent, args, { prisma, request }, info) {
    const { email } = args.data

    const subscriberExists = await prisma.exists.Subscriber({ email })

    if (subscriberExists) { throw new Error('This email is already subscribed') }

    await createUpdateSubscriberInDrip(email, args.data)

    return prisma.mutation.createSubscriber(args, info)
	},

	async updateSubscriber(parent, args, { prisma, request }, info) {
    const email = await getUserEmail(prisma, request, args.where)
    
    await createUpdateSubscriberInDrip(email, args.data)
    
    return prisma.mutation.updateSubscriber(args, info)
	},

  async deleteSubscriber(parent, args, { prisma, request }, info) {
    const email = await getUserEmail(prisma, request, args.where)
    
    await drip.deleteSubscriber(email)

    return prisma.mutation.deleteSubscriber(args, info)
  },
}

export { SubscriberMutation as default }