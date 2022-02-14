# Example 05

Usage of `TextErrorFormatter` to print pretty error messages for the user.

It's almost the same example as [04-pretty-error-messages](../04-pretty-error-messages),
but this one uses preconfigured resolver and tries to load additional `.env.${NODE_ENV}` files. 

## Installation

```shell
npm i
```

## Running the example

1. Start the example.

```shell
npm start
```

Expected output:

```
Configuration error: db.password is a required field
The value can be defined in:
  - .env as APP__DB__PASSWORD
  - .env.local as APP__DB__PASSWORD
  - .env.development as APP__DB__PASSWORD
  - .env.development.local as APP__DB__PASSWORD
  - Environment variables as APP__DB__PASSWORD
```

Oh no! Password for the database is undefined!

2. Let's pass the password.

```shell
APP__DB__PASSWORD=t0p53cret npm start
```

Expected output:

```
Configuration error: db.port must be greater than or equal to 1000
The causing value is defined in .env as APP__DB__PORT
```

Oh no! Someone set invalid value for database port in `.env` file.

3. Try to fix the problem by passing port 

```shell
APP__DB__PORT=51200 APP__DB__PASSWORD=t0p53cret npm start
```

Expected output:

```
Configuration error: db.port must be less than or equal to 10000
The causing value is defined in Environment variables as APP__DB__PORT
```

Oh no! Still invalid, but notice that message says that it is your mistake.

4. Let's fix it for real. 

```shell
APP__DB__PORT=5120 APP__DB__PASSWORD=t0p53cret npm start
```

Expected output:

```json5
{
  "db": {
    "password": "t0p53cret",
    "username": "toor",
    "name": "foo",
    "port": 5120,
    "host": "localhost"
  },
  "port": 3000,
  "debug": false
}
```

You can also put the valid values to `.env` or `.env.local` files.

5. Try to install `chalk` package and run the examples again.

```shell
npm install chalk@^4.0.0 --save
```
