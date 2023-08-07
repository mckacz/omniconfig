# Example: JSON schema + YAML files

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mckacz/omniconfig/tree/main/examples/json-schema-yaml-files?file=main.ts)

Load and merge configuration from:
 
* [config/app.yml](config/app.yml) file
* [config/app.local.yml](config/app.local.yml) file
* `process.env`

## Local usage

```shell
npm i     # yarn
npm start # yarn start
```

## Actions

* check the [schema](./main.ts) used and modify it
* make invalid changes in [config](./config) files (e.g. set `db.port` to `foo` or `-1234`)
* remove some required variable (e.g. `db.host` from [app.yml](./config/app.yml))
