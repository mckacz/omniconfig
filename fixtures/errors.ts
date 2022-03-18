import { ResolverError } from '../src/resolver/resolverError'
import { ProcessorError, ProcessorErrorType } from '../src/processors/processorError'

export const undefinedErrorMock = new ResolverError(
  new ProcessorError('The value is required', undefined, 'obj.foo', ProcessorErrorType.undefinedValue),
  undefined,
  'obj.foo',
  [
    { source: 'Environment variables', identifier: 'OBJ__FOO' },
    { source: 'Command line arguments', identifier: '--obj.foo' },
  ],
)

export const undefinedErrorWithoutReferencesMock = new ResolverError(
  new ProcessorError('The value is required', undefined, 'obj.foo', ProcessorErrorType.undefinedValue),
  undefined,
  'obj.foo',
)

export const processingErrorMock = new ResolverError(
  new ProcessorError('The value `11` must be grater than or equal to `42`', undefined, 'obj.foo'),
  undefined,
  'obj.foo',
  [
    { source: 'Command line arguments', identifier: '--obj.foo' },
  ],
)

export const processingErrorWithoutReferencesMock = new ResolverError(
  new ProcessorError('The value `11` must be grater than or equal to `42`', undefined, 'obj.foo'),
  undefined,
  'obj.foo',
)
