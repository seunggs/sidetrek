import * as R from 'ramda'
import { DRIP_ACCOUNT_ID } from '../utils/constants'
import { checkIsAdmin } from '../utils/auth'

const drip = require('drip-nodejs')({ token: process.env.DRIP_API_KEY, accountId: DRIP_ACCOUNT_ID })

const getAllSubscribers = async (prevCumulativeSubscribers = [], options) => {
  const response = await client.listSubscribers(options)
  const { page, total_pages } = response.body.meta
  
  const newCumulativeSubscribers = R.concat(prevCumulativeSubscribers, response.body.subscribers)
  
  if (page >= total_pages) { return newCumulativeSubscribers }

  return getAllSubscribers(newCumulativeSubscribers, R.merge(options, { page: page + 1 }))
}

const SubscriberQuery = {
  async subscribers(parent, args, { prisma }, info) {
    const isAdmin = await checkIsAdmin(prisma, request)
		if (!isAdmin) { throw new Error('Action not authorized - lack of role permission.') }

    const { status, tags, createdAt_lt, createdAt_gt } = args.where
    const subscribed_before = createdAt_lt || null
    const subscribed_after = createdAt_gt || null
    const options = R.reject(val => R.isNil(val))({
      status,
      tags,
      subscribed_before,
      subscribed_after,
      per_page: 1000,
    })

    return await getAllSubscribers([], options)
  },

  async subscriber(parent, args, { prisma }, info) {
    const response = await drip.fetchSubscriber(args.where.email)
    return response.body.subscribers[0]
  },
}

export { SubscriberQuery as default }