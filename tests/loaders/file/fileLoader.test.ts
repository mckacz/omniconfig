import { FileLoader } from '~/loaders/file/fileLoader'
import { FileLoaderError } from '~/loaders/file/fileLoaderError'

describe('FileLoader', () => {
  const testFile = 'fixtures/data/generic.txt'

  class TestFileLoader extends FileLoader<unknown> {
    parse = jest.fn().mockReturnValue({
      foo:  'bar',
      some: {
        nested: {
          value: 123,
        },
      },
    })
  }

  test('load a valid file', () => {
    const loader        = new TestFileLoader(testFile)
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      foo:  'bar',
      some: {
        nested: {
          value: 123,
        },
      },
    })

    expect(dataContainer.getDefinition(['foo'])).toEqual({
      source:     testFile,
      identifier: 'foo',
    })

    expect(loader.parse).toHaveBeenCalledWith('data to parse\n')
  })

  test('load a section JSON file (using string notation)', () => {
    const loader        = new TestFileLoader(testFile, 'some.nested')
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      value: 123,
    })

    expect(dataContainer.getDefinition(['value'])).toEqual({
      source:     testFile,
      identifier: 'some.nested.value',
    })
  })

  test('load a section JSON file (using array notation)', () => {
    const loader        = new TestFileLoader(testFile, ['some', 'nested'])
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toEqual({
      value: 123,
    })

    expect(dataContainer.getDefinition(['value'])).toEqual({
      source:     testFile,
      identifier: 'some.nested.value',
    })
  })

  test('load a not existing section JSON file', () => {
    const loader        = new TestFileLoader(testFile, ['some', 'other'])
    const dataContainer = loader.loadSync()

    expect(dataContainer.value).toBeUndefined()
  })

  test('get references', () => {
    const loader = new TestFileLoader(testFile)

    expect(loader.getReferences(['foo'])).toEqual([
      {
        source:     testFile,
        identifier: 'foo',
      },
    ])
  })

  test('get references (with section)', () => {
    const loader = new TestFileLoader(testFile, 'some.section')

    expect(loader.getReferences(['foo'])).toEqual([
      {
        source:     testFile,
        identifier: 'some.section.foo',
      },
    ])
  })

  test('attempt to load an invalid JSON file', () => {
    const loader = new TestFileLoader(testFile)

    loader.parse.mockImplementation(() => {
      throw new Error('unable to parse')
    })

    expect(() => loader.loadSync()).toThrow(FileLoaderError)
    expect(() => loader.loadSync()).toThrow('unable to parse')
  })
})
