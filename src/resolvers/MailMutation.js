import sgMail from '@sendgrid/mail'
import { fromPrisma } from '../utils/prisma'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const MailMutation = {
  async sendMail(parent, args, { prisma, request }, info) {
		// Send mail here - convert Prisma to object before using Sendgrid
		const message = fromPrisma(args.data)

		sgMail.send(message)

		return prisma.mutation.createMail(args, info)
	},
}

export { MailMutation as default }