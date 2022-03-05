import { processingErrorMock } from '../../fixtures/errors'
import { SyncResolver } from '~/resolver/syncResolver'
import { AsyncResolver } from '~/resolver/asyncResolver'
import { TextErrorFormatter } from '~/errorFormatters/textErrorFormatter'
import { ResolverError } from '~/resolver/resolverError'
import { resolve } from '~/presets/resolve'

jest.mock('~/resolver/asyncResolver')
jest.mock('~/resolver/syncResolver')

describe('Presets', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('resolve()', () => {
    describe('synchronous mode', () => {
      test('successful resolve does not call error logger', async () => {
        const logger = jest.fn()
        const formatter = new TextErrorFormatter()

        const resolver = new SyncResolver([])
        jest.spyOn(resolver, 'resolve').mockReturnValue({ foo: 123 })

        expect(resolve(resolver, { logger, formatter })).toEqual({ foo: 123 })
        expect(logger).not.toHaveBeenCalled()
      })

      test('unsuccessful resolve call error logger with formatter message', async () => {
        const logger = jest.fn()
        const exitSpy = jest.spyOn(process, 'exit').mockReturnValueOnce(null as unknown as never)

        const formatter = new TextErrorFormatter()
        const resolver = new SyncResolver([])

        jest.spyOn(resolver, 'resolve').mockImplementation(() => {
          throw processingErrorMock
        })

        expect(() => resolve(resolver, { logger, formatter })).toThrow(ResolverError)
        expect(logger).toHaveBeenCalledWith(expect.any(String))
        expect(exitSpy).not.toHaveBeenCalled()
      })

      test('unsuccessful resolve cals process.exit() if exit code has been passed', async () => {
        const logger = jest.fn()
        const exitSpy = jest.spyOn(process, 'exit').mockReturnValueOnce(null as unknown as never)

        const formatter = new TextErrorFormatter()
        const resolver = new SyncResolver([])

        jest.spyOn(resolver, 'resolve').mockImplementation(() => {
          throw processingErrorMock
        })

        expect(() => resolve(resolver, { logger, formatter, exitCode: 12 })).toThrow(ResolverError)

        expect(logger).toHaveBeenCalledWith(expect.any(String))
        expect(exitSpy).toHaveBeenCalledWith(12)
      })
    })

    describe('asynchronous mode', () => {
      test('successful resolve does not call error logger', async () => {
        const logger = jest.fn()
        const formatter = new TextErrorFormatter()

        const resolver = new AsyncResolver([])
        jest.spyOn(resolver, 'resolve').mockResolvedValue({ foo: 123 })

        await expect(resolve(resolver, { logger, formatter })).resolves.toEqual({ foo: 123 })
        expect(logger).not.toHaveBeenCalled()
      })

      test('unsuccessful resolve call error logger with formatter message', async () => {
        const logger = jest.fn()
        const exitSpy = jest.spyOn(process, 'exit').mockReturnValueOnce(null as unknown as never)

        const formatter = new TextErrorFormatter()
        const resolver = new AsyncResolver([])

        jest.spyOn(resolver, 'resolve').mockRejectedValue(processingErrorMock)

        await expect(resolve(resolver, { logger, formatter })).rejects.toThrow(ResolverError)
        expect(logger).toHaveBeenCalledWith(expect.any(String))
        expect(exitSpy).not.toHaveBeenCalled()
      })

      test('unsuccessful resolve cals process.exit() if exit code has been passed', async () => {
        const logger = jest.fn()
        const exitSpy = jest.spyOn(process, 'exit').mockReturnValueOnce(null as unknown as never)

        const formatter = new TextErrorFormatter()
        const resolver = new AsyncResolver([])

        jest.spyOn(resolver, 'resolve').mockRejectedValue(processingErrorMock)

        await expect(resolve(resolver, { logger, formatter, exitCode: 12 })).rejects.toThrow(ResolverError)

        expect(logger).toHaveBeenCalledWith(expect.any(String))
        expect(exitSpy).toHaveBeenCalledWith(12)
      })
    })
  })
})
