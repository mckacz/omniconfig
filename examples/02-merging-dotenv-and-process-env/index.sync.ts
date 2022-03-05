import { CamelCaseKeyMapper, DotEnvLoader, OptionalLoader, ProcessEnvLoader, SyncResolver } from 'confres'

const keyMapper = new CamelCaseKeyMapper({ prefix: 'APP__' })

const resolver = new SyncResolver([
  new DotEnvLoader(keyMapper, '.env'),
  new OptionalLoader(new DotEnvLoader(keyMapper, '.env.local')),
  new ProcessEnvLoader(keyMapper),
])

try {
  const config = resolver.resolve()
  console.log(JSON.stringify(config, null, 2))
} catch (ex) {
  console.error(ex)
  process.exit(1)
}
