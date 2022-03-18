import { ProcessEnvLoader } from '~/loaders/env/processEnvLoader'
import { CamelCaseKeyMapper } from '~/loaders/env/keyMappers/camelCaseKeyMapper'

describe('ProcessEnvLoader', () => {
  const mapper = new CamelCaseKeyMapper({
    prefix:    'APP__',
    separator: '__',
  })

  const loader = new ProcessEnvLoader(mapper, {
    APP__FOO:        '123',
    APP__BAR__BAZ:   'qux',
    APP__BAR__RA_CA: 'false',
  })

  test('load configuration', () => {
    expect(loader.loadSync()).toEqual({
      foo: '123',
      bar: {
        baz:  'qux',
        raCa: 'false',
      },
    })
  })

  test('get reference', () => {
    expect(loader.referenceFor('bar.raCa')).toEqual({
      source:     ProcessEnvLoader.source,
      identifier: 'APP__BAR__RA_CA',
    })
  })
})
