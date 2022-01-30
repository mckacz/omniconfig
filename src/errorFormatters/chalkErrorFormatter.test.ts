import { ResolverError } from '../resolver/resolverError.js'
import { ChalkErrorFormatter, ChalkErrorFormatterTheme } from './chalkErrorFormatter.js'
import { TextErrorFormatterTemplates } from './textErrorFormatter.js'
import { createChalkMock } from '../../mocks/chalk.js'
import {
  processingErrorMock,
  processingErrorWithoutReferencesMock,
  undefinedErrorMock,
  undefinedErrorWithoutReferencesMock,
} from '../../mocks/errors.js'

describe('ChalkErrorFormatter', () => {
  const chalkMock = createChalkMock()

  describe('Default templates and theme', () => {
    test.each([
      ['Processing error', processingErrorMock],
      ['Processing error without references', processingErrorWithoutReferencesMock],
      ['Undefined value error', undefinedErrorMock],
      ['Undefined value error without references', undefinedErrorWithoutReferencesMock],
    ])('%s', (_: string, error: ResolverError) => {
      const formatter = new ChalkErrorFormatter({ chalk: chalkMock })
      expect(formatter.format(error)).toMatchSnapshot()
    })
  })

  describe('Custom templates and theme', () => {
    const customTheme: ChalkErrorFormatterTheme = {
      message:        ['red'],
      identifier:     ['bgCyan'],
      container:      ['yellow', 'underline'],
      code:           ['bgGreen', 'underline'],
    }

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
      const formatter = new ChalkErrorFormatter({
        chalk:     chalkMock,
        theme:     customTheme,
        templates: customTemplates,
      })

      expect(formatter.format(error)).toMatchSnapshot()
    })
  })
})
