import chalk from 'chalk'
import { ResolverError } from '../resolver/resolverError.js'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError.js'
import { ChalkErrorFormatter } from './chalkErrorFormatter.js'

describe('ChalkErrorFormatter', () => {
  test('works', async () => {
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
      new ProcessorError('`something` is wrong', undefined, 'obj.foo'),
      undefined,
      undefined,
      'obj.foo',
      [
        { container: 'Command line arguments', identifier: '--obj.foo' },
      ],
    )

    const formatter = new ChalkErrorFormatter()
    // expect(formatter.format(error)).toEqual(``)

    console.log(formatter.format(error))
    console.log(formatter.format(error2))
  })
})
