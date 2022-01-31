import { ValueLoader } from './valueLoader.js'

// WARNING: "callsites" mock has been mapped in `jest.config.js`.
// Below not working right now:
// jest.unstable_mockModule('callsites', () => ({
//   default: () => []
// }))

describe('ValueLoader', () => {
  test('load the value', () => {
    const value = { foo: 123 }
    const loader = new ValueLoader(value)

    expect(loader.load()).toBe(value)
  })

  test('auto-detected reference', () => {
    const value = { foo: 123 }
    const loader = new ValueLoader(value)

    expect(loader.referenceFor('foo')).toEqual({
      container:  'file3.js:3',
      identifier: 'foo',
    })
  })

  test('custom reference', () => {
    const value = { foo: 123 }
    const loader = new ValueLoader(value, 'The value')

    expect(loader.referenceFor('foo')).toEqual({
      container:  'The value',
      identifier: 'foo',
    })
  })
})
