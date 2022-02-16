import * as yup from 'yup'
import Presets from './presets'
import { Resolver } from '../resolver/resolver'
import { YupProcessor } from '../processors/yupProcessor'
import { ProcessEnvLoader } from '../loaders/env/processEnvLoader'
import { CamelCaseKeyMapper } from '../loaders/env/keyMappers/camelCaseKeyMapper'
import { EnvKeyMapper } from '../loaders/env/keyMappers/envKeyMapper'
import { DotEnvLoader } from '../loaders/env/dotEnvLoader'
import { OptionalLoader } from '../loaders/optionalLoader'
import { TextErrorFormatter } from '../errorFormatters/textErrorFormatter'
import { processingErrorMock } from '../../fixtures/errors'
import { ResolverError } from '../resolver/resolverError'

jest.mock('../resolver/resolver')
jest.mock('../processors/yupProcessor')
jest.mock('../loaders/env/dotEnvLoader')
jest.mock('../loaders/env/processEnvLoader')
jest.mock('../loaders/env/keyMappers/camelCaseKeyMapper')

describe('Presets', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('yupEnv()', () => {
    const schema = yup.object()

    test('default options', () => {
      const resolver = Presets.yupEnv({ schema })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [expect.any(ProcessEnvLoader)],
        [expect.any(YupProcessor)],
      )

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    test('key mapper options', () => {
      const resolver = Presets.yupEnv({ schema, keyMapper: { prefix: 'FOO__' } })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [expect.any(ProcessEnvLoader)],
        [expect.any(YupProcessor)],
      )

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(CamelCaseKeyMapper).toHaveBeenLastCalledWith({ prefix: 'FOO__' })

      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    test('custom key mapper options', () => {
      const keyMapper: EnvKeyMapper = {
        keyToPath: jest.fn(),
        pathToKey: jest.fn(),
      }

      const resolver = Presets.yupEnv({ schema, keyMapper })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [expect.any(ProcessEnvLoader)],
        [expect.any(YupProcessor)],
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

    test('default options (local and NODE_ENV-based variants)', () => {
      const resolver = Presets.yupDotEnv({ schema })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
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

    test('no local, but NODE_ENV-based variants', () => {
      const resolver = Presets.yupDotEnv({
        schema,
        localVariants: false,
      })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.test'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    test('no NODE_ENV-based, but local variants', () => {
      const resolver = Presets.yupDotEnv({
        schema,
        nodeEnvVariant: false,
      })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
        [expect.any(CamelCaseKeyMapper), '/tmp/.env.local'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    test('.env end process.env', () => {
      const resolver = Presets.yupDotEnv({
        schema,
        nodeEnvVariant: false,
        localVariants:  false,
      })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
          expect.any(ProcessEnvLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
      ])

      expect(ProcessEnvLoader).toHaveBeenLastCalledWith(expect.any(CamelCaseKeyMapper))
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })

    test('.env only', () => {
      const resolver = Presets.yupDotEnv({
        schema,
        nodeEnvVariant: false,
        localVariants:  false,
        processEnv:     false,
      })

      expect(resolver).toBeInstanceOf(Resolver)

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.any(OptionalLoader),
        ],
        [expect.any(YupProcessor)],
      )

      expect(Resolver).toHaveBeenLastCalledWith(
        [
          expect.objectContaining({ loader: expect.any(DotEnvLoader) }),
        ],
        [expect.any(YupProcessor)],
      )

      expect((DotEnvLoader as jest.Mock<DotEnvLoader>).mock.calls).toEqual([
        [expect.any(CamelCaseKeyMapper), '/tmp/.env'],
      ])

      expect(ProcessEnvLoader).not.toHaveBeenCalled()
      expect(YupProcessor).toHaveBeenLastCalledWith(schema)
    })
  })

  describe('resolve()', () => {
    test('successful resolve does not call error logger', async () => {
      const logger = jest.fn()
      const formatter = new TextErrorFormatter()

      const resolver = new Resolver([])
      jest.spyOn(resolver, 'resolve').mockResolvedValue({ foo: 123 })

      await expect(Presets.resolve(resolver, { logger, formatter })).resolves.toEqual({ foo: 123 })
      expect(logger).not.toHaveBeenCalled()
    })

    test('unsuccessful resolve call error logger with formatter message', async () => {
      const logger = jest.fn()
      const exitSpy = jest.spyOn(process, 'exit').mockReturnValueOnce(null as unknown as never)

      const formatter = new TextErrorFormatter()
      const resolver = new Resolver([])

      jest.spyOn(resolver, 'resolve').mockRejectedValue(processingErrorMock)

      await expect(Presets.resolve(resolver, { logger, formatter })).rejects.toThrow(ResolverError)
      expect(logger).toHaveBeenCalledWith(expect.any(String))
      expect(exitSpy).not.toHaveBeenCalled()
    })

    test('unsuccessful resolve cals process.exit() if exit code has been passed', async () => {
      const logger = jest.fn()
      const exitSpy = jest.spyOn(process, 'exit').mockReturnValueOnce(null as unknown as never)

      const formatter = new TextErrorFormatter()
      const resolver = new Resolver([])

      jest.spyOn(resolver, 'resolve').mockRejectedValue(processingErrorMock)

      await expect(Presets.resolve(resolver, { logger, formatter, exitCode: 12 })).rejects.toThrow(ResolverError)

      expect(logger).toHaveBeenCalledWith(expect.any(String))
      expect(exitSpy).toHaveBeenCalledWith(12)
    })
  })
})
