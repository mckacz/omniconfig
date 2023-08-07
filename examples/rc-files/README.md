# Example: `rc` files approach

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mckacz/omniconfig/tree/main/examples/rc-files?file=main.ts)

Load and merge configuration from:
 
* [.apprc.yml](.apprc.yml) file
* [.apprc.js](.apprc.json) file

Use `APP_` prefix for environment variables. Validate merged object using Yup.

## Local usage

```shell
npm i     # yarn
npm start # yarn start
```

## Actions

* check the [schema](./main.ts) used and modify it
* make invalid changes in one of RC files (e.g. set `db.port` to `foo` or `-1234`)
* remove some required variable (e.g. `db.host` from [.apprc.yml](./.apprc.yml) and [.apprc.json](./.apprc.json))
