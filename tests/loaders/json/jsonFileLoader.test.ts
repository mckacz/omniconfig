import { JsonFileLoader } from '~/loaders/json/jsonFileLoader'
import { JsonFileLoaderError } from '~/loaders/json/jsonFileLoaderError'

describe('JSONFileLoader', () => {
  const validJSONFile = 'fixtures/data/valid.json'
  const invalidJSONFile = 'fixtures/data/invalid.json'

  test('load a valid JSON file', () => {
    const loader = new JsonFileLoader(validJSONFile)

    expect(loader.loadSync()).toEqual({ foo: 'bar' })
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

    expect(() => loader.loadSync()).toThrow(JsonFileLoaderError)
  })
})