import * as R from 'ramda'

export const createPermalink = str => {
  var re = /[^a-z0-9]+/gi // global and case insensitive matching of non-char/non-numeric
  var re2 = /^-*|-*$/g // get rid of any leading/trailing dashes
  return str.replace(re, '-').replace(re2, '').toLowerCase()
}

export const toTitleCase = R.curry(str => {
  if (!str || R.isEmpty(str) || !R.is(String, str)) { return str }
  const firstLetter = R.head(str)
  const rest = R.tail(str)
  return firstLetter.toUpperCase() + rest.toLowerCase()
})