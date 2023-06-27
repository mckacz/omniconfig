import * as yup from 'yup'
import { YupModel } from '~/model/yup/yupModel'
import { ValidationError, ValidationErrorType } from '~/errors/validationError'
import { catchError, catchRejection } from '../../utils'
import { buildMetadata } from '~/model/yup/metadata'

jest.mock('~/model/yup/metadata')

describe('YupModel', () => {
  // region Fixtures
  const schema = yup.object({
    debug: yup.boolean(),
    db:    yup.object({
      host:     yup.string().default('localhost'),
      port:     yup.number().min(1).max(65535).default(5432),
      username: yup.string().required(),
      password: yup.string().required(),
    }),
  })

  const validPayload = {
    debug: '1',
    db:    {
      port:     '1234',
      username: 'foo',
      password: 'bar',
      encoding: 'utf-8',
    },
  }

  const expectedValidationResult = {
    debug: true,

    db: {
      host:     'localhost',
      port:     1234,
      username: 'foo',
      password: 'bar',
    },
  }

  const invalidValuePayload = {
    debug: '1',
    db:    {
      port:     '-5',
      username: 'foo',
      password: 'bar',
      encoding: 'utf-8',
    },
  }

  const expectedInvalidValueErrorProps = {
    type: ValidationErrorType.invalidValue,
    path: ['db', 'port'],

    error: expect.objectContaining({
      message: 'db.port must be greater than or equal to 1',
    }),
  }

  const undefinedValuePayload = {
    debug: '1',
    db:    {
      password: 'bar',
      encoding: 'utf-8',
    },
  }

  const expectedUndefinedValueErrorProps = {
    type: ValidationErrorType.undefinedValue,
    path: ['db', 'username'],

    error: expect.objectContaining({
      message: 'db.username is a required field',
    }),
  }

  // endregion

  const model = new YupModel(schema)

  describe('validate()', () => {
    test('validate the configuration', async () => {
      await expect(model.validate(validPayload)).resolves.toEqual(expectedValidationResult)
    })

    test('invalid value error', async () => {
      const err = await catchRejection(model.validate(invalidValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(expectedInvalidValueErrorProps)
    })

    test('undefined value error', async () => {
      const err = await catchRejection(model.validate(undefinedValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(expectedUndefinedValueErrorProps)
    })
  })

  describe('validateSync()', () => {
    test('validate the configuration', () => {
      expect(model.validateSync(validPayload)).toEqual(expectedValidationResult)
    })

    test('invalid value error', () => {
      const err = catchError(() => model.validateSync(invalidValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(expectedInvalidValueErrorProps)
    })

    test('undefined value error', async () => {
      const err = catchError(() => model.validateSync(undefinedValuePayload))

      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toMatchObject(expectedUndefinedValueErrorProps)
    })
  })

  describe('describe()', () => {
    test('call metadata building helpers', () => {
      jest.mocked(buildMetadata).mockReturnValue(<never>[{meta: 1}])

      expect(buildMetadata).not.toHaveBeenCalled()

      expect(model.getMetadata()).toEqual([{meta: 1}])
      expect(model.getMetadata()).toEqual([{meta: 1}])

      expect(buildMetadata).toHaveBeenCalledTimes(1)
      expect(buildMetadata).toHaveBeenCalledWith(schema)
    })
  })
})
