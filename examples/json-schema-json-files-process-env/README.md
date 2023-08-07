# Example: JSON schema + JSON files and environment variables

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mckacz/omniconfig/tree/main/examples/json-schema-json-files-process-env?file=main.ts)

Load and merge configuration from:
 
* [config/app.json](config/app.json) file
* [config/app.local.json](config/app.local.json) file
* `process.env`

## Local usage

```shell
npm i     # yarn
npm start # yarn start
```

## Actions

* check the [schema](./main.ts) used and modify it
* make invalid changes in [config](./config) files (e.g. set `db.port` to `foo` or `-1234`)
* remove some required variable (e.g. `db.host` from [app.json](./config/app.json))
