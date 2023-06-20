import * as yup from 'yup'
import { YupProcessor } from '~/processors/yupProcessor'
import { ProcessEnvLoader } from '~/loaders/env/processEnvLoader'
import { CamelCaseKeyMapper } from '~/loaders/env/keyMappers/camelCaseKeyMapper'
import { EnvKeyMapper } from '~/loaders/env/keyMappers/envKeyMapper'
import { DotEnvLoader } from '~/loaders/env/dotEnvLoader'
import { OptionalLoader } from '~/loaders/optionalLoader'
import { yupDotEnv, yupDotEnvSync, yupEnv, yupEnvSync } from '~/presets/yup'
import { testPresetFactories } from './utils'

jest.mock('~/resolver/asyncResolver')
jest.mock('~/resolver/syncResolver')
jest.mock('~/processors/yupProcessor')
jest.mock('~/loaders/env/dotEnvLoader')
jest.mock('~/loaders/env/processEnvLoader')
jest.mock('~/loaders/env/keyMappers/camelCaseKeyMapper')

describe('Presets', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('yupEnv()', () => {
    const schema = yup.object()

    testPresetFactories('default options', yupEnv, yupEnvSync, (factory, ResolverClass) => {
      const resolver = factory({ schema })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [expect.any(ProcessEnvLoader)],
        expect.any(YupProcessor),
      )

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('key mapper options', yupEnv, yupEnvSync, (factory, ResolverClass) => {
      const resolver = factory({ schema, keyMapper: { prefix: 'FOO__' } })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [expect.any(ProcessEnvLoader)],
        expect.any(YupProcessor),
      )

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(CamelCaseKeyMapper).toHaveBeenLastCalledWith({ prefix: 'FOO__' })

      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('custom key mapper options', yupEnv, yupEnvSync, (factory, ResolverClass) => {
      const keyMapper: EnvKeyMapper = {
        keyToPath: jest.fn(),
        pathToKey: jest.fn(),
      }

      const resolver = factory({ schema, keyMapper })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [expect.any(ProcessEnvLoader)],
        expect.any(YupProcessor),
      )

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(keyMapper)
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })
  })

  describe('yupDotEnv()', () => {
    let cwd: string
    const schema = yup.object()

    beforeAll(() => {
      cwd = process.cwd()
      process.chdir('/tmp')
    })

    afterAll(() => {
      process.chdir(cwd)
    })

    testPresetFactories('default options (local and NODE_ENV-based variants)', yupDotEnv, yupDotEnvSync, (factory, ResolverClass) => {
      const resolver = factory({ schema })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.local'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.test'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.test.local'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('no local, but NODE_ENV-based variants', yupDotEnv, yupDotEnvSync, (factory, ResolverClass) => {
      const resolver = factory({
        schema,
        localVariants: false,
      })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.test'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('no NODE_ENV-based, but local variants', yupDotEnv, yupDotEnvSync, (factory, ResolverClass) => {
      const resolver = factory({
        schema,
        nodeEnvVariant: false,
      })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.local'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('dist variants only', yupDotEnv, yupDotEnvSync, (factory, ResolverClass) => {
      const resolver = factory({
        schema,
        distVariants:   true,
        nodeEnvVariant: false,
        localVariants:  false,
      })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.dist'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('.env end process.env', yupDotEnv, yupDotEnvSync, (factory, ResolverClass) => {
      const resolver = factory({
        schema,
        nodeEnvVariant: false,
        localVariants:  false,
      })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        expect.any(YupProcessor),
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    testPresetFactories('.env only', yupDotEnv, yupDotEnvSync, (factory, ResolverClass) => {
      const resolver = factory({
        schema,
        nodeEnvVariant: false,
        localVariants:  false,
        processEnv:     false,
      })

      expect(resolver).toBeInstanceOf(ResolverClass)

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
        ],
        expect.any(YupProcessor),
      )

      expect(ResolverClass).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
        ],
        expect.any(YupProcessor),
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
      ])

      expect(ProcessEnvLoader).not.toHaveBeenCalled()
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })
  })
})
