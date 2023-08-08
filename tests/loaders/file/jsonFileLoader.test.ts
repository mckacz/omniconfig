import { FileLoaderError } from '~/loaders/file/fileLoaderError'
import { JsonFileLoader } from '~/loaders/file/jsonFileLoader'

describe('JsonFileLoader', () => {
  const validJSONFile   = 'fixtures/data/valid.json'
  const invalidJSONFile = 'fixtures/data/invalid.json'

  test('load a valid JSON file', () => {
    const loader        = new JsonFileLoader(validJSONFile)
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      foo:  'bar',
      some: {
        nested: {
          value: 123,
        },
      },
    })

    expect(dataContainer.getDefinition(['foo'])).toEqual({
      source:     validJSONFile,
      identifier: 'foo',
    })
  })

  test('load a section JSON file', () => {
    const loader        = new JsonFileLoader(validJSONFile, ['some', 'nested'])
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      value: 123,
    })

    expect(dataContainer.getDefinition(['value'])).toEqual({
      source:     validJSONFile,
      identifier: 'some.nested.value',
    })
  })

  test('load a not existing section JSON file', () => {
    const loader        = new JsonFileLoader(validJSONFile, ['some', 'other'])
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toBeUndefined()
  })

  test('get references', () => {
    const loader = new JsonFileLoader(validJSONFile)

    expect(loader.getReferences(['foo'])).toEqual([
      {
        source:     validJSONFile,
        identifier: 'foo',
      },
    ])
  })

  test('attempt to load an invalid JSON file', () => {
    const loader = new JsonFileLoader(invalidJSONFile)

    expect(() => loader.loadSync()).toThrow(FileLoaderError)
  })
})
