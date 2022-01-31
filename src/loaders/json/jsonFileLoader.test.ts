import { JsonFileLoader } from './jsonFileLoader.js'
import { JsonFileLoaderError } from './jsonFileLoaderError.js'

describe('JSONFileLoader', () => {
  const validJSONFile = 'mocks/data/valid.json'
  const invalidJSONFile = 'mocks/data/invalid.json'

  test('load a valid JSON file', () => {
    const loader = new JsonFileLoader(validJSONFile)

    expect(loader.load()).toEqual({ foo: 'bar' })
  })

  test('get reference', () => {
    const loader = new JsonFileLoader(validJSONFile)

    expect(loader.referenceFor('foo')).toEqual({
      container:  validJSONFile,
      identifier: 'foo',
    })
  })

  test('attempt to load an invalid JSON file', () => {
    const loader = new JsonFileLoader(invalidJSONFile)

    expect(() => loader.load()).toThrow(JsonFileLoaderError)
  })
})
