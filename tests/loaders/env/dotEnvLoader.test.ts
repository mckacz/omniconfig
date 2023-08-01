import { parse } from 'dotenv'
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

  const loader = new DotEnvLoader(mapper, validEnvFile, parse)

  test('load configuration', () => {
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      debug: 'false',
      db:    {
        host:     'localhost',
        port:     '5432',
        username: 'toor',
        password: '2c0mplex2Btrue',
      },
    })

    expect(dataContainer.getDefinition(['db', 'port'])).toEqual({
      source:     validEnvFile,
      identifier: 'APP__DB__PORT',
    })
  })

  test('get reference', () => {
    expect(loader.getReferences(['db', 'port'])).toEqual([{
      source:     validEnvFile,
      identifier: 'APP__DB__PORT',
    }])
  })

  test('attempt to load not existing file', () => {
    const loader2 = new DotEnvLoader(mapper, notExistingEnvFile, parse)

    expect(() => loader2.loadSync()).toThrow(DotEnvLoaderError)
  })
})
