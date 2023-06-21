import Ajv, { AnySchemaObject, AsyncSchema } from 'ajv'
import { AjvValidator } from '~/validators/ajvValidator'
import { ValidationError, ValidationErrorType } from '~/validators/validationError'
import { SomeJSONSchema } from 'ajv/dist/types/json-schema'
import { catchError, catchRejection } from '../utils'
import { AnyValidateFunction } from 'ajv/dist/types'

describe('AjvValidator', () => {
  const schema: SomeJSONSchema = {
    type:     'object',
    required: ['debug', 'db'],

    additionalProperties: false,

    properties: {
      debug: {
        type: 'boolean'
      },

      db: {
        type:     'object',
        required: ['username', 'password'],

        additionalProperties: false,

        properties: {
          host:     {
            type:    'string',
            default: 'localhost',
          },
          port:     {
            type:    'number',
            minimum: 1,
            maximum: 65535,
            default: 5432,
          },
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        }
      }
    }
  }

  const asyncSchema: AsyncSchema = {$async: true, ...schema}

  const validPayload = {
    debug: 'true',
    db:    {
      port:     '1234',
      username: 'foo',
      password: 'bar',
      encoding: 'utf-8',
    },
  }

  const invalidValuePayload = {
    debug: 'true',
    db:    {
      port:     '-1',
      username: 'foo',
      password: 'bar',
      encoding: 'utf-8',
    },
  }

  const undefinedValuePayload = {
    debug: 'true',
    db:    {
      password: 'bar',
      encoding: 'utf-8',
    },
  }

  const resultOfValidPayload = {
    debug: true,

    db: {
      host:     'localhost',
      port:     1234,
      username: 'foo',
      password: 'bar',
    },
  }

  const invalidValueErrorData = {
    type:    ValidationErrorType.invalidValue,
    path:    ['db', 'port'],
    message: 'must be >= 1'
  }

  const undefinedValueErrorData = {
    type:    ValidationErrorType.undefinedValue,
    path:    ['db', 'username'],
    message: 'is required'
  }

  const ajv = new Ajv({
    coerceTypes:      true,
    useDefaults:      true,
    removeAdditional: true
  })

  const fn = ajv.compile(schema)
  const asyncFn = ajv.compile(asyncSchema)

  describe.each([
    ['synchronous validation function', fn],
    ['synchronous schema', schema],
  ])('synchronous validation of %s', (_: string, fnOrSchema: AnyValidateFunction | AnySchemaObject) => {
    const validator = new AjvValidator(fnOrSchema)

    test('validate the configuration', () => {
      expect(validator.validateSync(validPayload)).toEqual(resultOfValidPayload)
    })

    test('invalid value error', () => {
      const err = catchError(() => validator.validateSync(invalidValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(invalidValueErrorData)
    })

    test('undefined value error', () => {
      const err = catchError(() => validator.validateSync(undefinedValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(undefinedValueErrorData)
    })
  })

  describe.each([
    ['synchronous validation function', fn],
    ['asynchronous validation function', asyncFn],
    ['synchronous schema', schema],
    ['asynchronous schema', asyncSchema],
  ])('asynchronous validation using %s', (_: string, fnOrSchema: AnyValidateFunction | AnySchemaObject) => {
    const validator = new AjvValidator(fnOrSchema)

    test('validate the configuration', async () => {
      await expect(validator.validate(validPayload)).resolves.toEqual(resultOfValidPayload)
    })

    test('invalid value error', async () => {
      const err = await catchRejection(validator.validate(invalidValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(invalidValueErrorData)
    })

    test('undefined value error', async () => {
      const err = await catchRejection(validator.validate(undefinedValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(undefinedValueErrorData)
    })
  })

  test('attempt to synchronously validate using asynchronous validation function', () => {
    const validator = new AjvValidator(asyncFn)

    expect(() => validator.validateSync(validPayload)).toThrow('Validation function is asynchronous')
  })

  test('attempt to synchronously validate using asynchronous schema', () => {
    const validator = new AjvValidator(asyncSchema)

    expect(() => validator.validateSync(validPayload)).toThrow('Validation function is asynchronous')
  })
})
