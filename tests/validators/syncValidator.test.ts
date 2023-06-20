import { SyncValidator } from '~/validators/syncValidator'

describe('SyncValidator', () => {
  class TestValidator extends SyncValidator<unknown, unknown> {
    validateSync = jest.fn((v: unknown) => v)
  }

  const validator = new TestValidator()

  test('successful asynchronous validation', async () => {
    await expect(validator.validate({ key: 'value' })).resolves.toEqual({ key: 'value' })
  })

  test('failed asynchronous validation', async () => {
    validator.validateSync.mockImplementationOnce(() => {
      throw new Error('some error')
    })

    await expect(validator.validate({ key: 'value' })).rejects.toThrow('some error')
  })
})
