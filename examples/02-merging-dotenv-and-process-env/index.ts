import { CamelCaseKeyMapper, DotEnvLoader, OptionalLoader, ProcessEnvLoader, Resolver } from 'confres'

const keyMapper = new CamelCaseKeyMapper({ prefix: 'APP__' })

const resolver = new Resolver([
  new DotEnvLoader(keyMapper, '.env'),
  new OptionalLoader(new DotEnvLoader(keyMapper, '.env.local')),
  new ProcessEnvLoader(keyMapper),
])

resolver.resolve()
  .then(config => console.log(JSON.stringify(config, null, 2)))
  .catch(ex => {
    console.error(ex)
    process.exit(1)
  })
