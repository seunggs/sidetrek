import {
  SEND_MAIL_OP,
} from '../operations/mail'

export const startSendMail = (client, mail) => async (dispatch) => {
  const createdSubscriber = await client.mutate({
    mutation: SEND_MAIL_OP,
    variables: { data: mail },
  })

  return createdSubscriber
}