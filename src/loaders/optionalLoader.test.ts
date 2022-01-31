import { jest } from '@jest/globals'
import { Loader } from './loader.js'
import { OptionalLoader } from './optionalLoader.js'

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

  test('load configuration', () => {
    expect(loader.load()).toEqual({
      some: 'config',
    })
  })

  test('fail to load configuration', () => {
    fakeLoader.load.mockImplementationOnce(() => {
      throw new Error('some terrible error')
    })

    expect(loader.load()).toBeUndefined()
  })

  test('pass the reference', () => {
    expect(loader.referenceFor('some.path')).toEqual({
      container:  'fake',
      identifier: 'some.path',
    })
  })
})
