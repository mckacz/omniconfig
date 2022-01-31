import { DotEnvLoader } from './dotEnvLoader.js'
import { DotEnvLoaderError } from './dotEnvLoaderError.js'
import { CamelCaseKeyMapper } from './keyMappers/camelCaseKeyMapper.js'

const validEnvFile = 'mocks/data/.env'
const notExistingEnvFile = 'mocks/data/.env.foo'

describe('DotEnvLoader', () => {
  const mapper = new CamelCaseKeyMapper({
    prefix:    'APP__',
    separator: '__',
  })

  const loader = new DotEnvLoader(mapper, validEnvFile)

  test('load configuration', () => {
    expect(loader.load()).toEqual({
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

    expect(() => loader.load()).toThrow(DotEnvLoaderError)
  })
})
