import * as yup from 'yup'
import Confres from 'confres'

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

Confres.resolve(Confres.yupDotEnv({
  schema:    schema,
  keyMapper: {
    prefix: 'APP__',
  },
}))
  .then(config => console.log(JSON.stringify(config, null, 2)))
  .catch(() => process.exit(1))
