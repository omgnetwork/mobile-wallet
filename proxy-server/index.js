require('dotenv').config()

const express = require('express')
const invariant = require('invariant')
const bodyParser = require('body-parser')

const CONFIG = require('./config')
const ethereumRpcProxy = require('./handlers/ethereum-rpc-proxy')
const rateLimiter = require('./utils/rate-limiter')
const Sentry = require('./utils/error-reporter')

console.log('Initializing mobile wallet proxy-server app...')
console.log('PORT:', CONFIG.PORT)
console.log('ETHEREUM_RPC_URL:', CONFIG.ETHEREUM_RPC_URL)
console.log('LOG_LEVEL:', CONFIG.LOG_LEVEL)

const app = express()

app.use(Sentry.Handlers.requestHandler())
app.use(rateLimiter)
app.use(bodyParser.json())
app.use('/', ethereumRpcProxy())
app.use(Sentry.Handlers.errorHandler())

app.listen(CONFIG.PORT)
