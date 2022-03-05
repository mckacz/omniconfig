# Example 00

This is the example from the main [`README.md`](../../README.md).  

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

```json
{
  "db": {
    "password": "app",
    "username": "app",
    "name": "app",
    "port": 5432,
    "host": "localhost"
  },
  "port": 3000
}
```

2. Try to change the port of application.

```shell
APP__PORT=2000 npm start
```

Expected output:

```json
{
  "db": {
    "password": "app",
    "username": "app",
    "name": "app",
    "port": 5432,
    "host": "localhost"
  },
  "port": 2000
}
```

3. How about port `abc`? Let's check it: 

```shell
APP__PORT=abc npm start
```

Expected output:

```
Configuration error: port must be a number type, but the final value was: NaN (cast from the value "abc").
The causing value is defined in Environment variables as APP__PORT
```

**Want more?** Check the rest of [examples](..).
