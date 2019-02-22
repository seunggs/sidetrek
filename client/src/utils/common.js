export const createPermalink = str => {
  var re = /[^a-z0-9]+/gi // global and case insensitive matching of non-char/non-numeric
  var re2 = /^-*|-*$/g // get rid of any leading/trailing dashes
  return str.replace(re, '-').replace(re2, '').toLowerCase()
}