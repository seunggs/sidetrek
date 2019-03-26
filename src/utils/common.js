import * as R from 'ramda'
import toCamelcase from 'to-camel-case'
import toSnakecase from 'to-snake-case'

export const keysToCamelCase = R.curry(obj => {
  if (!obj || R.isEmpty(obj) || !R.is(Object, obj)) { return obj }
  return R.compose(
    R.fromPairs,
    R.map(([key, val]) => ([toCamelcase(key), val])),
    R.toPairs,
  )(obj)
})

export const keysToSnakeCase = R.curry(obj => {
  if (!obj || R.isEmpty(obj) || !R.is(Object, obj)) { return obj }
  return R.compose(
    R.fromPairs,
    R.map(([key, val]) => ([toSnakecase(key), val])),
    R.toPairs,
  )(obj)
})