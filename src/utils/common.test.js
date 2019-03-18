import {
  keysToCamelCase,
  keysToSnakeCase,
} from './common'

test('keysToCamelCase({}) should equal {}', () => {
  const obj = {}
  const expected = {}
  expect(keysToCamelCase(obj)).toEqual(expected)
})

test('keysToCamelCase({ some_key: "testing" }) should equal { someKey: "testing" }', () => {
  const obj = {
    some_key: 'testing'
  }
  const expected = {
    someKey: 'testing'
  }
  expect(keysToCamelCase(obj)).toEqual(expected)
})

test('keysToCamelCase({}) should equal {}', () => {
  const obj = {}
  const expected = {}
  expect(keysToCamelCase(obj)).toEqual(expected)
})

test('keysToCamelCase({ some_key: "testing" }) should equal { someKey: "testing" }', () => {
  const obj = {
    some_key: 'testing'
  }
  const expected = {
    someKey: 'testing'
  }
  expect(keysToCamelCase(obj)).toEqual(expected)
})

test('keysToSnakeCase({}) should equal {}', () => {
  const obj = {}
  const expected = {}
  expect(keysToSnakeCase(obj)).toEqual(expected)
})

test('keysToSnakeCase({ some_key: "testing" }) should equal { someKey: "testing" }', () => {
  const obj = {
    someKey: 'testing'
  }
  const expected = {
    some_key: 'testing'
  }
  expect(keysToSnakeCase(obj)).toEqual(expected)
})
