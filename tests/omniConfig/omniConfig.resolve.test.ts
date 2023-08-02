import { TextErrorFormatter } from '~/errorFormatters/textErrorFormatter'
import { ResolverError } from '~/errors/resolverError'
import { ValidationError } from '~/errors/validationError'
import { OmniConfig } from '~/omniConfig'
import { AsyncResolver } from '~/resolver/asyncResolver'
import { SyncResolver } from '~/resolver/syncResolver'

jest.mock('~/resolver/syncResolver')
jest.mock('~/resolver/asyncResolver')
jest.mock('~/utils/dependencies')
jest.mock('~/errorFormatters/textErrorFormatter')

describe('OmniConfig - configuration resolving', () => {
  const createLogger = () => ({
    log: jest.fn(),
    error: jest.fn(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('resolve()', () => {
    test('resolve using AsyncResolver', async () => {
      jest.mocked(AsyncResolver).prototype.resolve.mockResolvedValue({ resolved: true })

      const loader = Symbol() as never
      const model = Symbol() as never

      const om = new OmniConfig()
      om.withModel(model).useLoader(loader)

      await expect(om.resolve()).resolves.toEqual({ resolved: true })

      expect(AsyncResolver).toBeCalledWith([loader], model)
    })

    test('handle error with provided logger and formatter', async () => {
      const error = new ResolverError(new ValidationError('Something went wrong'))
      jest.mocked(AsyncResolver).prototype.resolve.mockRejectedValue(error)

      const logger = createLogger()

      const formatter = { format: jest.fn().mockReturnValue('foo') }
      const om = new OmniConfig()

      await expect(om.resolve({ logger, formatter })).rejects.toThrow(error)

      expect(formatter.format).toHaveBeenCalledWith(error)
      expect(logger.error).toHaveBeenCalledWith('foo')
    })

    test('handle error with default logger and formatter', async () => {
      const error = new ResolverError(new ValidationError('Something went wrong'))
      jest.mocked(AsyncResolver).prototype.resolve.mockRejectedValue(error)

      const logger = jest.spyOn(console, 'error').mockReturnValueOnce()
      const mockedTextFormatter = jest.mocked(TextErrorFormatter)
      mockedTextFormatter.prototype.format.mockReturnValue('foo')

      const om = new OmniConfig()
      await expect(om.resolve()).rejects.toThrow(error)

      expect(TextErrorFormatter).toHaveBeenCalled()
      expect(mockedTextFormatter.prototype.format).toHaveBeenCalledWith(error)
      expect(logger).toHaveBeenCalledWith('foo')
    })
  })

  describe('resolveSync()', () => {
    test('resolve using SyncResolver', async () => {
      jest.mocked(SyncResolver).prototype.resolve.mockReturnValue({ resolved: true })

      const loader = Symbol() as never
      const model = Symbol() as never

      const om = new OmniConfig()
      om.withModel(model).useLoader(loader)

      expect(om.resolveSync()).toEqual({ resolved: true })

      expect(SyncResolver).toBeCalledWith([loader], model)
    })

    test('handle error with provided logger and formatter', async () => {
      const error = new ResolverError(new ValidationError('Something went wrong'))

      jest.mocked(SyncResolver).prototype.resolve.mockImplementation(() => {
        throw error
      })

      const logger = createLogger()

      const formatter = { format: jest.fn().mockReturnValue('foo') }
      const om = new OmniConfig()

      expect(() => om.resolveSync({ logger, formatter })).toThrow(error)

      expect(formatter.format).toHaveBeenCalledWith(error)
      expect(logger.error).toHaveBeenCalledWith('foo')
    })

    test('handle error with default logger and formatter', async () => {
      const error = new ResolverError(new ValidationError('Something went wrong'))

      jest.mocked(SyncResolver).prototype.resolve.mockImplementation(() => {
        throw error
      })

      const logger = jest.spyOn(console, 'error').mockReturnValueOnce()
      const mockedTextFormatter = jest.mocked(TextErrorFormatter)
      mockedTextFormatter.prototype.format.mockReturnValue('foo')

      const om = new OmniConfig()
      expect(() => om.resolveSync()).toThrow(error)

      expect(TextErrorFormatter).toHaveBeenCalled()
      expect(mockedTextFormatter.prototype.format).toHaveBeenCalledWith(error)
      expect(logger).toHaveBeenCalledWith('foo')
    })
  })
})
