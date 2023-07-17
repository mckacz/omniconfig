import { Metadata } from '~/interfaces/metadata'
import { Model } from '~/interfaces/model'
import { DotEnvLoader } from '~/loaders/env/dotEnvLoader'
import { EnvKeyMapper } from '~/loaders/env/keyMappers/envKeyMapper'
import { MetadataBasedKeyMapper } from '~/loaders/env/keyMappers/metadataBasedKeyMapper'
import { ProcessEnvLoader } from '~/loaders/env/processEnvLoader'
import { OptionalLoader } from '~/loaders/optionalLoader'
import { OmniConfig } from '~/omniConfig'

jest.mock('~/loaders/optionalLoader')
jest.mock('~/loaders/env/dotEnvLoader')
jest.mock('~/loaders/env/processEnvLoader')
jest.mock('~/loaders/env/keyMappers/metadataBasedKeyMapper')

describe('OmniConfig - environment variables', () => {
  const originalCWD = process.cwd()
  process.chdir('/tmp')

  const metadata: Metadata[] = [
    { path: ['foo'] },
    { path: ['bar'] },
  ]

  const model: Model<unknown> = {
    validate:    input => Promise.resolve(input),
    getMetadata: () => metadata,
  }

  jest.mocked(OptionalLoader).mockImplementation(loader => ({ optional: true, ...loader }) as never)
  jest.mocked(DotEnvLoader).mockImplementation((mapper, file) => ({ type: 'dotenv', mapper, file }) as never)
  jest.mocked(ProcessEnvLoader).mockImplementation(mapper => ({ type: 'process.env', mapper }) as never)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.chdir(originalCWD)
  })

  test('consider process.env only (default)', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables()

    expect(om).toHaveProperty('loaders', [
      { type: 'process.env', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file only', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,
      dotEnv:     true,
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '.env', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with NODE_ENV and local variants', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,
      dotEnv:     '.env[.node_env][.local]',
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '.env', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '.env.local', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '.env.test', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '.env.test.local', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with NODE_ENV and dist variants', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,
      dotEnv:     '.env[.node_env][.dist]',
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '.env.dist', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '.env', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '.env.test.dist', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '.env.test', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('use custom environment variable mapper', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    const customMapper: EnvKeyMapper = {
      keyToPath: (key: string) => [key],
      pathToKey: (path: string[]) => path?.[0],
    }

    om.useEnvironmentVariables({
      processEnv: true,
      dotEnv:     true,
      envMapper:  customMapper,
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '.env', mapper: customMapper },
      { type: 'process.env', mapper: customMapper },
    ])
  })

  test('attempt to use environment variables with default variable mapper before the model is set', () => {
    const om = new OmniConfig()

    expect(() => om.useEnvironmentVariables()).toThrow('Model must be set before .useEnvironmentVariables() is called.')
  })

  test('attempt to use environment variables with default variable mapper and model does not support metadata', () => {
    const om = new OmniConfig()
    om.withModel({
      validate: (input: unknown) => Promise.resolve(input),
    })

    expect(
      () => om.useEnvironmentVariables()
    ).toThrow('Model does not support returning metadata and metadata has not been provided.')
  })
})
