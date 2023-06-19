import { ResolverError } from '~/resolver/resolverError'
import { TextErrorFormatter, TextErrorFormatterTemplates } from '~/errorFormatters/textErrorFormatter'
import {
  processingErrorMock,
  processingErrorWithoutReferencesMock,
  undefinedErrorMock,
  undefinedErrorWithoutReferencesMock,
} from '../../fixtures/errors'

describe('TextErrorFormatter', () => {
  describe('Default templates', () => {
    test.each([
      ['Processing error', processingErrorMock],
      ['Processing error without references', processingErrorWithoutReferencesMock],
      ['Undefined value error', undefinedErrorMock],
      ['Undefined value error without references', undefinedErrorWithoutReferencesMock],
    ])('%s', (_: string, error: ResolverError) => {
      const formatter = new TextErrorFormatter()
      expect(formatter.format(error)).toMatchSnapshot()
    })
  })

  describe('Custom templates', () => {
    const customTemplates: TextErrorFormatterTemplates = {
      header:           'Oh no! [message]',
      causeDescription: 'Update the value of [hint]',
      hintListHeader:   'You can provide the value using:',
      hintListItem:     '  * [hint]',
      hintFull:         '[identifier] ([source])',
      hintSourceOnly:   '[source]',
      lineSeparator:    '\n',
    }

    test.each([
      ['Processing error', processingErrorMock],
      ['Processing error without references', processingErrorWithoutReferencesMock],
      ['Undefined value error', undefinedErrorMock],
      ['Undefined value error without references', undefinedErrorWithoutReferencesMock],
    ])('%s', (_: string, error: ResolverError) => {
      const formatter = new TextErrorFormatter(customTemplates)
      expect(formatter.format(error)).toMatchSnapshot()
    })
  })

  test('expect a type error for non-ResolverError', () => {
    const formatter = new TextErrorFormatter()

    expect(
      () => formatter.format(new Error('Oh no!') as any),
    ).toThrow(TypeError)
  })
})
