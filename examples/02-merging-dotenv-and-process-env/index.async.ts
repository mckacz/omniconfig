import { AsyncResolver, CamelCaseKeyMapper, DotEnvLoader, OptionalLoader, ProcessEnvLoader } from 'confres'

const keyMapper = new CamelCaseKeyMapper({ prefix: 'APP__' })

const resolver = new AsyncResolver([
  new DotEnvLoader(keyMapper, '.env'),
  new OptionalLoader(new DotEnvLoader(keyMapper, '.env.local')),
  new ProcessEnvLoader(keyMapper),
])

resolver.resolve()
  .then((config: unknown) => console.log(JSON.stringify(config, null, 2)))
  .catch((ex: Error) => {
    console.error(ex)
    process.exit(1)
  })
