import Ajv, { AsyncSchema } from 'ajv'
import { AnyValidateFunction } from 'ajv/dist/types'
import { SomeJSONSchema } from 'ajv/dist/types/json-schema'
import { ValidationError, ValidationErrorType } from '~/errors/validationError'
import { AjvModel } from '~/model/ajv/ajvModel'
import { buildMetadata } from '~/model/ajv/metadata'
import { catchError, catchRejection } from '../../utils'

jest.mock('~/model/ajv/metadata')

describe('AjvModel', () => {
  // region Fixtures
  const schema: SomeJSONSchema = {
    type:     'object',
    required: ['debug', 'db'],

    additionalProperties: false,

    properties: {
      debug: {
        type: 'boolean',
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
        },
      },
    },
  }

  const asyncSchema: AsyncSchema = { $async: true, ...schema }

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
    message: 'must be >= 1',
  }

  const undefinedValueErrorData = {
    type:    ValidationErrorType.undefinedValue,
    path:    ['db', 'username'],
    message: 'is required',
  }

  // endregion

  const ajv = new Ajv({
    coerceTypes:      true,
    useDefaults:      true,
    removeAdditional: true,
  })

  const fn = ajv.compile(schema)
  const asyncFn = ajv.compile(asyncSchema)

  describe('validate()', () => {

    describe.each([
      ['synchronous validation function', fn],
    ])('synchronous validation of %s', (_: string, testFn: AnyValidateFunction) => {
      const validator = new AjvModel(testFn)

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
    ])('asynchronous validation using %s', (_: string, testFn: AnyValidateFunction) => {
      const validator = new AjvModel(testFn)

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
      const validator = new AjvModel(asyncFn)

      expect(() => validator.validateSync(validPayload)).toThrow('Validation function is asynchronous')
    })
  })

  describe('describe()', () => {
    test('call metadata building helpers', () => {
      const model = new AjvModel(fn)

      jest.mocked(buildMetadata).mockReturnValue(<never>[{ meta: 1 }])

      expect(buildMetadata).not.toHaveBeenCalled()

      expect(model.getMetadata()).toEqual([{ meta: 1 }])
      expect(model.getMetadata()).toEqual([{ meta: 1 }])

      expect(buildMetadata).toHaveBeenCalledTimes(1)
      expect(buildMetadata).toHaveBeenCalledWith(schema)
    })
  })
})
