require('dotenv').config()

console.log('Initializing mobile wallet proxy-server app...')

const invariant = require('invariant')
const CONFIG = require('./config')

invariant(!!CONFIG.ETHEREUM_RPC_URL, 'Missing ETHEREUM_RPC_URL in environment.')
console.log('ETHEREUM_RPC_URL:', CONFIG.ETHEREUM_RPC_URL)

invariant(!!CONFIG.PORT, 'Missing PORT in environment.')
console.log('PORT:', CONFIG.PORT)

const express = require('express')
const expressApp = express()
const proxy = require('http-proxy-middleware')

// Proxy options
const options = {
  target: CONFIG.ETHEREUM_RPC_URL,
  changeOrigin: true,
  ws: true
};

const proxyServer = proxy(options)

expressApp.use('/', proxyServer)
expressApp.listen(CONFIG.PORT)
