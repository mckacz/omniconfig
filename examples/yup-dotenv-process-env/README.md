# Example: Yup + environment variables

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mckacz/omniconfig/tree/main/examples/yup-dotenv-process-env?file=main.ts)

Load and merge configuration from:
 
* [.env](.env) file
* [.env.local](.env.local) file

Use `APP_` prefix for environment variables. Validate merged object using Yup.

## Local usage

```shell
npm i     # yarn
npm start # yarn start
```

## Actions

* check the schema used and modify it
* make invalid changes in .env files (e.g. set `db.port` to `foo` or `-1234`)
* remove some required variable (e.g. `db.user` from [.env](./.env))
