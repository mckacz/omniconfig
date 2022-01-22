import _ from 'lodash'
import { Reference } from '../loaders/loader.js'
import { ResolverError } from '../resolver/resolverError.js'
import { ErrorFormatter } from './errorFormatter.js'
import type { DeepPartial } from '../helpers.js'

export interface TextErrorFormatterTemplates {
  header: string
  causeDescription: string
  hintListHeader: string
  hintListItem: string
  hintFull: string
  hintContainerOnly: string
  lineSeparator: string
}

export interface TextErrorFormatterOptions {
  templates: TextErrorFormatterTemplates
}

export enum TextErrorFormatterPlaceholders {
  message = 'message',
  hint = 'hint',
  container = 'container',
  identifier = 'identifier',
}

const defaultTemplates: TextErrorFormatterTemplates = {
  header:            'Configuration error: [message]',
  causeDescription:  'The causing value is defined in [hint]',
  hintListHeader:    'The value can be defined in:',
  hintListItem:      '  - [hint]',
  hintFull:          '[container] as [identifier]',
  hintContainerOnly: '[container]',
  lineSeparator:     '\n',
}

const defaultOptions: TextErrorFormatterOptions = {
  templates: defaultTemplates,
}

export class TextErrorFormatter implements ErrorFormatter {
  private readonly templates: TextErrorFormatterTemplates

  constructor(options: DeepPartial<TextErrorFormatterOptions> = {}) {
    const { templates }: TextErrorFormatterOptions = _.merge({}, defaultOptions, options)

    this.templates = templates
  }

  format(err: ResolverError | unknown): string | undefined {
    if (!(err instanceof ResolverError)) {
      return
    }

    const lines: (string | undefined)[] = [
      this.renderHeader(err),
    ]

    if (err.isUndefinedError) {
      lines.push(...this.renderHintList(err))
    } else {
      lines.push(this.renderCause(err))
    }

    return lines
      .filter(line => line !== undefined)
      .join(this.templates.lineSeparator)
  }

  protected renderHeader(err: ResolverError): string {
    return this.renderTemplate(this.templates.header, {
      [TextErrorFormatterPlaceholders.message]: err.message,
    })
  }

  protected renderCause(err: ResolverError): string | undefined {
    if (!err.references[0]) {
      return
    }

    return this.renderTemplate(this.templates.causeDescription, {
      [TextErrorFormatterPlaceholders.hint]: this.renderHint(err.references[0]),
    })
  }

  protected renderHintList(err: ResolverError): string[] {
    const lines: string[] = []

    lines.push(this.renderTemplate(this.templates.hintListHeader, {}))

    for (const ref of err.references) {
      lines.push(this.renderTemplate(this.templates.hintListItem, {
        [TextErrorFormatterPlaceholders.hint]: this.renderHint(ref),
      }))
    }

    return lines
  }

  protected renderHint(ref: Reference): string {
    if (ref.identifier) {
      return this.renderTemplate(this.templates.hintFull, {
        [TextErrorFormatterPlaceholders.container]:  ref.container,
        [TextErrorFormatterPlaceholders.identifier]: ref.identifier,
      })
    } else {
      return this.renderTemplate(this.templates.hintContainerOnly, {
        [TextErrorFormatterPlaceholders.container]: ref.container,
      })
    }
  }

  protected renderTemplate(template: string, dictionary: Record<string, string>): string {
    for (const [placeholder, value] of Object.entries(dictionary)) {
      template = template.replace(`[${placeholder}]`, value)
    }

    return template
  }
}
