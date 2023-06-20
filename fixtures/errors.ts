import { ResolverError } from '../src/resolver/resolverError'
import { ValidationError, ValidationErrorType } from '../src/validators/validationError'

export const undefinedErrorMock = new ResolverError(
  new ValidationError('The value is required', undefined, ['obj', 'foo'], ValidationErrorType.undefinedValue),
  undefined,
  ['obj', 'foo'],
  [
    { source: 'Environment variables', identifier: 'OBJ__FOO' },
    { source: 'Command line arguments', identifier: '--obj.foo' },
  ],
)

export const undefinedErrorWithoutReferencesMock = new ResolverError(
  new ValidationError('The value is required', undefined, ['obj', 'foo'], ValidationErrorType.undefinedValue),
  undefined,
  ['obj', 'foo'],
)

export const processingErrorMock = new ResolverError(
  new ValidationError('The value `11` must be grater than or equal to `42`', undefined, ['obj', 'foo']),
  undefined,
  ['obj', 'foo'],
  [
    { source: 'Command line arguments', identifier: '--obj.foo' },
  ],
)

export const processingErrorWithoutReferencesMock = new ResolverError(
  new ValidationError('The value `11` must be grater than or equal to `42`', undefined, ['obj', 'foo']),
  undefined,
  ['obj', 'foo'],
)
