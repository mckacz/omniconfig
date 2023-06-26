import { JsonFileLoader } from '~/loaders/json/jsonFileLoader'
import { JsonFileLoaderError } from '~/loaders/json/jsonFileLoaderError'

describe('JsonFileLoader', () => {
  const validJSONFile = 'fixtures/data/valid.json'
  const invalidJSONFile = 'fixtures/data/invalid.json'

  test('load a valid JSON file', () => {
    const loader = new JsonFileLoader(validJSONFile)
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({ foo: 'bar' })

    expect(dataContainer.getDefinition(['foo'])).toEqual({
      source:     validJSONFile,
      identifier: 'foo',
    })
  })

  test('get references', () => {
    const loader = new JsonFileLoader(validJSONFile)

    expect(loader.getReferences(['foo'])).toEqual([{
      source:     validJSONFile,
      identifier: 'foo',
    }])
  })

  test('attempt to load an invalid JSON file', () => {
    const loader = new JsonFileLoader(invalidJSONFile)

    expect(() => loader.loadSync()).toThrow(JsonFileLoaderError)
  })
})
