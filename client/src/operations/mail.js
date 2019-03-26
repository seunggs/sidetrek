import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const mailOps = {
  fragments: {
    mailInfo: gql`
      fragment MailInfo on Mail {
        id
        createdAt
        updatedAt
        to
        from
        subject
        text
        html
        isMultiple
        cc
        bcc
        replyTo
      }
    `
  }
}

export const SEND_MAIL_OP = gql`
  mutation SendMail($data: MailCreateInput!) {
    sendMail(data: $data) {
      ...MailInfo
    }
  }
  ${mailOps.fragments.mailInfo}
`