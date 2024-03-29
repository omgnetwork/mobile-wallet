const proxy = require('http-proxy-middleware')

const CONFIG = require('../config')
const errorReporter = require('../utils/error-reporter')
const { logger, logProvider } = require('../utils/logger')
const metrics = require('../utils/metrics')
const ipAddress = require('../utils/ip-address')

// Collect metrics on incoming requests
function requestReceivedHandler(proxyReq, req) {
  metrics.increment('mobile_api_proxy.num_requests')
  const originalIPAddress =
    ipAddress.getOriginalRequestIPFromCloudFlare(req) || req.ip
  // Log and measure the Ethereum's JSON-RPC method if `method` is provided.
  if (req.body.method) {
    metrics.increment('mobile_api_proxy.num_requests.' + req.body.method)
    logger.info('Proxying ETH: ' + originalIPAddress + ' -> ' + req.body.method)
  } else {
    logger.info(
      'Proxying HTTP: ' +
        originalIPAddress +
        ' -> ' +
        req.headers.host +
        req.url
    )
  }

  // body-parser doesn't play well with http-proxy-middleware, so we need to stringify
  // the json-encoded body back to its original form.
  //
  // See: https://github.com/chimurai/http-proxy-middleware/issues/320
  if (proxyReq.getHeader('Content-Type') === 'application/json') {
    const stringified = JSON.stringify(req.body)
    proxyReq.setHeader('Content-Length', Buffer.byteLength(stringified))
    proxyReq.write(stringified)
  }
}

// Collect metrics and report on backend errors.
//
// We want to trigger the metrics without interfering with the built in error handling,
// but there isn't an easy way to piggyback on the built in handler. So the original handler code
// is copied here.
//
// See: https://github.com/chimurai/http-proxy-middleware/blob/b13302c87a04bf7adc4c2547affaaeeb7ecb0c42/src/handlers.ts#L52-L73
function errorReceivedHandler(err, req, res) {
  const host = req.headers && req.headers.host
  const code = err.code

  errorReporter.captureException(err)
  metrics.increment('mobile_api_proxy.num_errors')

  if (res.writeHead && !res.headersSent) {
    switch (code) {
      case 'ECONNRESET':
      case 'ENOTFOUND':
      case 'ECONNREFUSED':
        res.writeHead(504)
        break
      default:
        res.writeHead(500)
    }
  }

  res.end('Error occured while trying to proxy for: ' + host + req.url)
}

// Build the proxy server
function ethereumRpcProxy() {
  return proxy({
    target: CONFIG.ETHEREUM_RPC_URL,
    changeOrigin: true, // To support name-based virtual hosts
    xfwd: true, // Let the host sees whom the request is being forwarded for
    ws: false, // No plans to interact with Ethereum client via websockets
    ignorePath: true, // Ignore the request path as we always want to request to https://<NETWORK>.infura.io/v3/<INFURA_API_KEY>.
    // Otherwise, the response will be failed because the client will override target to https://<NETWORK>.infura.io/
    // Reference: https://github.com/http-party/node-http-proxy/blob/master/lib/http-proxy/common.js#L86-L97
    logLevel: CONFIG.LOG_LEVEL,
    logProvider: logProvider, // A logger customized for more info
    onProxyReq: requestReceivedHandler,
    onError: errorReceivedHandler
  })
}

module.exports = ethereumRpcProxy
