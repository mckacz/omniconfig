import { load } from 'js-yaml'
import { FileLoaderError } from '~/loaders/file/fileLoaderError'
import { YamlFileLoader } from '~/loaders/file/yamlFileLoader'

describe('YamlFileLoader', () => {
  const validYamlFile   = 'fixtures/data/valid.yaml'
  const invalidYamlFile = 'fixtures/data/invalid.yaml'

  test('load a valid YAML file', () => {
    const loader        = new YamlFileLoader(load, validYamlFile)
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
      source:     validYamlFile,
      identifier: 'foo',
    })
  })

  test('load a section YAML file', () => {
    const loader        = new YamlFileLoader(load, validYamlFile, ['some', 'nested'])
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      value: 123,
    })

    expect(dataContainer.getDefinition(['value'])).toEqual({
      source:     validYamlFile,
      identifier: 'some.nested.value',
    })
  })

  test('load a not existing YAML file', () => {
    const loader        = new YamlFileLoader(load, validYamlFile, ['some', 'other'])
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toBeUndefined()
  })

  test('get references', () => {
    const loader = new YamlFileLoader(load, validYamlFile)

    expect(loader.getReferences(['foo'])).toEqual([
      {
        source:     validYamlFile,
        identifier: 'foo',
      },
    ])
  })

  test('attempt to load an invalid YAML file', () => {
    const loader = new YamlFileLoader(load, invalidYamlFile)

    expect(() => loader.loadSync()).toThrow(FileLoaderError)
  })
})
