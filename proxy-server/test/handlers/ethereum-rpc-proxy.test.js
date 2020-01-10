const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const CONFIG = require('../../config')
const ethereumRpcProxy = require('../../handlers/ethereum-rpc-proxy')

var backend
var proxy

beforeAll(() => {
  const proxyApp = express()
  proxyApp.use(bodyParser.json())
  proxyApp.use('/', ethereumRpcProxy())
  proxy = proxyApp.listen(3000)
})

afterAll(() => {
  proxy && proxy.close()
})

describe('ethereum-rpc-proxy with backend available', function() {
  beforeAll(() => {
    const backendApp = express()
    backendApp.get('/', (req, res) => res.send('{"backend":"response"}'))
    backend = backendApp.listen(8545)
  })

  afterAll(() => {
    backend && backend.close()
  })

  it('should return a response from the backend', function(done) {
    http.get('http://localhost:3000', res => {
      res.on('data', chunk => {
        const responseBody = chunk.toString()
        expect(responseBody).toBe('{"backend":"response"}')
        done()
      })
    })
  })
})

describe('ethereum-rpc-proxy with backend unavailable', function() {
  it('should return an error response', function(done) {
    http.get('http://localhost:3000', res => {
      res.on('data', chunk => {
        const responseBody = chunk.toString()
        const message = 'Error occured while trying to proxy to: ' + CONFIG.ETHEREUM_RPC_URL + '/'
        expect(responseBody).toBe(message)
        done()
      })
    })
  })
})
