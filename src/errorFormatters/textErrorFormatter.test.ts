import { ResolverError } from '../resolver/resolverError.js'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError.js'
import { TextErrorFormatter } from './textErrorFormatter.js'

describe('TextErrorFormatter', () => {
  test('works', () => {
    const error = new ResolverError(
      new ProcessorError('something is undefined', undefined, 'obj.foo', ProcessorErrorType.undefinedValue),
      undefined,
      undefined,
      'obj.foo',
      [
        { container: 'Environment variables', identifier: 'OBJ__FOO' },
        { container: 'Command line arguments', identifier: '--obj.foo' },
      ],
    )

    const error2 = new ResolverError(
      new ProcessorError('something is wrong', undefined, 'obj.foo'),
      undefined,
      undefined,
      'obj.foo',
      [
        { container: 'Command line arguments', identifier: '--obj.foo' },
      ],
    )

    const formatter = new TextErrorFormatter()
    // expect(formatter.format(error)).toEqual(``)

    console.log(formatter.format(error))
    console.log(formatter.format(error2))
  })
})
