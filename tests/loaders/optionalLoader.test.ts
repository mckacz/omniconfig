import { Loader } from '~/interfaces/loader'
import { OptionalLoader } from '~/loaders/optionalLoader'
import { BasicDataContainer } from '~/dataContainers/basicDataContainer'

describe('OptionalLoader', () => {
  const fakeLoader = {
    load: jest.fn(async () => new BasicDataContainer(fakeLoader, {
      some: 'config',
    })),

    loadSync: jest.fn(() => new BasicDataContainer(fakeLoader, {
      some: 'config',
    })),

    getReferences: jest.fn(path => [{
      source:     'fake',
      identifier: path.join('.'),
    }]),
  } as jest.Mocked<Required<Loader<unknown>>>

  const loader = new OptionalLoader(fakeLoader)

  test('pass the reference', () => {
    expect(loader.getReferences(['some', 'path'])).toEqual([{
      source:     'fake',
      identifier: 'some.path',
    }])
  })

  describe('asynchronous load', () => {
    test('load configuration', async () => {
      await expect(loader.load()).resolves.toMatchObject({
        value: {
          some: 'config',
        },

        getDefinition: expect.any(Function),
      })
    })

    test('fail to load configuration', async () => {
      fakeLoader.load.mockImplementationOnce(() => Promise.reject(new Error('some terrible error')))

      await expect(loader.load()).resolves.toMatchObject({
        value: {},
        getDefinition: expect.any(Function),
      })
    })
  })

  describe('synchronous load', () => {
    test('load configuration', async () => {
      expect(loader.loadSync()).toMatchObject({
        value: {
          some: 'config',
        },

        getDefinition: expect.any(Function),
      })
    })

    test('fail to load configuration', async () => {
      fakeLoader.loadSync.mockImplementationOnce(() => {
        throw new Error('some terrible error')
      })

      expect(loader.loadSync()).toMatchObject({
        value: {},
        getDefinition: expect.any(Function),
      })
    })

    test('synchronous mode not supported', async () => {
      const asyncOnlyLoader = new OptionalLoader({
        load: jest.fn(async () => new BasicDataContainer(asyncOnlyLoader, {
          some: 'config',
        })),

        getReferences: jest.fn(path => [{
          source:     'fake',
          identifier: path.join('.'),
        }]),
      }) as OptionalLoader<unknown>

      expect(() => asyncOnlyLoader.loadSync()).toThrow(TypeError)
    })
  })
})
