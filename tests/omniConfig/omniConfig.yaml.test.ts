import { OptionalLoader } from '~/loaders/optionalLoader'
import { YamlFileLoader } from '~/loaders/yaml/yamlFileLoader'
import { OmniConfig } from '~/omniConfig'

jest.mock('~/loaders/optionalLoader')
jest.mock('~/loaders/yaml/yamlFileLoader')

describe('OmniConfig - YAML', () => {
  const originalCWD = process.cwd()
  process.chdir('/tmp')

  jest.mocked(OptionalLoader).mockImplementation(loader => ({ optional: true, ...loader }) as never)
  jest.mocked(YamlFileLoader).mockImplementation((file) => ({ type: 'yaml', file }) as never)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.chdir(originalCWD)
  })

  test('consider single YAML file only', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useYamlFiles('app.yml')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'yaml', file: 'app.yml' },
    ])
  })

  test('consider YAML file with NODE_ENV and local variants', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useYamlFiles('app[.node_env][.local].yml')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'yaml', file: 'app.yml' },
      { optional: true, type: 'yaml', file: 'app.local.yml' },
      { optional: true, type: 'yaml', file: 'app.test.yml' },
      { optional: true, type: 'yaml', file: 'app.test.local.yml' },
    ])
  })

  test('consider YAML file with NODE_ENV and dist variants', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useYamlFiles('app[.node_env].yml[.dist]')

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'yaml', file: 'app.yml.dist' },
      { optional: true, type: 'yaml', file: 'app.yml' },
      { optional: true, type: 'yaml', file: 'app.test.yml.dist' },
      { optional: true, type: 'yaml', file: 'app.test.yml' },
    ])
  })
})
