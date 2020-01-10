const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const ethereumRpcProxy = require('../../handlers/ethereum-rpc-proxy')

var backend
var proxy

beforeAll(() => {
  const backendApp = express()
  backendApp.get('/', (req, res) => res.send('{"backend":"response"}'))
  backend = backendApp.listen(8545)

  const proxyApp = express()
  proxyApp.use(bodyParser.json())
  proxyApp.use('/', ethereumRpcProxy())
  proxy = proxyApp.listen(3000)
})

afterAll(() => {
  proxy && proxy.close()
  backend && backend.close()
})

describe('ethereum-rpc-proxy', function() {
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
