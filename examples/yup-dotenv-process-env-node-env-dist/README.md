# Example: Yup + environment variables with NODE_ENV and dist variants

Load and merge configuration from:
 
* [.env.dist](.env.dist)
* [.env](.env)
* .env.NODE_ENV.dist 
* .env.NODE_ENV (eg. [.env.development](.env.development) or [.env.production](.env.production))

Use `APP_` prefix for environment variables. Validate merged object using Yup.

# Usage

```shell
npm i     # yarn
npm start # yarn start
```
