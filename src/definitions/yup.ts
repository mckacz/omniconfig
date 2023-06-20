import type {
  ObjectSchema,
  SchemaDescription,
  SchemaFieldDescription,
  SchemaInnerTypeDescription,
  SchemaObjectDescription
} from 'yup'

import { Definitions, DefinitionEntry, DefinitionEntryType } from '../interfaces/definitions'

const OverridableEntryProps: Array<keyof DefinitionEntry> = [
  'required',
  'array',
  'type',
  'description',
  'defaultValue'
]

/**
 * Check if passed Yup schema description describes an object type.
 */
function isObjectSchemaDescription(field: SchemaFieldDescription): field is SchemaObjectDescription {
  return field.type === 'object' && 'fields' in field
}

/**
 * Check if passed Yup schema description describes an array type.
 */
function isArraySchemaDescription(field: SchemaFieldDescription): field is SchemaInnerTypeDescription {
  return field.type === 'array'
    && 'innerType' in field
    && !!field.innerType
    && !(field.innerType instanceof Array)
}

/**
 * Check if passed Yup schema description describes a simple type.
 */
function isSimpleSchemaDescription(
  field?: SchemaFieldDescription | SchemaFieldDescription[]
): field is SchemaDescription {
  return !!field && !(field instanceof Array) && !['ref', 'object', 'array'].includes(field.type)
}

/**
 * Recursively builds configuration options definitions from Yup schema.
 */
function buildDefinition(path: string[], {fields}: SchemaObjectDescription): Definitions {
  const schema: Definitions = []

  for (const [key, field] of Object.entries(fields)) {
    if (isObjectSchemaDescription(field)) {
      schema.push(...buildDefinition([...path, key], field))
      continue
    }

    const entry: DefinitionEntry = {
      path:     [...path, key],
      type:     DefinitionEntryType.Mixed,
      required: !('optional' in field && field.optional)
    }

    const innerType = 'innerType' in field ? field.innerType : undefined

    if (
      isArraySchemaDescription(field)
      && isSimpleSchemaDescription(innerType)
    ) {
      entry.array = true
      entry.type = innerType.type as DefinitionEntryType
      entry.defaultValue = field.default
    } else if (isSimpleSchemaDescription(field)) {
      entry.type = field.type as DefinitionEntryType
      entry.defaultValue = field.default
    }

    if ('meta' in field && !!field.meta) {
      for (const schemaProp of OverridableEntryProps) {
        const metaValue = (field.meta as Record<string, unknown>)?.[schemaProp]

        if (metaValue) {
          Object.assign(entry, {[schemaProp]: metaValue})
        }
      }
    }

    schema.push(entry)
  }

  return schema
}

/**
 * Get definitions of configuration options from Yup schema.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function definitionsFromYupSchema(schema: ObjectSchema<any>) {
  return buildDefinition([], schema.describe())
}
