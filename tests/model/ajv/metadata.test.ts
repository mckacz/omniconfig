import { buildMetadataFromJSONSchema, buildMetadataFromJTDSchema } from '~/model/ajv/metadata'

describe('Ajv metadata building helpers', () => {
  describe('buildMetadataForJSONSchema()', () => {
    test('empty schema', () => {
      expect(
        buildMetadataFromJSONSchema()
      ).toEqual(
        []
      )
    })

    test('simple schema', () => {
      expect(
        buildMetadataFromJSONSchema({
          type:     'object',
          required: ['host'],

          properties: {
            host:     {
              type:        'string',
              description: 'Host name',
            },
            port:     {
              type:        'number',
              description: 'Port',
              default:     5432,
            },
            user:     {
              type:        'string',
              description: 'User',
              default:     'postgres',
            },
            password: {
              type:        'string',
              description: 'Password',
            },
          },
        })
      ).toEqual(
        [
          {
            path:        ['host'],
            type:        'string',
            array:       false,
            required:    true,
            description: 'Host name',
          },
          {
            path:         ['port'],
            type:         'number',
            array:        false,
            required:     false,
            defaultValue: 5432,
            description:  'Port',
          },
          {
            path:         ['user'],
            type:         'string',
            array:        false,
            required:     false,
            defaultValue: 'postgres',
            description:  'User',
          },
          {
            path:        ['password'],
            type:        'string',
            array:       false,
            required:    false,
            description: 'Password',
          },
        ]
      )
    })

    test('nested schema', () => {
      expect(
        buildMetadataFromJSONSchema({
          type:     'object',
          required: ['db'],

          properties: {
            debug: {
              type:        'boolean',
              default:     false,
              description: 'Debug mode',
            },

            db: {
              type:     'object',
              required: ['host'],

              properties: {
                host:     {
                  type:        'string',
                  description: 'Host name',
                },
                port:     {
                  type:        'number',
                  description: 'Port',
                  default:     5432,
                },
                user:     {
                  type:        'string',
                  description: 'User',
                  default:     'postgres',
                },
                password: {
                  type:        'string',
                  description: 'Password',
                },
              },
            },
          },
        })
      ).toEqual(
        [
          {
            path:         ['debug'],
            type:         'boolean',
            array:        false,
            required:     false,
            defaultValue: false,
            description:  'Debug mode',
          },
          {
            path:        ['db', 'host'],
            type:        'string',
            array:       false,
            required:    true,
            description: 'Host name',
          },
          {
            path:         ['db', 'port'],
            type:         'number',
            array:        false,
            required:     false,
            defaultValue: 5432,
            description:  'Port',
          },
          {
            path:         ['db', 'user'],
            type:         'string',
            array:        false,
            required:     false,
            defaultValue: 'postgres',
            description:  'User',
          },
          {
            path:        ['db', 'password'],
            type:        'string',
            array:       false,
            required:    false,
            description: 'Password',
          },
        ]
      )
    })
  })

  describe('buildMetadataForJTDSchema()', () => {
    test('empty schema', () => {
      expect(
        buildMetadataFromJTDSchema()
      ).toEqual(
        []
      )
    })

    test('simple schema', () => {
      expect(
        buildMetadataFromJTDSchema({
          properties: {
            host: {
              type:     'string',
              metadata: {
                description: 'Host name',
              },
            },
            port: {
              type:     'int16',
              metadata: {
                description: 'Port',
              },
            },
            user: {
              type:     'string',
              metadata: {
                description: 'User',
              },
            },
          },

          optionalProperties: {
            password: {
              type:     'string',
              metadata: {
                description: 'Password',
              },
            },
          },
        })
      ).toEqual(
        [
          {
            path:        ['host'],
            type:        'string',
            array:       false,
            required:    true,
            description: 'Host name',
          },
          {
            path:        ['port'],
            type:        'number',
            array:       false,
            required:    true,
            description: 'Port',
          },
          {
            path:        ['user'],
            type:        'string',
            array:       false,
            required:    true,
            description: 'User',
          },
          {
            path:        ['password'],
            type:        'string',
            array:       false,
            required:    false,
            description: 'Password',
          },
        ]
      )
    })

    test('nested schema', () => {
      expect(
        buildMetadataFromJTDSchema({
          properties:         {
            db: {
              properties: {
                host: {
                  type:     'string',
                  metadata: {
                    description: 'Host name',
                  },
                },
                port: {
                  type:     'int16',
                  metadata: {
                    description: 'Port',
                  },
                },
                user: {
                  type:     'string',
                  metadata: {
                    description: 'User',
                  },
                },
              },

              optionalProperties: {
                password: {
                  type:     'string',
                  metadata: {
                    description: 'Password',
                  },
                },
              },
            },
          },
          optionalProperties: {
            debug: {
              type:     'boolean',
              metadata: {
                description: 'Debug mode',
              },
            },
          },
        })
      ).toEqual(
        [
          {
            path:        ['db', 'host'],
            type:        'string',
            array:       false,
            required:    true,
            description: 'Host name',
          },
          {
            path:        ['db', 'port'],
            type:        'number',
            array:       false,
            required:    true,
            description: 'Port',
          },
          {
            path:        ['db', 'user'],
            type:        'string',
            array:       false,
            required:    true,
            description: 'User',
          },
          {
            path:        ['db', 'password'],
            type:        'string',
            array:       false,
            required:    false,
            description: 'Password',
          },
          {
            path:        ['debug'],
            type:        'boolean',
            array:       false,
            required:    false,
            description: 'Debug mode',
          },
        ]
      )
    })
  })
})
