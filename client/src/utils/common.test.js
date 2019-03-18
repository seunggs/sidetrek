import {
  toTitleCase,
} from './common'

test('empty string to title case should be empty string', () => {
  expect(toTitleCase('')).toBe('')
})

test('somestring to title case should be Somestring', () => {
  expect(toTitleCase('somestring')).toBe('Somestring')
})

test('SOMESTRING to title case should be Somestring', () => {
  expect(toTitleCase('SOMESTRING')).toBe('Somestring')
})