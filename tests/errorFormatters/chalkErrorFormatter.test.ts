import chalk from 'chalk'
import { ResolverError } from '~/errors/resolverError'
import { ChalkErrorFormatter, ChalkErrorFormatterTheme } from '~/errorFormatters/chalkErrorFormatter'
import { TextErrorFormatterTemplates } from '~/errorFormatters/textErrorFormatter'

import {
  processingErrorMock,
  processingErrorWithoutReferencesMock,
  undefinedErrorMock,
  undefinedErrorWithoutReferencesMock,
} from '../../fixtures/errors'


describe('ChalkErrorFormatter', () => {

  describe('Default templates and theme', () => {
    test.each([
      ['Processing error', processingErrorMock],
      ['Processing error without references', processingErrorWithoutReferencesMock],
      ['Undefined value error', undefinedErrorMock],
      ['Undefined value error without references', undefinedErrorWithoutReferencesMock],
    ])('%s', (_: string, error: ResolverError) => {
      const formatter = new ChalkErrorFormatter({ chalk })
      expect(formatter.format(error)).toMatchSnapshot()
    })
  })

  describe('Custom templates and theme', () => {
    const customTheme: ChalkErrorFormatterTheme = {
      message:    ['red'],
      identifier: ['bgCyan'],
      source:     ['yellow', 'underline'],
      code:       ['bgGreen', 'underline'],
    }

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
      const formatter = new ChalkErrorFormatter({
        chalk,
        theme:     customTheme,
        templates: customTemplates,
      })

      expect(formatter.format(error)).toMatchSnapshot()
    })
  })
})
