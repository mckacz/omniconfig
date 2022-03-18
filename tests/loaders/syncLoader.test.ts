import { SyncLoader } from '~/loaders/syncLoader'
import { Reference } from '~/interfaces/reference'

describe('SyncLoader', () => {
  class TestLoader extends SyncLoader<unknown> {
    loadSync = jest.fn().mockReturnValue({ key: 'value' })

    referenceFor(path: string): Reference {
      return {
        source:     'test',
        identifier: path,
      }
    }
  }

  const loader = new TestLoader()

  test('successful asynchronous load', async () => {
    await expect(loader.load()).resolves.toEqual({ key: 'value' })
  })

  test('failed asynchronous load', async () => {
    loader.loadSync.mockImplementationOnce(() => {
      throw new Error('some error')
    })

    await expect(loader.load()).rejects.toThrow('some error')
  })
})
