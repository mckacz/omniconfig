import { EnvLoader } from '~/loaders/env/envLoader'
import { EnvKeyMapper } from '~/loaders/env/keyMappers/envKeyMapper'
import { CamelCaseKeyMapper } from '~/loaders/env/keyMappers/camelCaseKeyMapper'

describe('EnvLoader', () => {
  class InlineEnvLoader extends EnvLoader {
    constructor(
      private readonly value: Record<string, string>,
      mapper: EnvKeyMapper,
    ) {
      super(mapper)
    }

    protected loadEnv() {
      return this.value
    }

    protected getContainer(path: string) {
      return path === 'foo' ? undefined : 'test'
    }
  }

  const mapper = new CamelCaseKeyMapper({
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
    expect(loader.loadSync()).toEqual({
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
  })

  test('get reference', () => {
    expect(loader.referenceFor('ra.bar')).toEqual({
      container: 'test',
      identifier: 'RA__BAR'
    })
  })

  test('get empty reference if the loader does not return the container', () => {
    expect(loader.referenceFor('foo')).toBeUndefined()
  })
})
