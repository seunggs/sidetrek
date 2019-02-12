export const parseServerErrors = errors => {
  if (errors.message) {
    return errors.message.replace('GraphQL error: ', '')
  } else {
    return errors.error_description || errors.description
  }
}