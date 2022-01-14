import mustache from 'mustache'
import { Reference } from '../loaders/loader.js'
import { ResolverError } from '../resolver/resolverError.js'
import { ErrorFormatter } from './errorFormatter.js'

const defaultTemplate = `Configuration error: {{{message}}}
{{#isUndefined}}
The value can be defined in:
  {{#hints}}
  - {{{container}}}{{#identifier}} as {{{.}}}{{/identifier}}
  {{/hints}}
{{/isUndefined}}
{{^isUndefined}}{{#cause}}
The causing value is defined in {{{container}}}{{#identifier}} as {{{.}}}{{/identifier}}
{{/cause}}{{/isUndefined}}`

export interface TextErrorFormatterView {
  message: string
  isUndefined: boolean
  cause: Reference
  hints: Reference[]
}

export class TextErrorFormatter implements ErrorFormatter {
  constructor(
    protected readonly template = defaultTemplate,
  ) {
  }

  format(err: ResolverError | unknown): string | undefined {
    if (!(err instanceof ResolverError)) {
      return
    }

    return mustache.render(this.template, this.getView(err))
  }

  protected getView(err: ResolverError): TextErrorFormatterView {
    return {
      message:     err.message,
      hints:       err.references,
      cause:       err.references[0],
      isUndefined: err.isUndefinedError && err.references.length > 0,
    }
  }
}
