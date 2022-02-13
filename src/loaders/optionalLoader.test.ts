import { Loader } from './loader'
import { OptionalLoader } from './optionalLoader'

describe('OptionalLoader', () => {
  const fakeLoader = {
    load: jest.fn(() => ({
      some: 'config',
    })),

    referenceFor: jest.fn(path => ({
      container:  'fake',
      identifier: path,
    })),
  } as jest.Mocked<Loader<unknown>>

  const loader = new OptionalLoader(fakeLoader)

  test('load configuration', async () => {
    await expect(loader.load()).resolves.toEqual({
      some: 'config',
    })
  })

  test('fail to load configuration', async () => {
    fakeLoader.load.mockImplementationOnce(async () => {
      throw new Error('some terrible error')
    })

    await expect(loader.load()).resolves.toBeUndefined()
  })

  test('pass the reference', () => {
    expect(loader.referenceFor('some.path')).toEqual({
      container:  'fake',
      identifier: 'some.path',
    })
  })
})
