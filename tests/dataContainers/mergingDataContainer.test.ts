import { MergedDataContainer } from '~/dataContainers/mergedDataContainer'
import { DataContainer } from '~/interfaces/dataContainer'

describe('MergedDataContainer', () => {
  const c1: DataContainer<unknown> = {
    value: {
      a: 1,
      b: 1,
      c: {
        d: '1',
        e: {
          f: true,
        },
      },
    },

    getDefinition: (path: string[]) => ({ identifier: path.join('.'), source: 'c1' }),
  }

  const c2: DataContainer<unknown> = {
    value: {
      b: 2,
      c: {
        g: 2,
      },
      j: 2,
    },

    getDefinition: (path: string[]) => ({ identifier: path.join('.'), source: 'c2' }),
  }

  const c3: DataContainer<unknown> = {
    value: {
      j: 3,
      k: 3,
    },

    getDefinition: (path: string[]) => ({ identifier: path.join('.'), source: 'c3' }),
  }

  const merged = new MergedDataContainer([c1, c2, c3])

  test('values are merged from left to right', () => {
    expect(merged.value).toEqual({
      a: 1,
      b: 2,
      c: {
        d: '1',
        e: {
          f: true,
        },
        g: 2,
      },
      j: 3,
      k: 3,
    })
  })

  test.each([
    ['a', 'c1'],
    ['b', 'c2'],
    ['c', 'c2'],
    ['c.d', 'c1'],
    ['c.e', 'c1'],
    ['c.e.f', 'c1'],
    ['c.g', 'c2'],
    ['j', 'c3'],
    ['k', 'c3'],
    ['l', undefined],
    ['a.b.c', undefined],
  ])('getDefinition() for path %s returns reference to %s', (identifier: string, source: string | undefined) => {
    if (source === undefined) {
      expect(merged.getDefinition(identifier.split('.'))).toBeUndefined()
    } else {
      expect(merged.getDefinition(identifier.split('.'))).toEqual({ identifier, source })
    }
  })
})
