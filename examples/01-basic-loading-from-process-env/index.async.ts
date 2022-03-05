import { CamelCaseKeyMapper, ProcessEnvLoader } from 'confres'

const keyMapper = new CamelCaseKeyMapper({ prefix: 'APP__' })
const loader = new ProcessEnvLoader(keyMapper)

loader.load().then(config => {
  console.log(JSON.stringify(config, null, 2))
})
