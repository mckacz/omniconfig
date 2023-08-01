import { Metadata, ValueType } from '../../interfaces/metadata'
import type {
  ObjectSchema,
  SchemaDescription,
  SchemaFieldDescription,
  SchemaInnerTypeDescription,
  SchemaObjectDescription,
} from 'yup'

const OverridableEntryProps: Array<keyof Metadata> = [
  'required',
  'array',
  'type',
  'description',
  'defaultValue',
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
 * Recursively builds configuration options metadata from Yup schema.
 */
function metadataFromObjectSchemaDescription(path: string[], { fields }: SchemaObjectDescription): Metadata[] {
  const metadata: Metadata[] = []

  for (const [key, field] of Object.entries(fields)) {
    if (isObjectSchemaDescription(field)) {
      metadata.push(...metadataFromObjectSchemaDescription([...path, key], field))
      continue
    }

    const entry: Metadata = {
      path:     [...path, key],
      type:     ValueType.Mixed,
      required: !('optional' in field && field.optional),
    }

    const innerType = 'innerType' in field ? field.innerType : undefined

    if (
      isArraySchemaDescription(field)
      && isSimpleSchemaDescription(innerType)
    ) {
      entry.array = true
      entry.type = innerType.type as ValueType
      entry.defaultValue = field.default
    } else if (isSimpleSchemaDescription(field)) {
      entry.type = field.type as ValueType
      entry.defaultValue = field.default
    }

    if ('meta' in field && !!field.meta) {
      for (const schemaProp of OverridableEntryProps) {
        const metaValue = (field.meta as Record<string, unknown>)?.[schemaProp]

        if (metaValue) {
          Object.assign(entry, { [schemaProp]: metaValue })
        }
      }
    }

    metadata.push(entry)
  }

  return metadata
}

/**
 * Build metadata from Yup schema
 * @param schema Yup schema to build metadata from.
 */
export function buildMetadata(schema: ObjectSchema<any>): Metadata[] {
  return metadataFromObjectSchemaDescription([], schema.describe())
}
