import { ValueLoader } from '~/loaders/valueLoader'

describe('ValueLoader', () => {
  test('load the value', () => {
    const value = { foo: 123 }
    const loader = new ValueLoader(value)

    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toBe(value)

    expect(dataContainer.referenceFor('foo')).toEqual({
      source:     'file3.js:3',
      identifier: 'foo',
    })
  })

  test('auto-detected reference', () => {
    const value = { foo: 123 }
    const loader = new ValueLoader(value)

    expect(loader.referencesFor('foo')).toEqual([{
      source:     'file3.js:3',
      identifier: 'foo',
    }])
  })

  test('custom reference', () => {
    const value = { foo: 123 }
    const loader = new ValueLoader(value, 'The value')

    expect(loader.referencesFor('foo')).toEqual([{
      source:     'The value',
      identifier: 'foo',
    }])
  })
})
