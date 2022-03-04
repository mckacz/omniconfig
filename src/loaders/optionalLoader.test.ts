import { Loader } from './loader'
import { OptionalLoader } from './optionalLoader'

describe('OptionalLoader', () => {
  const fakeLoader = {
    load: jest.fn().mockResolvedValue({
      some: 'config',
    }),

    loadSync: jest.fn().mockReturnValue({
      some: 'config',
    }),

    referenceFor: jest.fn(path => ({
      container:  'fake',
      identifier: path,
    })),
  } as jest.Mocked<Required<Loader<unknown>>>

  const loader = new OptionalLoader(fakeLoader)

  test('pass the reference', () => {
    expect(loader.referenceFor('some.path')).toEqual({
      container:  'fake',
      identifier: 'some.path',
    })
  })

  describe('asynchronous load', () => {
    test('load configuration', async () => {
      await expect(loader.load()).resolves.toEqual({
        some: 'config',
      })
    })

    test('fail to load configuration', async () => {
      fakeLoader.load.mockImplementationOnce(() => Promise.reject(new Error('some terrible error')))

      await expect(loader.load()).resolves.toBeUndefined()
    })
  })

  describe('synchronous load', () => {
    test('load configuration', async () => {
      expect(loader.loadSync()).toEqual({
        some: 'config',
      })
    })

    test('fail to load configuration', async () => {
      fakeLoader.loadSync.mockImplementationOnce(() => {
        throw new Error('some terrible error')
      })

      expect(loader.loadSync()).toBeUndefined()
    })

    test('synchronous mode not supported', async () => {
      const asyncOnlyLoader = new OptionalLoader({
        load: jest.fn().mockResolvedValue({
          some: 'config',
        }),

        referenceFor: jest.fn(path => ({
          container:  'fake',
          identifier: path,
        })),
      } as Loader<unknown>)

      expect(() => asyncOnlyLoader.loadSync()).toThrow(TypeError)
    })
  })
})
