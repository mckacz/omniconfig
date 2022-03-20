import { Loader } from '~/interfaces/loader'
import { BasicDataContainer } from '~/dataContainers/basicDataContainer'
import { Reference } from '~/interfaces/reference'

describe('BasicDataContainer', () => {
  const loader = {
    load:          jest.fn(),
    getReferences: jest.fn().mockReturnValue([]),
  } as jest.Mocked<Loader<unknown>>

  const dataContainer = new BasicDataContainer(loader, { key: 'value' })

  test('return value passed to the constructor', () => {
    expect(dataContainer.value).toEqual({ key: 'value' })
  })

  test('return undefined if loader does not return any references', () => {
    expect(dataContainer.getDefinition(['foo'])).toBeUndefined()
  })

  test('return a reference if loader returned exactly one reference', () => {
    const ref: Reference = {
      source: 'foo',
      identifier: 'bar',
    }

    loader.getReferences.mockReturnValueOnce([ref])

    expect(dataContainer.getDefinition(['foo'])).toBe(ref)
  })

  test('throw exception if loader returned more than one reference', () => {
    const ref: Reference = {
      source: 'foo',
      identifier: 'bar',
    }

    loader.getReferences.mockReturnValueOnce([ref, ref])

    expect(() => dataContainer.getDefinition(['foo'])).toThrow(TypeError)
  })
})
