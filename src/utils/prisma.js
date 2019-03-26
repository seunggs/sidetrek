import * as R from 'ramda'

export const fromPrisma = R.curry(prismaObj => {
  const prismaWriteTypes = ['create', 'update', 'upsert', 'delete', 'connect', 'disconnect', 'set']

  return R.compose(
    R.pickBy(val => !R.isEmpty(val) && !R.isNil(val)),
    R.mapObjIndexed(val => {
      const prismaWriteType = R.is(Object, val) &&
        !Array.isArray(prismaObj) &&
        R.contains(R.keys(val)[0], prismaWriteTypes) ? R.keys(val)[0] : null
      if (prismaWriteType) {
        if (prismaWriteType === 'set') {
          return val[prismaWriteType]
        }
        return null
      }
      return val
    }),
  )(prismaObj)
})