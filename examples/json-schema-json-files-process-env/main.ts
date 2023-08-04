import OmniConfig from 'omniconfig'

/*
 Load and merge configuration from:
   - config/app.json
   - optional config/app.local.json

 Validate merged object using JSON schema.
 */

interface Config {
  debug: boolean
  db: {
    host: string
    port: number
    user: string
    pass?: string
  }
}

const config = OmniConfig
  .withJsonSchema<Config>({
    type:     'object',
    required: ['db'],

    properties: {
      debug: {
        type:    'boolean',
        default: false,
      },

      db: {
        type:     'object',
        required: ['host', 'user', 'port'],

        properties: {
          host: { type: 'string' },
          port: { type: 'number', default: 5432 },
          user: { type: 'string' },
          pass: { type: 'string', nullable: true },
        }
      }
    }
  })
  .useJsonFiles('config/app[.local].json')
  .useEnvironmentVariables()
  .resolveSync({ exitCode: 1 })

console.log(config)
