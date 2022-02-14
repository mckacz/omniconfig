import { CamelCaseKeyMapper, ProcessEnvLoader } from 'confres'

const keyMapper = new CamelCaseKeyMapper({ prefix: 'APP__' })
const loader = new ProcessEnvLoader(keyMapper)

console.log(JSON.stringify(loader.load(), null, 2))
