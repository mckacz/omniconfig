import { YamlFileLoader } from '~/loaders/file/yamlFileLoader'
import { OptionalLoader } from '~/loaders/optionalLoader'
import { OmniConfig } from '~/omniConfig'

jest.mock('~/loaders/optionalLoader')
jest.mock('~/loaders/file/yamlFileLoader')

describe('OmniConfig - YAML', () => {
  const originalCWD = process.cwd()
  process.chdir('/tmp')

  jest.mocked(OptionalLoader).mockImplementation(loader => ({ optional: true, ...loader }) as never)
  jest.mocked(YamlFileLoader).mockImplementation((load, file, section) => ({ type: 'yaml', file, section }) as never)

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

  test('consider a YAML file with section specified', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useYamlFiles({
      template: 'app.yml',
      section:  ['nested', 'section'],
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'yaml', file: 'app.yml', section: ['nested', 'section'] },
    ])
  })
})
