import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const subscriberOps = {
  fragments: {
    subscriberInfo: gql`
      fragment SubscriberInfo on Subscriber {
        id
        createdAt
        updatedAt
        dripId
        email
        status
        visitorUuid
        newEmail
        userId
        timeZone
        utcOffset
        lifetimeValue
        ipAddress
        userAgent
        originalReferrer
        landingUrl
        customFields
        tags
        removeTags
        prospect
        baseLeadScore
        leadScore
        euConsent
        euConsentMessage
      }
    `
  }
}

export const GET_SUBSCRIBER_OP = gql`
  query Subscriber($where: SubscriberWhereUniqueInput!) {
    subscriber(where: $where) {
      ...SubscriberInfo
    }
  }
  ${subscriberOps.fragments.subscriberInfo}
`

export const GET_SUBSCRIBERS_OP = gql`
  query Subscribers($where: SubscriberWhereInput) {
    subscribers(where: $where) {
      ...SubscriberInfo
    }
  }
  ${subscriberOps.fragments.subscriberInfo}
`

export const CREATE_SUBSCRIBER_OP = gql`
  mutation CreateSubscriber($data: SubscriberCreateInput!) {
    createSubscriber(data: $data) {
      ...SubscriberInfo
    }
  }
  ${subscriberOps.fragments.subscriberInfo}
`

export const UPDATE_SUBSCRIBER_OP = gql`
  mutation UpdateSubscriber($where: SubscriberWhereUniqueInput!, $data: SubscriberUpdateInput!) {
    updateSubscriber(where: $where, data: $data) {
      ...SubscriberInfo
    }
  }
  ${subscriberOps.fragments.subscriberInfo}
`

export const DELETE_SUBSCRIBER_OP = gql`
  mutation DeleteSubscriber($where: SubscriberWhereUniqueInput!) {
    deleteSubscriber(where: $where) {
      ...SubscriberInfo
    }
  }
  ${subscriberOps.fragments.subscriberInfo}
`