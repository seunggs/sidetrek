import {
  fromPrisma,
} from './prisma'

test('fromPrisma() should replace "set" object values with arrays', () => {
  const input = {
    id: '1',
    images: { set: ['1', '2'] }
  }
  const expected = {
    id: '1',
    images: ['1', '2']
  }
  expect(fromPrisma('product', 'create', input)).toEqual(expected)
})

test('fromPrisma() should replace "create" object values with null', () => {
  const input = {
    id: '1',
    images: { create: { id: 'x' } }
  }
  const expected = {
    id: '1',
  }
  expect(fromPrisma('product', 'create', input)).toEqual(expected)
})

test('fromPrisma() should leave array values alone', () => {
  const input = {
    id: '1',
    images: ['1', '2']
  }
  const expected = {
    id: '1',
    images: ['1', '2']
  }
  expect(fromPrisma('product', 'create', input)).toEqual(expected)
})
