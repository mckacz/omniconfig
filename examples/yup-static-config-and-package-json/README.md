# Example: Yup + static configuration + package.json section

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mckacz/omniconfig/tree/main/examples/yup-static-config-and-package-json?file=main.ts)

Load and merge configuration from:
 
* static value defined in [main.ts](./main.ts#L25-L32)
* [package.json](./package.json#L17-L22) section

## Local usage

```shell
npm i     # yarn
npm start # yarn start
```

## Actions

* check the schema used and modify it
* try to set `db.port` in [main.ts](./main.ts#L29) to negative number
* try to set `myApp.db.user` in [package.json](./package.json#L20) to empty string
