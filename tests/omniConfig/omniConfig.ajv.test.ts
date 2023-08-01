import { AjvModel } from '~/model/ajv/ajvModel'
import { OmniConfig } from '~/omniConfig'
import type { JSONSchemaType } from 'ajv'

jest.mock('~/model/ajv/ajvModel')

describe('OmniConfig - Ajv integration', () => {
  afterEach(() => jest.clearAllMocks())

  test('compile JSON schema', () => {
    interface Data {
      foo: number
      bar: {
        baz: boolean
        qux: string
      }
    }

    const schema: JSONSchemaType<Data> = {
      type:     'object',
      required: ['foo', 'bar'],

      properties: {
        foo: {
          type:    'number',
          minimum: 1,
        },
        bar: {
          type:       'object',
          required:   ['baz'],
          properties: {
            baz: {
              type: 'boolean',
            },
            qux: {
              type:    'string',
              default: 'quuux',
            },
          },
        },
      },
    }

    const om = new OmniConfig()
      .withJsonSchema(schema)

    expect(om).toHaveProperty('model', expect.any(AjvModel))

    // Ajv validation function
    const fn = jest.mocked(AjvModel).mock.calls[0][0]
    expect(fn).toHaveProperty('schema', schema)
  })

  test('compile JDT schema', () => {
    const schema = {
      properties: {
        foo: {
          type: 'string',

        },
        bar: {
          properties: {
            baz: {
              type: 'boolean',
            },
            qux: {
              type: 'string',
            },
          },
        },
      },
    }

    const om = new OmniConfig()
      .withJTDSchema(schema)

    expect(om).toHaveProperty('model', expect.any(AjvModel))

    // Ajv validation function
    const fn = jest.mocked(AjvModel).mock.calls[0][0]
    expect(fn).toHaveProperty('schema', schema)
  })
})
