import { AsyncResolver } from '~/resolver/asyncResolver'
import { ValueLoader } from '~/loaders/valueLoader'
import { LoaderError } from '~/loaders/loaderError'
import { ResolverError } from '~/resolver/resolverError'
import { ProcessorError, ProcessorErrorType } from '~/processors/processorError'

describe('AsyncResolver', () => {
  const loader1 = new ValueLoader({
    a: true,
    b: {
      c: 123,
      d: 234,
      e: {
        f: 'bazinga',
      },
    },
  }, 'loader1')

  const loader2 = new ValueLoader({
    a: undefined,
    b: {
      d: 456,
      e: {
        g: 'just kidding',
      },
    },
  }, 'loader2')

  const loader3 = new ValueLoader({
    b: {
      e: {
        f: 'no',
      },
    },
  }, 'loader3')

  const processor = {
    process: jest.fn(async (data: object) => ({ ...data, processed: 1 })),
  }

  test('empty object if no loaders nor processors have been provided', async () => {
    await expect(new AsyncResolver([]).resolve()).resolves.toEqual({})
  })

  test('merge configuration objects from left to right', async () => {
    await expect(
      new AsyncResolver(
        [loader1, loader2, loader3],
      ).resolve(),
    ).resolves.toEqual({
      a: true,
      b: {
        c: 123,
        d: 456,
        e: {
          f: 'no',
          g: 'just kidding',
        },
      },
    })

    await expect(
      new AsyncResolver(
        [loader2, loader3, loader1],
      ).resolve(),
    ).resolves.toEqual({
      a: true,
      b: {
        c: 123,
        d: 234,
        e: {
          f: 'bazinga',
          g: 'just kidding',
        },
      },
    })
  })

  test('decorate loader error', async () => {
    jest.spyOn(loader2, 'load').mockImplementationOnce(() => {
      throw new LoaderError('Could not load')
    })

    let err!: ResolverError

    try {
      await new AsyncResolver(
        [loader1, loader2, loader3],
        processor,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(LoaderError),
      message:          'Could not load',
      isUndefinedError: false,
      reporter:         loader2,
      path:             undefined,
      references:       [],
    })
  })

  test('decorate generic processing error', async () => {
    processor.process.mockImplementationOnce(() => {
      throw new ProcessorError('Something is wrong')
    })

    let err!: ResolverError

    try {
      await new AsyncResolver(
        [loader1, loader2, loader3],
        processor,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(ProcessorError),
      message:          'Something is wrong',
      isUndefinedError: false,
      reporter:         processor,
      path:             undefined,
      references:       [],
    })
  })

  test('decorate invalid value error', async () => {
    processor.process.mockImplementationOnce(() => {
      throw new ProcessorError('That is wrong', undefined, ['b', 'e', 'g'], ProcessorErrorType.invalidValue)
    })

    let err!: ResolverError

    try {
      await new AsyncResolver(
        [loader1, loader2, loader3],
        processor,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(ProcessorError),
      message:          'That is wrong',
      isUndefinedError: false,
      reporter:         processor,
      path:             ['b', 'e', 'g'],
      references:       [
        {
          source:     'loader2',
          identifier: 'b.e.g',
        },
      ],
    })
  })

  test('decorate undefined value error', async () => {
    processor.process.mockImplementationOnce(() => {
      throw new ProcessorError('That is missing', undefined, ['b', 'e', 'h'], ProcessorErrorType.undefinedValue)
    })

    let err!: ResolverError

    try {
      await new AsyncResolver(
        [loader1, loader2, loader3],
        processor,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(ProcessorError),
      message:          'That is missing',
      isUndefinedError: true,
      reporter:         processor,
      path:             ['b', 'e', 'h'],
      references:       [
        {
          source:     'loader1',
          identifier: 'b.e.h',
        },
        {
          source:     'loader2',
          identifier: 'b.e.h',
        },
        {
          source:     'loader3',
          identifier: 'b.e.h',
        },
      ],
    })
  })
})
