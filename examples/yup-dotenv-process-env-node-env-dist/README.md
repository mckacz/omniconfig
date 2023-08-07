# Example: Yup + environment variables with NODE_ENV and dist variants

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mckacz/omniconfig/tree/main/examples/yup-dotenv-process-env-node-env-dist?file=main.ts)

Load and merge configuration from:
 
* [.env.dist](.env.dist)
* [.env](.env)
* .env.NODE_ENV.dist 
* .env.NODE_ENV (eg. [.env.development](.env.development) or [.env.production](.env.production))

Use `APP_` prefix for environment variables. Validate merged object using Yup.

## Local usage

```shell
npm i          # yarn
npm start      # yarn start      # NODE_ENV=development
npm start:prod # yarn start:prod # NODE_ENV=production 
```

## Actions

* run script with `NODE_ENV=production` (using `npm start:prod`)
* check the schema used and modify it
* make invalid changes in .env files (e.g. set `db.port` to `foo` or `-1234`)
* remove some required variable (e.g. `db.user` from [.env.dist](./.env.dist))
