# API proxy server for mobile-wallet

## Installation

Install the packages:

```shell
npm install
```

## Usage

Run the following command to start the proxy server:

```shell
node index.js
```

## Configurations

Configure these environment variables to modify the behaviour of the proxy server.

- `PORT`: The port that the proxy server listens to incoming requests. Defaults to `3000`.
- `ETHEREUM_RPC_URL`: The Ethereum client to forward the request to. Defaults to `http://localhost:8545`.
- `LOG_LEVEL`: The log level. Accepts "debug", "info", "warn", "error" and "silent". Defaults to `info`.
- `DD_HOSTNAME`: The DataDog's hostname. Defaults to `localhost`.
- `DD_PORT`: The DataDog's post. Defaults to `8125`.
- `RATE_LIMIT_WINDOW_MS`: The rate limit window period in milliseconds. Defaults to `3600000` (60 minutes).
- `RATE_LIMIT`: The number of requests allowed from a single IP per window period. Defaults to `600` (600 requests per IP per 60 minutes).
- `SENTRY_DSN`: The Sentry DSN to report errors to. Defaults to empty string (error not reported).
