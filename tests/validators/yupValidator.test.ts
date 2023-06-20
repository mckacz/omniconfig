import * as yup from 'yup'
import { YupValidator } from '~/validators/yupValidator'
import { ValidationError, ValidationErrorType } from '~/validators/validationError'

describe('YupValidator', () => {
  const schema = yup.object({
    debug: yup.boolean(),
    db:    yup.object({
      host:     yup.string().default('localhost'),
      port:     yup.number().min(1).max(65535).default(5432),
      username: yup.string().required(),
      password: yup.string().required(),
    }),
  })

  const validator = new YupValidator(schema)

  test('process the configuration', async () => {
    const payload = {
      debug: '1',
      db:    {
        port:     '1234',
        username: 'foo',
        password: 'bar',
        encoding: 'utf-8',
      },
    }

    await expect(validator.validate(payload)).resolves.toEqual({
      debug: true,

      db: {
        host:     'localhost',
        port:     1234,
        username: 'foo',
        password: 'bar',
      },
    })
  })

  test('invalid value error', async () => {
    const payload = {
      debug: '1',
      db:    {
        port:     '-5',
        username: 'foo',
        password: 'bar',
        encoding: 'utf-8',
      },
    }

    let err: unknown

    try {
      await validator.validate(payload)
    } catch (ex) {
      err = ex
    }

    expect(err).toBeInstanceOf(ValidationError)

    expect(err).toMatchObject({
      type: ValidationErrorType.invalidValue,
      path: ['db', 'port'],

      error: expect.objectContaining({
        message: 'db.port must be greater than or equal to 1',
      }),
    })
  })

  test('undefined value error', async () => {
    const payload = {
      debug: '1',
      db:    {
        password: 'bar',
        encoding: 'utf-8',
      },
    }

    let err: unknown

    try {
      await validator.validate(payload)
    } catch (ex) {
      err = ex
    }

    expect(err).toBeInstanceOf(ValidationError)

    expect(err).toMatchObject({
      type: ValidationErrorType.undefinedValue,
      path: ['db', 'username'],

      error: expect.objectContaining({
        message: 'db.username is a required field',
      }),
    })
  })
})
