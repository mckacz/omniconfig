import { DotEnvLoader } from '~/loaders/env/dotEnvLoader'
import { DotEnvLoaderError } from '~/loaders/env/dotEnvLoaderError'
import { CamelCaseKeyMapper } from '~/loaders/env/keyMappers/camelCaseKeyMapper'

const validEnvFile = 'fixtures/data/.env'
const notExistingEnvFile = 'fixtures/data/.env.foo'

describe('DotEnvLoader', () => {
  const mapper = new CamelCaseKeyMapper({
    prefix:    'APP__',
    separator: '__',
  })

  const loader = new DotEnvLoader(mapper, validEnvFile)

  test('load configuration', () => {
    expect(loader.loadSync()).toEqual({
      debug: 'false',
      db:    {
        host:     'localhost',
        port:     '5432',
        username: 'toor',
        password: '2c0mplex2Btrue',
      },
    })
  })

  test('get reference', () => {
    expect(loader.referenceFor('db.port')).toEqual({
      container: validEnvFile,
      identifier: 'APP__DB__PORT',
    })
  })

  test('attempt to load not existing file', () => {
    const loader = new DotEnvLoader(mapper, notExistingEnvFile)

    expect(() => loader.loadSync()).toThrow(DotEnvLoaderError)
  })
})
