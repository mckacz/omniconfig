import { JsonFileLoader } from '~/loaders/json/jsonFileLoader'
import { OptionalLoader } from '~/loaders/optionalLoader'
import { OmniConfig } from '~/omniConfig'

jest.mock('~/loaders/optionalLoader')
jest.mock('~/loaders/json/jsonFileLoader')

describe('OmniConfig - JSON', () => {
  const originalCWD = process.cwd()
  process.chdir('/tmp')

  jest.mocked(OptionalLoader).mockImplementation(loader => ({ optional: true, ...loader }) as never)
  jest.mocked(JsonFileLoader).mockImplementation((file) => ({ type: 'json', file }) as never)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.chdir(originalCWD)
  })

  test('consider single JSON file only', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useJsonFiles('app.json')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'json', file: 'app.json' },
    ])
  })

  test('consider JSON file with NODE_ENV and local variants', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useJsonFiles('app[.node_env][.local].json')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'json', file: 'app.json' },
      { optional: true, type: 'json', file: 'app.local.json' },
      { optional: true, type: 'json', file: 'app.test.json' },
      { optional: true, type: 'json', file: 'app.test.local.json' },
    ])
  })

  test('consider JSON file with NODE_ENV and dist variants', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useJsonFiles('app[.node_env].json[.dist]')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'json', file: 'app.json.dist' },
      { optional: true, type: 'json', file: 'app.json' },
      { optional: true, type: 'json', file: 'app.test.json.dist' },
      { optional: true, type: 'json', file: 'app.test.json' },
    ])
  })
})
