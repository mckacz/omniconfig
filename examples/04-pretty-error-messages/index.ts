import * as yup from 'yup'
import {
  CamelCaseKeyMapper,
  DotEnvLoader,
  OptionalLoader,
  ProcessEnvLoader,
  Resolver,
  TextErrorFormatter,
  YupProcessor,
} from 'confres'

const schema = yup.object({
  debug: yup.boolean().default(false),
  port:  yup.number().required().min(1024).max(4096),
  db:    yup.object({
    host:     yup.string().required(),
    port:     yup.number().min(1000).max(10000).required(),
    name:     yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
  }).required(),
})

const keyMapper = new CamelCaseKeyMapper({ prefix: 'APP__' })

const resolver = new Resolver(
  [
    new DotEnvLoader(keyMapper, '.env'),
    new OptionalLoader(new DotEnvLoader(keyMapper, '.env.local')),
    new ProcessEnvLoader(keyMapper),
  ],
  [
    new YupProcessor(schema),
  ],
)

resolver.resolve()
  .then(config => console.log(JSON.stringify(config, null, 2)))
  .catch(ex => {
    const formatter = new TextErrorFormatter()

    console.error(formatter.format(ex))
    process.exit(1)
  })
