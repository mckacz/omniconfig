import * as yup from 'yup'
import OmniConfig from 'omniconfig.js'

/*
 Load and merge configuration from:
   - .env file
   - optional .env.local file
   - `process.env`

 Use `APP_` prefix for environment variables.
 Validate merged object using Yup.
 */

const schema = yup.object({
  debug: yup.boolean().default(false),

  db: yup.object({
    host: yup.string().required(),
    port: yup.number().min(0).default(5432),
    user: yup.string().required(),
    pass: yup.string()
  })
})

const config = OmniConfig
  .withYup(schema)
  .useEnvironmentVariables({
    processEnv: true,
    dotEnv:     '.env[.local]',
    envMapper:  { prefix: 'APP_' },
  })
  .resolveSync({ exitCode: 1 })

console.log(config)

/*
TypeScript interface inferred from the schema:

{
  debug: boolean
  db: {
    host: string
    port: number
    user: string
    pass?: string
  }
}
 */
