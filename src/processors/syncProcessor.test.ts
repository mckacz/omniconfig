import { SyncProcessor } from './syncProcessor'

describe('SyncProcessor', () => {
  class TestProcessor extends SyncProcessor<unknown, unknown> {
    processSync = jest.fn((v: unknown) => v)
  }

  const processor = new TestProcessor()

  test('successful asynchronous process', async () => {
    await expect(processor.process({ key: 'value' })).resolves.toEqual({ key: 'value' })
  })

  test('failed asynchronous process', async () => {
    processor.processSync.mockImplementationOnce(() => {
      throw new Error('some error')
    })

    await expect(processor.process({ key: 'value' })).rejects.toThrow('some error')
  })
})
