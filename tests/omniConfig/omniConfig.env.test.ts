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
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with NODE_ENV variant', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,

      dotEnv: {
        nodeEnvVariant: true,
      },
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.test', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with local variant', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,

      dotEnv: {
        localVariants: true,
      },
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.local', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with dist variant', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,

      dotEnv: {
        distVariants: true,
      },
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '/tmp/.env.dist', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with NODE_ENV and local variants', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,

      dotEnv: {
        nodeEnvVariant: true,
        localVariants:  true,
      },
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.local', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.test', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.test.local', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('consider .env file with NODE_ENV and dist variants', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,

      dotEnv: {
        nodeEnvVariant: true,
        distVariants:   true,
      },
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '/tmp/.env.dist', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.test.dist', mapper: expect.any(MetadataBasedKeyMapper) },
      { optional: true, type: 'dotenv', file: '/tmp/.env.test', mapper: expect.any(MetadataBasedKeyMapper) },
    ])
  })

  test('load .env file from non-current directory', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(om).not.toHaveProperty('loaders')

    om.useEnvironmentVariables({
      processEnv: false,
      dotEnv:     {
        directory: '/app',
      },
    })

    expect(om).toHaveProperty('loaders', [
      { optional: true, type: 'dotenv', file: '/app/.env', mapper: expect.any(MetadataBasedKeyMapper) },
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
      { optional: true, type: 'dotenv', file: '/tmp/.env', mapper: customMapper },
      { type: 'process.env', mapper: customMapper },
    ])
  })

  test('attempt to use local and dist variants together', () => {
    const om = new OmniConfig()
    om.withModel(model)

    expect(
      () => om.useEnvironmentVariables({
        processEnv: true,

        dotEnv: {
          localVariants: true,
          distVariants:  true,
        },
      })
    ).toThrow('Local .env variants cannot be used together with "dist" variants.')
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
