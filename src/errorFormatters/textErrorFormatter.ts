import { ResolverError } from '../resolver/resolverError'
import { ErrorFormatter } from '../interfaces/errorFormatter'
import type { Reference } from '../interfaces/reference'

/**
 * Message templates for TextErrorFormatter
 */
export interface TextErrorFormatterTemplates {
  /**
   * Header template. Common for all of the ResolverError.
   *
   * Supported placeholders:
   *  - `[message]` - original error message (eg. `The value must be greater than 0`)
   */
  header: string

  /**
   * Causing value description.
   *
   * Supported placeholders:
   *  - `[hint]` - causing value location (eg. `Command line arguments as --someVar`)
   */
  causeDescription: string

  /**
   * Header of list of possible value definition options for undefined value error.
   */
  hintListHeader: string

  /**
   * Item of list of possible value definition options for undefined value error.
   *
   * Supported placeholders:
   *  - `[hint]` - location description (eg. `Command line arguments as --someVar`)
   */
  hintListItem: string

  /**
   * Full location description. Used if both `source` and `identifier` are available.
   *
   * Supported placeholders:
   *  - `[source]` - source description (eg. `Environment variables`, `/some/file.json`)
   *  - `[identifier]` - identifier in the source (eg. `SOME_ENV_VARIABLE`, `path.in.json.file`)
   */
  hintFull: string

  /**
   * Source-only location description. Used if only the `source` is available.
   *
   * Supported placeholders:
   *  - `[source]` - source description (eg. `Environment variables`, `/some/file.json`)
   */
  hintSourceOnly: string

  /**
   * Line separator for the list.
   */
  lineSeparator: string
}

/**
 * Placeholders used in TextErrorFormatter templates.
 */
export enum TextErrorFormatterPlaceholders {
  /**
   * Original error message.
   */
  message = 'message',

  /**
   * Location hint.
   */
  hint = 'hint',

  /**
   * Source name (in location hint).
   */
  source = 'source',

  /**
   * Identifier within source (in location hint).
   */
  identifier = 'identifier',
}

/**
 * Formats ResolverError as human-readable plain text message.
 */
export class TextErrorFormatter implements ErrorFormatter {
  /**
   * Default templates for TextErrorFormatter.
   */
  static readonly defaultTemplates: TextErrorFormatterTemplates = {
    header:           'Configuration error: [message]',
    causeDescription: 'The causing value is defined in [hint]',
    hintListHeader:   'The value can be defined in:',
    hintListItem:     '  - [hint]',
    hintFull:         '[source] as [identifier]',
    hintSourceOnly:   '[source]',
    lineSeparator:    '\n',
  }

  /**
   * Message templates.
   */
  private readonly templates: TextErrorFormatterTemplates

  /**
   * Creates new instance of TextErrorFormatter.
   *
   * @param templates List of message templates to use.
   */
  constructor(templates?: Partial<TextErrorFormatterTemplates>) {
    this.templates = { ...TextErrorFormatter.defaultTemplates, ...templates }
  }

  /**
   * Formats ResolverError instance as plain-text error message.
   * For any other kind of errors returns `undefined`.
   *
   * @param err ResolverError instance to describe.
   */
  format(err: ResolverError): string {
    if (!(err instanceof ResolverError)) {
      throw new TypeError('Expected an instance of ResolverError')
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
      .join(this.renderTemplate('lineSeparator'))
  }

  /**
   * Renders error message header.
   *
   * @param err ResolverError instance to describe.
   */
  protected renderHeader(err: ResolverError): string {
    return this.renderTemplate('header', {
      [TextErrorFormatterPlaceholders.message]: err.message,
    })
  }

  /**
   * Renders validation error cause description.
   *
   * @param err ResolverError instance to describe.
   */
  protected renderCause(err: ResolverError): string | undefined {
    if (!err.references[0]) {
      return
    }

    return this.renderTemplate('causeDescription', {
      [TextErrorFormatterPlaceholders.hint]: this.renderHint(err.references[0]),
    })
  }

  /**
   * Renders list of location hint for undefined value error.
   *
   * @param err ResolverError instance to describe.
   */
  protected renderHintList(err: ResolverError): string[] {
    const lines: string[] = []

    if (err.references.length > 0) {
      lines.push(this.renderTemplate('hintListHeader'))

      for (const ref of err.references) {
        lines.push(this.renderTemplate('hintListItem', {
          [TextErrorFormatterPlaceholders.hint]: this.renderHint(ref),
        }))
      }
    }

    return lines
  }

  /**
   * Renders location hint.
   *
   * @param ref Reference to describe.
   */
  protected renderHint(ref: Reference): string {
    if (ref.identifier) {
      return this.renderTemplate('hintFull', {
        [TextErrorFormatterPlaceholders.source]:     ref.source,
        [TextErrorFormatterPlaceholders.identifier]: ref.identifier,
      })
    } else {
      return this.renderTemplate('hintSourceOnly', {
        [TextErrorFormatterPlaceholders.source]: ref.source,
      })
    }
  }

  /**
   * Renders message template and replaces placeholders in it.
   *
   * @param key Template key.
   * @param dictionary Dictionary with placeholder replacements.
   */
  protected renderTemplate(key: keyof TextErrorFormatterTemplates, dictionary: Record<string, string> = {}): string {
    let template = this.templates[key]

    for (const [placeholder, value] of Object.entries(dictionary)) {
      template = template.replace(`[${placeholder}]`, value)
    }

    return template
  }
}
