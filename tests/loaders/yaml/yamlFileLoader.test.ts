import { load } from 'js-yaml'
import { YamlFileLoader } from '~/loaders/yaml/yamlFileLoader'
import { YamlFileLoaderError } from '~/loaders/yaml/yamlFileLoaderError'

describe('YamlFileLoader', () => {
  const validYamlFile = 'fixtures/data/valid.yaml'
  const invalidYamlFile = 'fixtures/data/invalid.yaml'

  test('load a valid YAML file', () => {
    const loader = new YamlFileLoader(validYamlFile, load)
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({ foo: 'bar' })

    expect(dataContainer.getDefinition(['foo'])).toEqual({
      source:     validYamlFile,
      identifier: 'foo',
    })
  })

  test('get references', () => {
    const loader = new YamlFileLoader(validYamlFile, load)

    expect(loader.getReferences(['foo'])).toEqual([{
      source:     validYamlFile,
      identifier: 'foo',
    }])
  })

  test('attempt to load an invalid YAML file', () => {
    const loader = new YamlFileLoader(invalidYamlFile, load)

    expect(() => loader.loadSync()).toThrow(YamlFileLoaderError)
  })
})
