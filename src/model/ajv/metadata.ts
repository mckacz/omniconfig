/* eslint-disable @typescript-eslint/no-unsafe-argument*/
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnySchema } from 'ajv'
import { SomeJTDSchemaType } from 'ajv/lib/types/jtd-schema'
import { Metadata, ValueType } from '../metadata'
import type { SomeJSONSchema } from 'ajv/dist/types/json-schema'

/**
 * Maps JSON schema type to metadata type.
 * @param type JSON schema type.
 */
function mapJSONSchemaType(type?: string): ValueType | undefined {
  if (type === 'string') {
    return ValueType.String
  }

  if (type === 'number') {
    return ValueType.Number
  }

  if (type === 'boolean') {
    return ValueType.Boolean
  }

  return type ? ValueType.Mixed : undefined
}

/**
 * Maps JTD schema to metadata type.
 * @param schema JDT schema.
 */
function mapJTDSchemaType(schema: SomeJTDSchemaType): ValueType | undefined {
  if ('type' in schema) {
    if (schema.type === 'boolean') {
      return ValueType.Boolean
    } else if (schema.type === 'string' || schema.type === 'timestamp') {
      return ValueType.String
    }

    return ValueType.Number
  }

  if ('enum' in schema) {
    return ValueType.String
  }

  if ('values' in schema) {
    return ValueType.Mixed
  }
}

/**
 * Builds metadata from JSON schema.
 * @param schema   JSON schema.
 * @param path     Property path prefix.
 * @param required Required flag.
 */
export function buildMetadataFromJSONSchema(
  schema?: SomeJSONSchema,
  path: string[] = [],
  required = true,
): Metadata[] {
  const metadata: Metadata[] = []

  if (!schema) {
    return []
  }

  if (schema.type === 'object' && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      metadata.push(
        ...buildMetadataFromJSONSchema(
          schema.properties[key],
          [...path, key],
          required && ((schema?.required as string[]) ?? []).includes(key)
        )
      )
    }
  } else {
    const meta: Metadata = {
      path,
      required,
      defaultValue: schema.default,
      description:  schema.title ?? schema.description,

      array: schema.type === 'array',
      type:  mapJSONSchemaType(schema.type),
    }

    if (meta.array) {
      meta.type = mapJSONSchemaType(schema.items)
    }

    metadata.push(meta)
  }

  return metadata
}

/**
 * Builds metadata from JTD schema.
 * @param schema      JTD schema.
 * @param path        Property path prefix.
 * @param definitions JTD definitions.
 * @param required    Required flag.
 */
export function buildMetadataFromJTDSchema(
  schema?: SomeJTDSchemaType,
  path: string[] = [],
  definitions: Record<string, SomeJTDSchemaType> = {},
  required = true,
): Metadata[] {
  const metadata: Metadata[] = []

  if (schema && 'ref' in schema) {
    schema = definitions[schema.ref]
  }

  if (!schema) {
    return []
  }

  if ('properties' in schema || 'optionalProperties' in schema) {
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        metadata.push(
          ...buildMetadataFromJTDSchema(
            propSchema,
            [...path, key],
            { ...definitions, ...schema.definitions },
            required
          )
        )
      }
    }

    if (schema.optionalProperties) {
      for (const [key, propSchema] of Object.entries(schema.optionalProperties)) {
        metadata.push(
          ...buildMetadataFromJTDSchema(
            propSchema,
            [...path, key],
            schema.definitions ?? definitions,
            false
          )
        )
      }
    }
  } else {
    const meta: Metadata = {
      path,
      required,
      description: (schema.metadata?.title ?? schema.metadata?.description) as string | undefined,

      array: false,
      type:  mapJTDSchemaType(schema),
    }

    if ('elements' in schema) {
      meta.array = true
      meta.type = mapJTDSchemaType(schema.elements)
    }

    metadata.push(meta)
  }

  return metadata
}

/**
 * Build metadata from JSON or JTD schema.
 * @param schema JSON or JTD schema.
 */
export function buildMetadata(schema: AnySchema): Metadata[] {
  if (schema && typeof schema === 'object' && 'type' in schema && schema.type === 'object') {
    return buildMetadataFromJSONSchema(schema as SomeJSONSchema)
  }

  return buildMetadataFromJTDSchema(schema as SomeJTDSchemaType)
}
