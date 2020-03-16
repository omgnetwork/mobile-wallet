const http = require('http')
const express = require('express')
const rateLimiter = require('../../utils/rate-limiter')
const CONFIG = require('../../config')

let app

describe('rateLimiter with backend available', function() {
  beforeAll(() => {
    // Mock rate limit for testing purpose
    CONFIG.RATE_LIMIT = 1

    const backendApp = express()
    backendApp.get('/api', rateLimiter(), (req, res) => res.send('OK'))
    app = backendApp.listen(3001)
  })

  afterAll(() => {
    app && app.close()
  })

  it('should returns error when number of requests exceeded the limit', function(done) {
    http.get('http://localhost:3001/api', res => {
      res.on('data', chunk => {
        const responseBody = chunk.toString()
        expect(responseBody).toBe('OK')
        done()
      })
    })
    http.get('http://localhost:3001/api', res => {
      res.on('data', chunk => {
        const responseBody = chunk.toString()
        expect(responseBody).toBe('Too many requests, please try again later.')
        done()
      })
    })
  })
})
