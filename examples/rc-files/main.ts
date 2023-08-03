import * as yup from 'yup'
import OmniConfig from 'omniconfig'

/*
 Load and merge configuration from:
   - .apprc.yml
   - .apprc.json
   - .apprc.env

 Validate merged object using Yup.
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

const config = OmniConfig
  .withYup(schema)
  .useYamlFiles('.apprc.yml')
  .useJsonFiles('.apprc.json')
  .useEnvironmentVariables({dotEnv: '.apprc.env'})
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
