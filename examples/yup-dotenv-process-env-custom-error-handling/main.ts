import * as yup from 'yup'
import OmniConfig, { ResolverError } from 'omniconfig.js'

/*
 Load and merge configuration from:
   - .env file
   - optional .env.local file
   - `process.env`

 Use `APP_` prefix for environment variables.
 Validate merged object using Yup.
 Display custom error message.
 */

const schema = yup.object({
  debug: yup.boolean().default(false),

  db: yup.object({
    host: yup.string().required(),
    port: yup.number().default(5432),
    user: yup.string().required(),
    pass: yup.string()
  })
})

try {
  const config = OmniConfig
    .withYup(schema)
    .useEnvironmentVariables({
      processEnv: true,
      dotEnv:     '.env[.local]',
      envMapper:  { prefix: 'APP_' },
    })
    .resolveSync({ logger: false })

  console.log(config)
} catch (ex) {
  if (ex instanceof ResolverError) {
    console.error(`Error type: ${ex.isUndefinedError ? 'Undefined value' : 'Invalid value'}`)

    if (ex.path) {
      console.error(`Configuration path: ${ex.path}`)
    }

    if (ex.error) {
      console.error(`Validation error: ${String(ex.error)}`)
    }

    if (ex.references) {
      for (const ref of ex.references) {
        console.error(`Reference: ${ref.identifier} @ ${ref.source}`)
      }
    }
  } else {
    throw ex
  }
}

