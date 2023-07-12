import { BasicDataContainer } from '~/dataContainers/basicDataContainer'
import { LoaderError } from '~/errors/loaderError'
import { ResolverError } from '~/errors/resolverError'
import { ValidationError, ValidationErrorType } from '~/errors/validationError'
import { Loader } from '~/interfaces/loader'
import { Model } from '~/interfaces/model'
import { ValueLoader } from '~/loaders/valueLoader'
import { SyncResolver } from '~/resolver/syncResolver'

describe('SyncResolver', () => {
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

  const loader4: Loader<unknown> = {
    load:          () => Promise.resolve(new BasicDataContainer(loader4, { key: 'value' })),
    getReferences: () => [],
  }

  const model: jest.Mocked<Required<Model<any>>> = {
    getMetadata:  jest.fn().mockReturnValue([]),
    validate:     jest.fn(async (data: any) => ({ ...data, processed: 1 })),
    validateSync: jest.fn((data: any) => ({ ...data, processedSync: 1 })),
  }

  const syncOnlyModel: jest.Mocked<Model<any>> = {
    getMetadata: jest.fn().mockReturnValue([]),
    validate:    jest.fn(async (data: any) => ({ ...data, processed: 3 })),
  }

  test('empty object if no loaders nor processors have been provided', async () => {
    expect(new SyncResolver([]).resolve()).toEqual({})
  })

  test('merge configuration objects from left to right', async () => {
    expect(
      new SyncResolver(
        [loader1, loader2, loader3],
      ).resolve(),
    ).toEqual({
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

    expect(
      new SyncResolver(
        [loader2, loader3, loader1],
      ).resolve(),
    ).toEqual({
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
    jest.spyOn(loader2, 'loadSync').mockImplementationOnce(() => {
      throw new LoaderError('Could not load')
    })

    let err!: ResolverError

    try {
      new SyncResolver(
        [loader1, loader2, loader3],
        model,
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
    model.validateSync.mockImplementationOnce(() => {
      throw new ValidationError('Something is wrong')
    })

    let err!: ResolverError

    try {
      new SyncResolver(
        [loader1, loader2, loader3],
        model,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(ValidationError),
      message:          'Something is wrong',
      isUndefinedError: false,
      reporter:         model,
      path:             undefined,
      references:       [],
    })
  })

  test('decorate invalid value error', async () => {
    model.validateSync.mockImplementationOnce(() => {
      throw new ValidationError('That is wrong', undefined, ['b', 'e', 'g'], ValidationErrorType.invalidValue)
    })

    let err!: ResolverError

    try {
      new SyncResolver(
        [loader1, loader2, loader3],
        model,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(ValidationError),
      message:          'That is wrong',
      isUndefinedError: false,
      reporter:         model,
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
    model.validateSync.mockImplementationOnce(() => {
      throw new ValidationError('That is missing', undefined, ['b', 'e', 'h'], ValidationErrorType.undefinedValue)
    })

    let err!: ResolverError

    try {
      new SyncResolver(
        [loader1, loader2, loader3],
        model,
      ).resolve()
    } catch (ex) {
      err = ex as ResolverError
    }

    expect(err).not.toBeUndefined()
    expect(err).toBeInstanceOf(ResolverError)

    expect(err).toMatchObject({
      error:            expect.any(ValidationError),
      message:          'That is missing',
      isUndefinedError: true,
      reporter:         model,
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

  test('throws error if loader does not support synchronous mode', async () => {
    expect(
      () => new SyncResolver(
        [loader4],
        model,
      ).resolve(),
    ).toThrow()
  })

  test('throws error if processor does not support synchronous mode', async () => {
    expect(
      () => new SyncResolver(
        [loader1],
        syncOnlyModel,
      ).resolve(),
    ).toThrow()
  })
})
