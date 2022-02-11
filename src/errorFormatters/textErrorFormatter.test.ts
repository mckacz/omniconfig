import { ResolverError } from '../resolver/resolverError'
import { TextErrorFormatter, TextErrorFormatterTemplates } from './textErrorFormatter'
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
      header:            'Oh no! [message]',
      causeDescription:  'Update the value of [hint]',
      hintListHeader:    'You can provide the value using:',
      hintListItem:      '  * [hint]',
      hintFull:          '[identifier] ([container])',
      hintContainerOnly: '[container]',
      lineSeparator:     '\n',
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

  test('ignore non-ResolverError', () => {
    const formatter = new TextErrorFormatter()

    expect(formatter.format(new Error('Oh no!'))).toBeUndefined()
  })
})
