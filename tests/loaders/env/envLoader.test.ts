import { EnvLoader } from '~/loaders/env/envLoader'
import { CamelCaseEnvMapper } from '~/loaders/env/envMappers/camelCaseEnvMapper'
import { EnvMapper } from '~/loaders/env/envMappers/envMapper'

describe('EnvLoader', () => {
  class InlineEnvLoader extends EnvLoader {
    constructor(
      private readonly value: Record<string, string>,
      mapper: EnvMapper,
    ) {
      super(mapper)
    }

    protected loadEnv() {
      return this.value
    }

    protected getSource(path: string[]) {
      return path[0] === 'foo' ? undefined : 'test'
    }
  }

  const mapper = new CamelCaseEnvMapper({
    prefix:    '',
    separator: '__',
  })

  const loader = new InlineEnvLoader({
    FOO:            '123',
    RA__BAR:        'bar',
    RA__CA:         '234',
    BAZ__QUX__QUUX: 'foo',
  }, mapper)

  test('map environment variables to configuration object', () => {
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      foo: '123',
      ra:  {
        bar: 'bar',
        ca:  '234',
      },
      baz: {
        qux: {
          quux: 'foo',
        },
      },
    })

    expect(dataContainer.getDefinition(['ra', 'bar'])).toEqual({
      source:     'test',
      identifier: 'RA__BAR',
    })
  })

  test('get reference', () => {
    expect(loader.getReferences(['ra', 'bar'])).toEqual([{
      source:     'test',
      identifier: 'RA__BAR',
    }])
  })

  test('get empty reference if the loader does not return the container', () => {
    expect(loader.getReferences(['foo'])).toEqual([])
  })
})
