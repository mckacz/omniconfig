import * as yup from 'yup'
import OmniConfig from 'omniconfig.js'

/*
 Load and merge configuration from:
   - static value defined below
   - optional package.json section

 Validate merged object using Yup.
 */

const schema = yup.object({
  debug: yup.boolean(),

  db: yup.object({
    host: yup.string().required(),
    port: yup.number().min(0),
    user: yup.string().required(),
    pass: yup.string()
  })
})

const config = OmniConfig
  .withYup(schema)
  .useValue({
    debug: false,
    db: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
    }
  })
  .useJsonFiles({
    template: 'package.json',
    section:  'myApp',
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
