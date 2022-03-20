import { SyncLoader } from '~/loaders/syncLoader'

describe('SyncLoader', () => {
  class TestLoader extends SyncLoader<unknown> {
    loadSync = jest.fn(() => ({ value: { key: 'value' }, getDefinition: () => undefined }))

    getReferences(path: string[]) {
      return [{
        source:     'test',
        identifier: path.join('.'),
      }]
    }
  }

  const loader = new TestLoader()

  test('successful asynchronous load', async () => {
    await expect(loader.load()).resolves.toMatchObject({
      value: { key: 'value' },

      getDefinition: expect.any(Function),
    })
  })

  test('failed asynchronous load', async () => {
    loader.loadSync.mockImplementationOnce(() => {
      throw new Error('some error')
    })

    await expect(loader.load()).rejects.toThrow('some error')
  })
})
